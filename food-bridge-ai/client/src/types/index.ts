export type UserRole = 'DONOR' | 'NGO' | 'VOLUNTEER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
  organization?: Organization | null;
  volunteerProfile?: VolunteerProfile | null;
}

export interface Organization {
  id: string;
  userId: string;
  organizationName: string;
  organizationType: 'RESTAURANT' | 'HOTEL' | 'SUPERMARKET' | 'NGO' | 'FOOD_BANK' | 'SHELTER' | 'OTHER';
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  capacity: number;
  contactPerson?: string | null;
  description?: string | null;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  availability: boolean;
  transportType: 'MOTORCYCLE' | 'CAR' | 'VAN' | 'BICYCLE' | 'ON_FOOT';
  vehicleNumber?: string | null;
  currentLatitude: number;
  currentLongitude: number;
  totalDeliveries: number;
}

export type FoodCategory =
  | 'COOKED_MEALS'
  | 'FRUITS'
  | 'VEGETABLES'
  | 'BAKERY'
  | 'PACKAGED_FOOD'
  | 'DAIRY'
  | 'OTHER';

export type FoodStatus =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'EXPIRED'
  | 'CANCELLED';

export type UrgencyLevel = 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED';

export interface FoodDonation {
  id: string;
  donorId: string;
  donor?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    organization?: Organization | null;
  };
  foodName: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  unit: string;
  preparationTime: string;
  expiryTime: string;
  pickupAddress: string;
  latitude: number;
  longitude: number;
  storageConditions: 'ROOM_TEMP' | 'REFRIGERATED' | 'FROZEN' | 'WARM_HOT';
  allergenInformation: string;
  imageUrl?: string | null;
  status: FoodStatus;
  urgencyLevel: UrgencyLevel;
  donorContact?: string | null;
  distanceKm?: number | null;
  createdAt: string;
  updatedAt: string;
  requests?: DonationRequest[];
  deliveries?: Delivery[];
  matches?: FoodMatch[];
}

export interface DonationRequest {
  id: string;
  donationId: string;
  donation?: FoodDonation;
  organizationId: string;
  organization?: Organization;
  requestedQuantity: number;
  requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  delivery?: Delivery;
}

export interface Delivery {
  id: string;
  donationId: string;
  donation: FoodDonation;
  requestId: string;
  request: DonationRequest;
  volunteerId?: string | null;
  volunteer?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  } | null;
  pickupTime?: string | null;
  deliveryTime?: string | null;
  deliveryStatus: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  proofImage?: string | null;
  notes?: string | null;
  transitDistanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'REQUEST' | 'STATUS' | 'URGENT' | 'ALERT';
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface FoodMatch {
  id: string;
  donationId: string;
  organizationId: string;
  organization?: Organization;
  organizationName?: string;
  matchingScore: number;
  matchingReason?: string;
  distanceKm: number;
  matchReasons?: string[];
  subScores?: {
    distanceScore: number;
    urgencyScore: number;
    quantityScore: number;
    capacityScore: number;
  };
}

export interface DashboardStats {
  totalDonations: number;
  totalFoodRescuedKg: number;
  completedDeliveries: number;
  availableDonations: number;
  activeNGOs: number;
  activeVolunteers: number;
  pendingRequests: number;
  expiredDonations: number;
  estimatedMeals: number;
  estimatedCo2PreventedKg: number;
  disclaimer: string;
}
