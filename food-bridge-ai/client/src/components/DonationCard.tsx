import React from 'react';
import { Link } from 'react-router-dom';
import { FoodDonation } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { getCategoryLabel, getStatusBadge, getTimeRemaining } from '../utils/helpers';
import { MapPin, Thermometer, AlertCircle, ArrowRight, Clock, Building2 } from 'lucide-react';

interface DonationCardProps {
  donation: FoodDonation;
  onQuickRequest?: (donation: FoodDonation) => void;
  showAiScore?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({ donation, onQuickRequest }) => {
  const statusConfig = getStatusBadge(donation.status);
  const remaining = getTimeRemaining(donation.expiryTime);

  // Storage condition icon label
  const getStorageLabel = (condition: string) => {
    switch (condition) {
      case 'WARM_HOT':
        return 'Keep Warm (>60°C)';
      case 'REFRIGERATED':
        return 'Chilled (<4°C)';
      case 'FROZEN':
        return 'Deep Freeze';
      default:
        return 'Room Temp';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image & Badges header */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={
            donation.imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'
          }
          alt={donation.foodName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 backdrop-blur shadow-sm">
            {getCategoryLabel(donation.category)}
          </span>
          <UrgencyBadge urgency={donation.urgencyLevel} expiryTime={donation.expiryTime} showTimer={false} />
        </div>

        {/* Bottom overlay: Status & Quantity */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
          <div className="text-sm font-extrabold bg-emerald-700/90 backdrop-blur px-2.5 py-0.5 rounded-lg">
            {donation.quantity} {donation.unit}
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Content body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-forest-800 transition-colors">
            {donation.foodName}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {donation.description}
          </p>

          {/* Donor info & Location */}
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
              <span className="font-medium text-slate-700 truncate">
                {donation.donor?.organization?.organizationName || donation.donor?.name || 'Verified Food Business'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{donation.pickupAddress}</span>
              {donation.distanceKm !== undefined && donation.distanceKm !== null && (
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded ml-auto flex-shrink-0">
                  {donation.distanceKm} km
                </span>
              )}
            </div>
          </div>

          {/* Storage & Allergen Chips */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              <Thermometer className="w-3 h-3 text-slate-500" />
              {getStorageLabel(donation.storageConditions)}
            </span>
            {donation.allergenInformation && donation.allergenInformation !== 'None declared' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200/60">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                {donation.allergenInformation}
              </span>
            )}
          </div>
        </div>

        {/* Footer with deadline & actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Deadline:</span>
            <span className={`font-semibold ${remaining.isPast ? 'text-red-600' : 'text-slate-800'}`}>
              {remaining.text}
            </span>
          </div>

          <Link
            to={`/donations/${donation.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-forest-800 hover:text-forest-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>View & AI Match</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
