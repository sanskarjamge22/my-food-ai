import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { assignDeliverySchema, updateDeliveryStatusSchema } from '../validators';
import { calculateDistanceKm } from '../services/aiMatching.service';

export const getVolunteers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatar: true },
        },
      },
    });

    return res.json({ success: true, count: volunteers.length, volunteers });
  } catch (error) {
    next(error);
  }
};

export const getDeliveries = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const user = req.user!;

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.deliveryStatus = status as string;
    }

    // If volunteer, show assignments for this volunteer or unassigned tasks
    if (user.role === 'VOLUNTEER' && user.volunteerId) {
      whereClause.OR = [
        { volunteerId: user.volunteerId },
        { volunteerId: null, deliveryStatus: 'ASSIGNED' },
      ];
    }

    const deliveries = await prisma.delivery.findMany({
      where: whereClause,
      include: {
        donation: {
          include: {
            donor: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        request: {
          include: {
            organization: true,
          },
        },
        volunteer: {
          include: {
            user: {
              select: { id: true, name: true, phone: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format deliveries with computed distance between pickup and dropoff
    const formatted = deliveries.map((del) => {
      const distance = calculateDistanceKm(
        del.donation.latitude,
        del.donation.longitude,
        del.request.organization.latitude,
        del.request.organization.longitude
      );

      return {
        ...del,
        transitDistanceKm: distance,
      };
    });

    return res.json({ success: true, count: formatted.length, deliveries: formatted });
  } catch (error) {
    next(error);
  }
};

export const assignDelivery = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { deliveryId, volunteerId } = req.body;

    const targetVolunteerId =
      volunteerId || (user.role === 'VOLUNTEER' ? user.volunteerId : null);

    if (!targetVolunteerId) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer ID is required to claim this delivery.',
      });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        donation: true,
        request: {
          include: { organization: true },
        },
      },
    });

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery record not found' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const del = await tx.delivery.update({
        where: { id: deliveryId },
        data: {
          volunteerId: targetVolunteerId,
          deliveryStatus: 'ASSIGNED',
        },
        include: {
          volunteer: { include: { user: true } },
          donation: true,
          request: { include: { organization: true } },
        },
      });

      // Update donation status to ASSIGNED
      await tx.foodDonation.update({
        where: { id: delivery.donationId },
        data: { status: 'ASSIGNED' },
      });

      // Notify Donor
      await tx.notification.create({
        data: {
          userId: delivery.donation.donorId,
          title: 'Volunteer Assigned to Pickup! 🛵',
          message: `${del.volunteer?.user.name || 'A volunteer'} has been assigned to pick up "${delivery.donation.foodName}".`,
          type: 'STATUS',
          link: '/donor-dashboard',
        },
      });

      // Notify NGO
      await tx.notification.create({
        data: {
          userId: delivery.request.organization.userId,
          title: 'Volunteer On the Way! 🛵',
          message: `${del.volunteer?.user.name || 'A volunteer'} has claimed the delivery of "${delivery.donation.foodName}".`,
          type: 'STATUS',
          link: '/ngo-dashboard',
        },
      });

      return del;
    });

    return res.json({
      success: true,
      message: 'Delivery mission assigned successfully',
      delivery: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateDeliveryStatusSchema.parse(req.body);
    const user = req.user!;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        donation: true,
        request: { include: { organization: true } },
        volunteer: { include: { user: true } },
      },
    });

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    const now = new Date();
    const updateData: any = {
      deliveryStatus: validated.deliveryStatus,
      notes: validated.notes || delivery.notes,
    };

    if (validated.proofImage) {
      updateData.proofImage = validated.proofImage;
    }

    if (validated.deliveryStatus === 'PICKED_UP' && !delivery.pickupTime) {
      updateData.pickupTime = now;
    }

    if (validated.deliveryStatus === 'DELIVERED') {
      updateData.deliveryTime = now;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const del = await tx.delivery.update({
        where: { id },
        data: updateData,
        include: {
          donation: true,
          request: { include: { organization: true } },
          volunteer: { include: { user: true } },
        },
      });

      // Update food donation lifecycle status
      let newDonationStatus = delivery.donation.status;
      if (validated.deliveryStatus === 'PICKED_UP') {
        newDonationStatus = 'PICKED_UP';
      } else if (validated.deliveryStatus === 'DELIVERED') {
        newDonationStatus = 'DELIVERED';

        // Increment volunteer completed deliveries
        if (delivery.volunteerId) {
          await tx.volunteer.update({
            where: { id: delivery.volunteerId },
            data: { totalDeliveries: { increment: 1 } },
          });
        }
      }

      await tx.foodDonation.update({
        where: { id: delivery.donationId },
        data: { status: newDonationStatus },
      });

      // Send status notifications
      const statusText =
        validated.deliveryStatus === 'PICKED_UP'
          ? 'Food Picked Up by Volunteer'
          : validated.deliveryStatus === 'DELIVERED'
          ? 'Food Successfully Delivered! 🎯'
          : `Delivery Status: ${validated.deliveryStatus}`;

      // Notify Donor
      await tx.notification.create({
        data: {
          userId: delivery.donation.donorId,
          title: statusText,
          message: `Update for "${delivery.donation.foodName}": ${statusText}.`,
          type: 'STATUS',
          link: '/donor-dashboard',
        },
      });

      // Notify NGO
      await tx.notification.create({
        data: {
          userId: delivery.request.organization.userId,
          title: statusText,
          message: `Update for "${delivery.donation.foodName}": ${statusText}. Please verify receipt.`,
          type: 'STATUS',
          link: '/ngo-dashboard',
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: `DELIVERY_${validated.deliveryStatus}`,
          entityType: 'Delivery',
          entityId: delivery.id,
          details: `Status changed to ${validated.deliveryStatus} by ${user.name}`,
        },
      });

      return del;
    });

    return res.json({
      success: true,
      message: `Delivery status updated to ${validated.deliveryStatus}`,
      delivery: updated,
    });
  } catch (error) {
    next(error);
  }
};
