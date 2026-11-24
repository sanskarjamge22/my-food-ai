import { UrgencyLevel, FoodCategory, FoodStatus } from '../types';

export const formatDateTime = (dateStr: string | Date | undefined): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeRemaining = (expiryStr: string | Date | undefined): { text: string; isPast: boolean; hours: number } => {
  if (!expiryStr) return { text: 'Unknown', isPast: false, hours: 999 };
  const now = new Date().getTime();
  const exp = new Date(expiryStr).getTime();
  const diffMs = exp - now;
  const hours = diffMs / (1000 * 60 * 60);

  if (diffMs <= 0) {
    return { text: 'Expired', isPast: true, hours: 0 };
  }

  const h = Math.floor(diffMs / (1000 * 60 * 60));
  const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (h === 0) {
    return { text: `${m} mins remaining`, isPast: false, hours };
  }
  return { text: `${h}h ${m}m remaining`, isPast: false, hours };
};

export const getUrgencyConfig = (urgency: UrgencyLevel) => {
  switch (urgency) {
    case 'CRITICAL':
      return {
        label: 'Critical (< 2h)',
        badgeClass: 'bg-red-500/15 text-red-700 border-red-300 animate-pulse',
        dotClass: 'bg-red-500',
        cardBorder: 'border-red-300 ring-1 ring-red-200',
      };
    case 'HIGH':
      return {
        label: 'High (2–6h)',
        badgeClass: 'bg-orange-500/15 text-orange-700 border-orange-300',
        dotClass: 'bg-orange-500',
        cardBorder: 'border-orange-200',
      };
    case 'MEDIUM':
      return {
        label: 'Medium (6–12h)',
        badgeClass: 'bg-amber-500/15 text-amber-700 border-amber-300',
        dotClass: 'bg-amber-500',
        cardBorder: 'border-amber-200',
      };
    case 'NORMAL':
      return {
        label: 'Normal (> 12h)',
        badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-300',
        dotClass: 'bg-emerald-500',
        cardBorder: 'border-slate-200',
      };
    case 'EXPIRED':
      return {
        label: 'Expired',
        badgeClass: 'bg-gray-500/15 text-gray-700 border-gray-300',
        dotClass: 'bg-gray-500',
        cardBorder: 'border-gray-200 opacity-60',
      };
    default:
      return {
        label: urgency,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-400',
        cardBorder: 'border-slate-200',
      };
  }
};

export const getCategoryLabel = (cat: FoodCategory): string => {
  const map: Record<FoodCategory, string> = {
    COOKED_MEALS: 'Cooked Meals',
    FRUITS: 'Fresh Fruits',
    VEGETABLES: 'Fresh Vegetables',
    BAKERY: 'Bakery & Bread',
    PACKAGED_FOOD: 'Packaged Food',
    DAIRY: 'Dairy Products',
    OTHER: 'Other Edibles',
  };
  return map[cat] || cat;
};

export const getStatusBadge = (status: FoodStatus) => {
  switch (status) {
    case 'AVAILABLE':
      return { label: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'REQUESTED':
      return { label: 'Requested', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'APPROVED':
      return { label: 'Approved', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'ASSIGNED':
      return { label: 'Volunteer Assigned', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'PICKED_UP':
      return { label: 'Picked Up (In Transit)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'DELIVERED':
      return { label: 'Delivered Rescued', color: 'bg-green-100 text-green-900 border-green-300 font-semibold' };
    case 'EXPIRED':
      return { label: 'Expired Closed', color: 'bg-gray-100 text-gray-600 border-gray-200' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};
