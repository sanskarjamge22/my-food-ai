import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

const router = Router();

// GET /api/organizations
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const where: any = {};
    if (type && type !== 'ALL') {
      where.organizationType = type as string;
    } else {
      where.organizationType = { in: ['NGO', 'FOOD_BANK', 'SHELTER', 'RESTAURANT', 'HOTEL'] };
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
});

export default router;
