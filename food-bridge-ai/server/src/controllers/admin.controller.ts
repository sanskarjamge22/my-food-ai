import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.query;
    const where: any = {};
    if (role && role !== 'ALL') {
      where.role = role as string;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        organization: true,
        volunteerProfile: true,
        _count: {
          select: { donations: true, auditLogs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const verifyOrganization = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'VERIFIED' | 'REJECTED' | 'PENDING'

    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: { verificationStatus: status },
    });

    // Notify organization user
    await prisma.notification.create({
      data: {
        userId: organization.userId,
        title: `Organization Status: ${status}`,
        message:
          status === 'VERIFIED'
            ? `Congratulations! ${organization.organizationName} has been officially verified on Food Bridge AI.`
            : `Your organization verification status was updated to ${status}.`,
        type: status === 'VERIFIED' ? 'INFO' : 'ALERT',
        link: '/profile',
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: `ORGANIZATION_${status}`,
        entityType: 'Organization',
        entityId: organization.id,
        details: `Updated verification status to ${status} by admin`,
      },
    });

    return res.json({
      success: true,
      message: `Organization verification status updated to ${status}`,
      organization: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};
