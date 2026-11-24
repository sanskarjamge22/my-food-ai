import { prisma } from '../utils/prisma';
import { calculateUrgency } from './urgency.service';

export interface MatchScoreResult {
  organizationId: string;
  organizationName: string;
  organizationType: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  verificationStatus: string;
  capacity: number;
  contactPerson: string | null;
  distanceKm: number;
  matchingScore: number;
  subScores: {
    distanceScore: number;
    urgencyScore: number;
    quantityScore: number;
    capacityScore: number;
  };
  urgencyLevel: string;
  matchReasons: string[];
  algorithmType: 'RULE_BASED_TRANSPARENT' | 'LLM_HYBRID';
}

/**
 * Haversine formula to compute great-circle distance between two coordinates in kilometers
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

/**
 * Intelligent Smart Matching Service
 * Weights:
 * - Distance: 35%
 * - Urgency: 30%
 * - Quantity Suitability: 20%
 * - Receiver Capacity: 15%
 */
export class AiMatchingService {
  /**
   * Find and rank eligible NGOs / Food Banks for a given food donation
   */
  static async findMatchesForDonation(donationId: string): Promise<MatchScoreResult[]> {
    const donation = await prisma.foodDonation.findUnique({
      where: { id: donationId },
      include: { donor: true },
    });

    if (!donation) {
      throw new Error('Food donation not found');
    }

    // Find active NGOs and Food Banks
    const organizations = await prisma.organization.findMany({
      where: {
        organizationType: { in: ['NGO', 'FOOD_BANK', 'SHELTER'] },
      },
    });

    const now = new Date();
    const expiry = new Date(donation.expiryTime);
    const hoursRemaining = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    const urgency = calculateUrgency(donation.expiryTime);

    const matchResults: MatchScoreResult[] = [];

    for (const org of organizations) {
      const distance = calculateDistanceKm(
        donation.latitude,
        donation.longitude,
        org.latitude,
        org.longitude
      );

      // 1. Distance Score (35%)
      // Closer is better: < 3km = 100, 3-7km = 85, 7-15km = 65, 15-25km = 45, >25km decays
      let rawDistanceScore = 0;
      if (distance <= 3) rawDistanceScore = 100;
      else if (distance <= 7) rawDistanceScore = 85;
      else if (distance <= 15) rawDistanceScore = 65;
      else if (distance <= 25) rawDistanceScore = 45;
      else rawDistanceScore = Math.max(10, 100 - distance * 3);

      const distanceScore = rawDistanceScore * 0.35;

      // 2. Urgency Score (30%)
      // If urgency is critical or high, closer organizations get higher priority
      let rawUrgencyScore = 50;
      if (urgency === 'CRITICAL') {
        rawUrgencyScore = distance < 8 ? 100 : 70;
      } else if (urgency === 'HIGH') {
        rawUrgencyScore = distance < 12 ? 90 : 75;
      } else if (urgency === 'MEDIUM') {
        rawUrgencyScore = 80;
      } else {
        rawUrgencyScore = 70;
      }
      const urgencyScore = rawUrgencyScore * 0.3;

      // 3. Quantity Suitability Score (20%)
      // Compare donation quantity with organization capacity
      const capacityRatio = org.capacity > 0 ? Math.min(1, donation.quantity / org.capacity) : 0.5;
      let rawQuantityScore = 0;
      if (org.capacity >= donation.quantity) {
        // Org can take the whole donation
        rawQuantityScore = 100;
      } else {
        // Org can take a substantial portion
        rawQuantityScore = Math.max(30, (org.capacity / donation.quantity) * 100);
      }
      const quantityScore = rawQuantityScore * 0.2;

      // 4. Receiver Capacity & Verification (15%)
      let rawCapacityScore = 70;
      if (org.verificationStatus === 'VERIFIED') {
        rawCapacityScore += 20;
      }
      if (org.capacity >= 100) {
        rawCapacityScore += 10;
      }
      rawCapacityScore = Math.min(100, rawCapacityScore);
      const capacityScore = rawCapacityScore * 0.15;

      // Total weighted score
      const totalScore = Math.round(distanceScore + urgencyScore + quantityScore + capacityScore);

      // Generate explainable match reasons
      const matchReasons: string[] = [];
      if (distance <= 5) {
        matchReasons.push(`Proximity: Exceptional proximity (${distance} km away). Fast collection possible.`);
      } else if (distance <= 15) {
        matchReasons.push(`Accessible distance: Located ${distance} km from donation pickup site.`);
      } else {
        matchReasons.push(`Regional responder: ${distance} km distance; suitable for scheduled delivery.`);
      }

      if (urgency === 'CRITICAL' || urgency === 'HIGH') {
        matchReasons.push(`Urgency Priority: Matches collection window (< ${Math.max(1, Math.round(hoursRemaining))}h remaining).`);
      }

      if (org.capacity >= donation.quantity) {
        matchReasons.push(`Capacity Match: Can accommodate entire ${donation.quantity} ${donation.unit} quantity.`);
      } else {
        matchReasons.push(`Partial Capacity: Can absorb up to ${org.capacity} units.`);
      }

      if (org.verificationStatus === 'VERIFIED') {
        matchReasons.push(`Verified Partner: Trusted organization with verified distribution capacity.`);
      }

      matchResults.push({
        organizationId: org.id,
        organizationName: org.organizationName,
        organizationType: org.organizationType,
        address: org.address,
        city: org.city,
        latitude: org.latitude,
        longitude: org.longitude,
        verificationStatus: org.verificationStatus,
        capacity: org.capacity,
        contactPerson: org.contactPerson,
        distanceKm: distance,
        matchingScore: Math.min(100, Math.max(0, totalScore)),
        subScores: {
          distanceScore: Math.round(distanceScore * 10) / 10,
          urgencyScore: Math.round(urgencyScore * 10) / 10,
          quantityScore: Math.round(quantityScore * 10) / 10,
          capacityScore: Math.round(capacityScore * 10) / 10,
        },
        urgencyLevel: urgency,
        matchReasons,
        algorithmType: 'RULE_BASED_TRANSPARENT',
      });
    }

    // Sort descending by matching score
    matchResults.sort((a, b) => b.matchingScore - a.matchingScore);

    // Save top matches to database for persistence
    const topMatches = matchResults.slice(0, 5);
    for (const match of topMatches) {
      await prisma.foodMatch.upsert({
        where: {
          id: `${donation.id}_${match.organizationId}`,
        },
        update: {
          matchingScore: match.matchingScore,
          matchingReason: match.matchReasons.join(' | '),
          distanceKm: match.distanceKm,
        },
        create: {
          id: `${donation.id}_${match.organizationId}`,
          donationId: donation.id,
          organizationId: match.organizationId,
          matchingScore: match.matchingScore,
          matchingReason: match.matchReasons.join(' | '),
          distanceKm: match.distanceKm,
        },
      }).catch(() => {
        // Fallback create if composite id isn't unique constraint
        return prisma.foodMatch.create({
          data: {
            donationId: donation.id,
            organizationId: match.organizationId,
            matchingScore: match.matchingScore,
            matchingReason: match.matchReasons.join(' | '),
            distanceKm: match.distanceKm,
          },
        }).catch(() => null);
      });
    }

    return matchResults;
  }
}
