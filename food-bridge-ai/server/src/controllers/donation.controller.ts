import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { createDonationSchema, updateDonationSchema } from '../validators';
import { calculateUrgency } from '../services/urgency.service';
import { AiMatchingService, calculateDistanceKm } from '../services/aiMatching.service';

export const getOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const where: any = {};
    if (type && type !== 'ALL') {
      where.organizationType = type as string;
    } else {
      where.organizationType = { in: ['NGO', 'FOOD_BANK', 'SHELTER'] };
    }

    const organizations = await prisma.organization.findMany({
      where,
      select: {
        id: true,
        userId: true,
        organizationName: true,
        organizationType: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        verificationStatus: true,
        capacity: true,
        contactPerson: true,
      },
    });

    return res.json({ success: true, count: organizations.length, organizations });
  } catch (error) {
    next(error);
  }
};

export const getDonations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { category, status, urgency, search, donorId, city, lat, lng, radiusKm } = req.query;

    const whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = category as string;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status as string;
    }

    if (donorId) {
      whereClause.donorId = donorId as string;
    }

    if (search) {
      whereClause.OR = [
        { foodName: { contains: search as string } },
        { description: { contains: search as string } },
        { pickupAddress: { contains: search as string } },
      ];
    }

    const donations = await prisma.foodDonation.findMany({
      where: whereClause,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            organization: true,
          },
        },
        requests: {
          include: {
            organization: true,
          },
        },
        deliveries: {
          include: {
            volunteer: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Dynamically update urgency level and compute distance if coordinates provided
    const now = new Date();
    const formatted = donations.map((d) => {
      const calculatedUrgency = calculateUrgency(d.expiryTime);
      let distanceKm: number | null = null;
      if (lat && lng) {
        distanceKm = calculateDistanceKm(
          parseFloat(lat as string),
          parseFloat(lng as string),
          d.latitude,
          d.longitude
        );
      }

      return {
        ...d,
        urgencyLevel: calculatedUrgency,
        distanceKm,
      };
    });

    // Filter by urgency if requested
    let filtered = formatted;
    if (urgency && urgency !== 'ALL') {
      filtered = filtered.filter((d) => d.urgencyLevel === urgency);
    }

    // Filter by radius if coordinates provided
    if (radiusKm && lat && lng) {
      const radius = parseFloat(radiusKm as string);
      filtered = filtered.filter((d) => d.distanceKm !== null && d.distanceKm <= radius);
    }

    return res.json({
      success: true,
      count: filtered.length,
      donations: filtered,
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const donation = await prisma.foodDonation.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            organization: true,
          },
        },
        requests: {
          include: {
            organization: true,
          },
        },
        deliveries: {
          include: {
            volunteer: {
              include: { user: true },
            },
          },
        },
        matches: {
          include: {
            organization: true,
          },
          orderBy: { matchingScore: 'desc' },
        },
      },
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    const urgencyLevel = calculateUrgency(donation.expiryTime);

    return res.json({
      success: true,
      donation: {
        ...donation,
        urgencyLevel,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const validated = createDonationSchema.parse(req.body);

    const prepTime = new Date(validated.preparationTime);
    const expTime = new Date(validated.expiryTime);

    if (expTime <= prepTime) {
      return res.status(400).json({
        success: false,
        message: 'Expiry/Collection deadline must be after preparation time.',
      });
    }

    const urgencyLevel = calculateUrgency(expTime);

    if (urgencyLevel === 'EXPIRED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot create donation that is already past its safe collection deadline.',
      });
    }

    const donation = await prisma.foodDonation.create({
      data: {
        donorId: req.user.id,
        foodName: validated.foodName,
        category: validated.category,
        description: validated.description,
        quantity: validated.quantity,
        unit: validated.unit,
        preparationTime: prepTime,
        expiryTime: expTime,
        pickupAddress: validated.pickupAddress,
        latitude: validated.latitude,
        longitude: validated.longitude,
        storageConditions: validated.storageConditions,
        allergenInformation: validated.allergenInformation,
        imageUrl: validated.imageUrl || null,
        donorContact: validated.donorContact || req.user.email,
        status: 'AVAILABLE',
        urgencyLevel,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DONATION_CREATED',
        entityType: 'FoodDonation',
        entityId: donation.id,
        details: `Created donation: ${donation.foodName} (${donation.quantity} ${donation.unit})`,
      },
    });

    // Trigger AI Smart Matching in background and notify top matching NGOs
    AiMatchingService.findMatchesForDonation(donation.id)
      .then(async (matches) => {
        // Send alert notifications to top 3 matching NGOs
        const top3 = matches.slice(0, 3);
        for (const match of top3) {
          const org = await prisma.organization.findUnique({
            where: { id: match.organizationId },
          });
          if (org) {
            await prisma.notification.create({
              data: {
                userId: org.userId,
                title: 'New Matched Surplus Food Available! 🍲',
                message: `${donation.foodName} (${donation.quantity} ${donation.unit}) is available ~${match.distanceKm} km away. Match Score: ${match.matchingScore}%!`,
                type: 'REQUEST',
                link: `/donations/${donation.id}`,
              },
            });
          }
        }
      })
      .catch((err) => console.error('Error generating AI matches:', err));

    return res.status(201).json({
      success: true,
      message: 'Food donation published successfully! AI matching is analyzing nearby receivers.',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await prisma.foodDonation.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (existing.donorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this donation' });
    }

    const validated = updateDonationSchema.parse(req.body);

    const updated = await prisma.foodDonation.update({
      where: { id },
      data: {
        ...validated,
        ...(validated.preparationTime && { preparationTime: new Date(validated.preparationTime) }),
        ...(validated.expiryTime && {
          expiryTime: new Date(validated.expiryTime),
          urgencyLevel: calculateUrgency(new Date(validated.expiryTime)),
        }),
      },
    });

    return res.json({
      success: true,
      message: 'Donation updated successfully',
      donation: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await prisma.foodDonation.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (existing.donorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this donation' });
    }

    await prisma.foodDonation.delete({ where: { id } });

    return res.json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    next(error);
  }
};
