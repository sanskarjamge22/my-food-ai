import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { createRequestSchema } from '../validators';

export const getRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, donationId } = req.query;
    const user = req.user!;

    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.requestStatus = status as string;
    }

    if (donationId) {
      whereClause.donationId = donationId as string;
    }

    // Role-based visibility:
    // If NGO, view requests made by their organization
    // If Donor, view requests made for their donations
    // If Admin/Volunteer, view all or relevant
    if (user.role === 'NGO') {
      const org = await prisma.organization.findUnique({ where: { userId: user.id } });
      if (org) {
        whereClause.organizationId = org.id;
      }
    } else if (user.role === 'DONOR') {
      whereClause.donation = {
        donorId: user.id,
      };
    }

    const requests = await prisma.donationRequest.findMany({
      where: whereClause,
      include: {
        donation: {
          include: {
            donor: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        organization: true,
        delivery: {
          include: {
            volunteer: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

export const createRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const validated = createRequestSchema.parse(req.body);

    const org = await prisma.organization.findUnique({
      where: { userId: user.id },
    });

    if (!org) {
      return res.status(400).json({
        success: false,
        message: 'You must have an organization profile registered to request food donations.',
      });
    }

    const donation = await prisma.foodDonation.findUnique({
      where: { id: validated.donationId },
      include: { donor: true },
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.status === 'EXPIRED' || donation.status === 'DELIVERED' || donation.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: `Cannot request food donation with status ${donation.status}.`,
      });
    }

    // Check if duplicate pending request already exists from this org
    const existingReq = await prisma.donationRequest.findFirst({
      where: {
        donationId: donation.id,
        organizationId: org.id,
        requestStatus: 'PENDING',
      },
    });

    if (existingReq) {
      return res.status(400).json({
        success: false,
        message: 'A pending request has already been submitted for this food donation.',
      });
    }

    const request = await prisma.$transaction(async (tx) => {
      const newReq = await tx.donationRequest.create({
        data: {
          donationId: donation.id,
          organizationId: org.id,
          requestedQuantity: validated.requestedQuantity,
          notes: validated.notes || null,
          requestStatus: 'PENDING',
        },
        include: {
          organization: true,
          donation: true,
        },
      });

      // Update donation status to REQUESTED if still AVAILABLE
      if (donation.status === 'AVAILABLE') {
        await tx.foodDonation.update({
          where: { id: donation.id },
          data: { status: 'REQUESTED' },
        });
      }

      // Notify donor
      await tx.notification.create({
        data: {
          userId: donation.donorId,
          title: 'New Food Donation Request! 📬',
          message: `${org.organizationName} requested ${validated.requestedQuantity} ${donation.unit} of "${donation.foodName}".`,
          type: 'REQUEST',
          link: '/donor-dashboard',
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'REQUEST_SUBMITTED',
          entityType: 'DonationRequest',
          entityId: newReq.id,
          details: `Requested ${validated.requestedQuantity} ${donation.unit} for org ${org.organizationName}`,
        },
      });

      return newReq;
    });

    return res.status(201).json({
      success: true,
      message: 'Request submitted successfully. The donor has been notified.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const request = await prisma.donationRequest.findUnique({
      where: { id },
      include: {
        donation: true,
        organization: true,
      },
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.donation.donorId !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only the donation owner or admin can approve this request.',
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark request as APPROVED
      const updatedReq = await tx.donationRequest.update({
        where: { id },
        data: { requestStatus: 'APPROVED' },
      });

      // 2. Mark donation as APPROVED
      await tx.foodDonation.update({
        where: { id: request.donationId },
        data: { status: 'APPROVED' },
      });

      // 3. Create Delivery task
      const delivery = await tx.delivery.upsert({
        where: { requestId: request.id },
        update: {
          deliveryStatus: 'ASSIGNED',
        },
        create: {
          donationId: request.donationId,
          requestId: request.id,
          deliveryStatus: 'ASSIGNED',
        },
      });

      // 4. Notify NGO
      await tx.notification.create({
        data: {
          userId: request.organization.userId,
          title: 'Donation Request Approved! 🎉',
          message: `Your request for "${request.donation.foodName}" has been approved by the donor. Volunteer dispatch is in progress!`,
          type: 'STATUS',
          link: '/ngo-dashboard',
        },
      });

      // 5. Notify all active volunteers in area
      const activeVolunteers = await tx.volunteer.findMany({
        where: { availability: true },
        include: { user: true },
        take: 5,
      });

      for (const vol of activeVolunteers) {
        await tx.notification.create({
          data: {
            userId: vol.userId,
            title: 'New Delivery Task Available! 🛵',
            message: `Pickup: ${request.donation.foodName} from ${request.donation.pickupAddress} to ${request.organization.organizationName}.`,
            type: 'INFO',
            link: '/volunteer-dashboard',
          },
        });
      }

      return { updatedReq, delivery };
    });

    return res.json({
      success: true,
      message: 'Request approved! Delivery mission initialized and volunteers notified.',
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const request = await prisma.donationRequest.findUnique({
      where: { id },
      include: {
        donation: true,
        organization: true,
      },
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.donation.donorId !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only the donation owner or admin can reject this request.',
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.donationRequest.update({
        where: { id },
        data: { requestStatus: 'REJECTED' },
      });

      // Check if there are other pending requests; if not, revert donation to AVAILABLE
      const pendingCount = await tx.donationRequest.count({
        where: {
          donationId: request.donationId,
          requestStatus: 'PENDING',
        },
      });

      if (pendingCount === 0) {
        await tx.foodDonation.update({
          where: { id: request.donationId },
          data: { status: 'AVAILABLE' },
        });
      }

      // Notify NGO
      await tx.notification.create({
        data: {
          userId: request.organization.userId,
          title: 'Donation Request Status Update',
          message: `Your request for "${request.donation.foodName}" could not be accepted at this time.`,
          type: 'INFO',
          link: '/ngo-dashboard',
        },
      });
    });

    return res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    next(error);
  }
};
