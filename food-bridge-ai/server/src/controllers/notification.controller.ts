import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== user.id) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
