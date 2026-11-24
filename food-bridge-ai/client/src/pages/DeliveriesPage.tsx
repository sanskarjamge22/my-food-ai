import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { formatDateTime } from '../utils/helpers';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed,
  Building2,
  Camera,
  Navigation,
} from 'lucide-react';

export const DeliveriesPage: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await api.getDeliveries({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, [statusFilter]);

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-forest-900 border-emerald-300';
      case 'PICKED_UP':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Redistribution Logistics Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Food Rescue Delivery Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            End-to-end audit trail of all volunteer pickup and delivery dispatches
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
          >
            <option value="ALL">All Mission Statuses</option>
            <option value="ASSIGNED">Assigned (Waiting Pickup)</option>
            <option value="PICKED_UP">Picked Up (In Transit)</option>
            <option value="DELIVERED">Delivered (Completed)</option>
          </select>
        </div>
      </div>

      {/* Deliveries list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">No deliveries found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((del) => (
            <div
              key={del.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {del.donation?.foodName} ({del.request?.requestedQuantity} {del.donation?.unit})
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      Mission ID: <code className="font-mono">{del.id.slice(0, 8)}</code> • Logged {formatDateTime(del.createdAt)}
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusColor(del.deliveryStatus)}`}>
                  {del.deliveryStatus}
                </span>
              </div>

              {/* Transit Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="font-bold text-forest-800 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>ORIGIN: {del.donation?.donor?.organization?.organizationName || 'Donor'}</span>
                  </div>
                  <div className="text-slate-600">📍 {del.donation?.pickupAddress}</div>
                  <div className="text-[11px] text-slate-400">
                    {del.pickupTime ? `Picked up at: ${formatDateTime(del.pickupTime)}` : 'Awaiting pickup'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="font-bold text-blue-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>DESTINATION: {del.request?.organization?.organizationName}</span>
                  </div>
                  <div className="text-slate-600">📍 {del.request?.organization?.address}</div>
                  <div className="text-[11px] text-slate-400">
                    {del.deliveryTime ? `Delivered at: ${formatDateTime(del.deliveryTime)}` : 'In distribution queue'}
                  </div>
                </div>
              </div>

              {/* Courier info & notes */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-2">
                <div className="text-slate-600 flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Volunteer Courier:</span>
                  <span className="font-medium bg-emerald-50 text-forest-900 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                    {del.volunteer?.user?.name || 'Assigned Courier Partner'}
                  </span>
                </div>

                {del.notes && (
                  <div className="text-slate-500 italic text-[11px]">
                    "{del.notes}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
