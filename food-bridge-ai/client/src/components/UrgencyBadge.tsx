import React from 'react';
import { UrgencyLevel } from '../types';
import { getUrgencyConfig, getTimeRemaining } from '../utils/helpers';
import { Clock, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  expiryTime?: string | Date;
  showTimer?: boolean;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  expiryTime,
  showTimer = false,
  className = '',
}) => {
  const config = getUrgencyConfig(urgency);
  const remaining = expiryTime ? getTimeRemaining(expiryTime) : null;

  const renderIcon = () => {
    switch (urgency) {
      case 'CRITICAL':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />;
      case 'HIGH':
        return <AlertCircle className="w-3.5 h-3.5 text-orange-600" />;
      case 'MEDIUM':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'NORMAL':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}>
      {renderIcon()}
      <span>{config.label}</span>
      {showTimer && remaining && !remaining.isPast && (
        <span className="opacity-80 font-normal">({remaining.text})</span>
      )}
    </div>
  );
};
