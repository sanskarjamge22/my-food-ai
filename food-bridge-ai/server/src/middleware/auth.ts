import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../utils/prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  organizationId?: string;
  volunteerId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string; email: string };
    
    // Fetch user to confirm still exists and attach organization or volunteer id
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        organization: true,
        volunteerProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      organizationId: user.organization?.id,
      volunteerId: user.volunteerProfile?.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Action requires one of roles: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};
