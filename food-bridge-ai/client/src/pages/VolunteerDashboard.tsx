import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Delivery } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { formatDateTime } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Camera,
  Check,
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [proofNote, setProofNote] = useState<string>('Handed over in fresh condition to charity supervisor.');

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await api.getDeliveries();
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, [user]);

  const handleClaim = async (deliveryId: string) => {
    try {
      await api.assignDelivery({ deliveryId });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      setToastMsg('Mission accepted! You are now assigned to this rescue delivery.');
      setTimeout(() => setToastMsg(''), 4000);
      loadDeliveries();
    } catch (err: any) {
      alert(err.message || 'Error claiming delivery');
    }
  };

  const handleUpdateStatus = async (
    deliveryId: string,
    status: 'PICKED_UP' | 'DELIVERED'
  ) => {
    try {
      await api.updateDeliveryStatus(deliveryId, {
        deliveryStatus: status,
        proofImage:
          status === 'DELIVERED'
            ? 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60'
            : undefined,
        notes: proofNote,
      });

      if (status === 'DELIVERED') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setToastMsg('Delivery verified and completed! Thank you for feeding lives! 🌟');
      } else {
        setToastMsg('Status updated: Food Picked Up and In Transit! 🛵');
      }
      setTimeout(() => setToastMsg(''), 4000);
      loadDeliveries();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const myAssigned = deliveries.filter(
    (d) =>
      d.volunteer?.id === user?.volunteerProfile?.id ||
      (d.volunteer?.user?.id === user?.id && d.deliveryStatus !== 'DELIVERED')
  );

  const availableTasks = deliveries.filter(
    (d) => d.deliveryStatus === 'ASSIGNED' && (!d.volunteerId || d.volunteerId === null)
  );

  const completedTrips = deliveries.filter(
    (d) =>
      d.deliveryStatus === 'DELIVERED' &&
      (d.volunteer?.id === user?.volunteerProfile?.id || d.volunteer?.user?.id === user?.id)
  );

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-200 mb-1">
            <Truck className="w-4 h-4" />
            <span>Volunteer Courier Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hero on the Road, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl leading-relaxed">
            Transport surplus food safely from commercial kitchens to verified NGO shelters and community dining centers.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-2xl border border-white/20 text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Active Vehicle: {user?.volunteerProfile?.transportType || 'MOTORCYCLE'}</span>
          </div>
          <div className="text-[11px] text-amber-200 mt-0.5">
            Plate: {user?.volunteerProfile?.vehicleNumber || 'MH-02-CD-5432'}
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-forest-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Assignments</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">{myAssigned.length}</div>
          <span className="text-[10px] text-slate-400">Trips in progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Available Tasks</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-forest-800 mt-2">{availableTasks.length}</div>
          <span className="text-[10px] text-slate-400">Needing couriers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Deliveries</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {(user?.volunteerProfile?.totalDeliveries || 0) + completedTrips.length}
          </div>
          <span className="text-[10px] text-slate-400">Missions completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimated Meals Rescued</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {((user?.volunteerProfile?.totalDeliveries || 0) + completedTrips.length) * 45}
          </div>
          <span className="text-[10px] text-slate-400">Fed to community</span>
        </div>
      </div>

      {/* 1. ACTIVE MISSIONS UNDERWAY */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-amber-600" />
              <span>Your Active Delivery Missions</span>
            </h2>
            <p className="text-xs text-slate-500">Pick up from donor and hand over to recipient NGO</p>
          </div>
          <Link
            to="/map"
            className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
          >
            <span>Open GPS Route Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myAssigned.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl text-xs text-slate-500 border border-dashed border-slate-200">
            You currently have no active deliveries. Browse the unassigned tasks below to claim a mission!
          </div>
        ) : (
          <div className="space-y-4">
            {myAssigned.map((del) => {
              const isPickedUp = del.deliveryStatus === 'PICKED_UP';
              return (
                <div
                  key={del.id}
                  className="p-5 rounded-2xl border border-amber-200/90 bg-amber-50/30 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        Active Mission
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900">
                        {del.donation?.foodName} ({del.request?.requestedQuantity} {del.donation?.unit})
                      </h3>
                    </div>
                    <UrgencyBadge urgency={del.donation?.urgencyLevel as any} expiryTime={del.donation?.expiryTime} showTimer={true} />
                  </div>

                  {/* Route Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-forest-800 flex items-center gap-1.5">
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>PICKUP: {del.donation?.donor?.organization?.organizationName || 'Donor'}</span>
                      </div>
                      <div className="text-slate-600">📍 {del.donation?.pickupAddress}</div>
                      <div className="text-[11px] text-slate-400">Contact: {del.donation?.donorContact || del.donation?.donor?.phone}</div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-blue-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>DROPOFF: {del.request?.organization?.organizationName}</span>
                      </div>
                      <div className="text-slate-600">📍 {del.request?.organization?.address}</div>
                      <div className="text-[11px] text-slate-400">
                        Recipient Capacity: ~{del.request?.organization?.capacity} meals
                      </div>
                    </div>
                  </div>

                  {/* Status update actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold">Current State:</span>
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                        {del.deliveryStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {!isPickedUp ? (
                        <button
                          onClick={() => handleUpdateStatus(del.id, 'PICKED_UP')}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm Food Picked Up</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(del.id, 'DELIVERED')}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Camera className="w-4 h-4 text-emerald-300" />
                          <span>Complete & Handover Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. AVAILABLE MISSIONS BOARD (NEEDS COURIER) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Available Rescue Deliveries Needing Couriers
          </h2>
          <p className="text-xs text-slate-500">
            Approved surplus food batches ready for immediate pickup across Mumbai
          </p>
        </div>

        {availableTasks.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl text-xs text-slate-500">
            All approved donations currently have assigned couriers!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {availableTasks.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900">
                    {t.donation?.foodName} ({t.request?.requestedQuantity} {t.donation?.unit})
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span>From: <strong>{t.donation?.donor?.organization?.organizationName || 'Donor'}</strong></span>
                    <span>→</span>
                    <span>To: <strong>{t.request?.organization?.organizationName}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    📍 {t.donation?.pickupAddress} • Est. Transit: ~{t.transitDistanceKm || 4.2} km
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(t.id)}
                  className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4 text-emerald-300" />
                  <span>Accept Mission</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
