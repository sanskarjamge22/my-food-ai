import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { config } from '../config';
import { registerSchema, loginSchema } from '../validators';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    // Create user and related profile inside transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: validated.name,
          email: validated.email.toLowerCase(),
          passwordHash,
          role: validated.role,
          phone: validated.phone || null,
        },
      });

      // If role is DONOR or NGO, create Organization
      if (validated.role === 'DONOR' || validated.role === 'NGO') {
        await tx.organization.create({
          data: {
            userId: newUser.id,
            organizationName: validated.organizationName || `${validated.name}'s Organization`,
            organizationType: validated.organizationType || (validated.role === 'DONOR' ? 'RESTAURANT' : 'NGO'),
            address: validated.address || 'Mumbai, Maharashtra, India',
            city: validated.city || 'Mumbai',
            latitude: validated.latitude || 19.0760,
            longitude: validated.longitude || 72.8777,
            capacity: validated.capacity || 100,
            verificationStatus: validated.role === 'DONOR' ? 'VERIFIED' : 'PENDING',
          },
        });
      }

      // If role is VOLUNTEER, create Volunteer record
      if (validated.role === 'VOLUNTEER') {
        await tx.volunteer.create({
          data: {
            userId: newUser.id,
            transportType: validated.transportType || 'MOTORCYCLE',
            vehicleNumber: validated.vehicleNumber || 'MH-02-AB-1234',
          },
        });
      }

      // Welcome notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          title: 'Welcome to Food Bridge AI! 🌿',
          message: `Your account as a ${validated.role} has been created successfully. Together, let's rescue food and feed lives.`,
          type: 'INFO',
        },
      });

      return newUser;
    });

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { organization: true, volunteerProfile: true },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: fullUser!.id,
        name: fullUser!.name,
        email: fullUser!.email,
        role: fullUser!.role,
        phone: fullUser!.phone,
        organization: fullUser!.organization,
        volunteerProfile: fullUser!.volunteerProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
      include: {
        organization: true,
        volunteerProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        volunteerProfile: user.volunteerProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        organization: true,
        volunteerProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        volunteerProfile: user.volunteerProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};
