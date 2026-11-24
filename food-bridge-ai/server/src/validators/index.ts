import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['DONOR', 'NGO', 'VOLUNTEER', 'ADMIN']),
  phone: z.string().optional(),
  organizationName: z.string().optional(),
  organizationType: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacity: z.number().optional(),
  transportType: z.string().optional(),
  vehicleNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createDonationSchema = z.object({
  foodName: z.string().min(2, 'Food name is required'),
  category: z.enum([
    'COOKED_MEALS',
    'FRUITS',
    'VEGETABLES',
    'BAKERY',
    'PACKAGED_FOOD',
    'DAIRY',
    'OTHER',
  ]),
  description: z.string().min(5, 'Detailed description is required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.enum(['kg', 'meals', 'packets', 'boxes', 'portions']),
  preparationTime: z.string().or(z.date()),
  expiryTime: z.string().or(z.date()),
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  latitude: z.number(),
  longitude: z.number(),
  storageConditions: z.enum(['ROOM_TEMP', 'REFRIGERATED', 'FROZEN', 'WARM_HOT']),
  allergenInformation: z.string().default('None declared'),
  imageUrl: z.string().optional().nullable(),
  donorContact: z.string().optional().nullable(),
});

export const updateDonationSchema = createDonationSchema.partial();

export const createRequestSchema = z.object({
  donationId: z.string().uuid(),
  requestedQuantity: z.number().positive('Requested quantity must be greater than 0'),
  notes: z.string().optional(),
});

export const assignDeliverySchema = z.object({
  requestId: z.string().uuid(),
  volunteerId: z.string().uuid(),
  notes: z.string().optional(),
});

export const updateDeliveryStatusSchema = z.object({
  deliveryStatus: z.enum(['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']),
  proofImage: z.string().optional(),
  notes: z.string().optional(),
});
