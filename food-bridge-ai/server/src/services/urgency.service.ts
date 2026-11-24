import { prisma } from '../utils/prisma';

export type UrgencyLevel = 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED';

/**
 * Calculates urgency level based on remaining hours until expiry
 */
export const calculateUrgency = (expiryTime: Date): UrgencyLevel => {
  const now = new Date();
  const diffMs = new Date(expiryTime).getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 0) {
    return 'EXPIRED';
  } else if (diffHours < 2) {
    return 'CRITICAL';
  } else if (diffHours < 6) {
    return 'HIGH';
  } else if (diffHours < 12) {
    return 'MEDIUM';
  } else {
    return 'NORMAL';
  }
};

/**
 * Periodic scanner to refresh urgency levels and flag expired donations in database
 */
export const scanAndExpireDonations = async () => {
  try {
    const activeDonations = await prisma.foodDonation.findMany({
      where: {
        status: { in: ['AVAILABLE', 'REQUESTED'] },
      },
    });

    const now = new Date();
    for (const donation of activeDonations) {
      const urgency = calculateUrgency(donation.expiryTime);
      const isExpired = new Date(donation.expiryTime) <= now;

      if (isExpired && donation.status !== 'EXPIRED') {
        await prisma.foodDonation.update({
          where: { id: donation.id },
          data: {
            status: 'EXPIRED',
            urgencyLevel: 'EXPIRED',
          },
        });

        // Notify donor that their listing expired
        await prisma.notification.create({
          data: {
            userId: donation.donorId,
            title: 'Donation Listing Expired',
            message: `Your food donation listing "${donation.foodName}" has passed its collection deadline and has been marked as expired.`,
            type: 'ALERT',
          },
        });
      } else if (urgency !== donation.urgencyLevel) {
        await prisma.foodDonation.update({
          where: { id: donation.id },
          data: { urgencyLevel: urgency },
        });
      }
    }
  } catch (error) {
    console.error('Error during urgency scanner run:', error);
  }
};
