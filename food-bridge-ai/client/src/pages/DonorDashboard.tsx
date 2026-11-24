import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FoodDonation, DonationRequest } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { getCategoryLabel, getStatusBadge, formatDateTime } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  PlusCircle,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Building2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myDonations, setMyDonations] = useState<FoodDonation[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [donations, requests] = await Promise.all([
        api.getDonations({ donorId: user?.id }),
        api.getRequests(),
      ]);
      setMyDonations(donations);
      setIncomingRequests(requests.filter((r) => r.requestStatus === 'PENDING'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleApprove = async (requestId: string) => {
    try {
      await api.approveRequest(requestId);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      setActionMessage('Request approved! A delivery partner has been notified.');
      setTimeout(() => setActionMessage(''), 4000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error approving request');
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm('Are you sure you want to decline this request?')) return;
    try {
      await api.rejectRequest(requestId);
      setActionMessage('Request rejected.');
      setTimeout(() => setActionMessage(''), 4000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error rejecting request');
    }
  };

  // Compute metrics
  const totalKg = myDonations.reduce((acc, d) => {
    if (d.unit === 'kg') return acc + d.quantity;
    if (d.unit === 'meals') return acc + d.quantity * 0.4;
    return acc + d.quantity;
  }, 0);

  const activeCount = myDonations.filter((d) => d.status === 'AVAILABLE' || d.status === 'REQUESTED').length;
  const rescuedCount = myDonations.filter((d) => d.status === 'DELIVERED').length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Food Donor Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.organization?.organizationName || user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
            Manage your surplus commercial kitchen listings, review incoming NGO requests, and monitor volunteer couriers in real-time.
          </p>
        </div>

        <Link
          to="/add-donation"
          className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:scale-105 transition-all flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Surplus Food</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-forest-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Listings</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-forest-900 mt-2">{activeCount}</div>
          <span className="text-[10px] text-slate-400">Available for claim</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Requests</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">{incomingRequests.length}</div>
          <span className="text-[10px] text-blue-500 font-medium">Awaiting your approval</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Food Rescued</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{Math.round(totalKg)} kg</div>
          <span className="text-[10px] text-slate-400">Across all contributions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Delivered Batches</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">{rescuedCount}</div>
          <span className="text-[10px] text-slate-400">Successfully distributed</span>
        </div>
      </div>

      {/* 1. INCOMING NGO REQUESTS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Incoming NGO Requests Needing Approval
              </h2>
              <p className="text-xs text-slate-500">
                Charities and food banks requesting surplus batches from your kitchen
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {incomingRequests.length} Pending
          </span>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
            No pending requests at this time. When an NGO requests your food, it will appear here for 1-click approval.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {incomingRequests.map((req) => (
              <div key={req.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {req.organization?.organizationName || 'Verified NGO'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {req.organization?.organizationType || 'NGO'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Requested: <strong className="text-forest-900">{req.requestedQuantity} units</strong> of "{req.donation?.foodName}"
                  </div>
                  {req.notes && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{req.notes}"
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>📍 {req.organization?.address}</span>
                    <span>•</span>
                    <span>Received {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Approve & Dispatch</span>
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs border border-slate-200 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. MY PUBLISHED DONATIONS LIST */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Food Donation Listings</h2>
            <p className="text-xs text-slate-500">All surplus food posted by your organization</p>
          </div>
          <Link
            to="/add-donation"
            className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
          >
            <span>+ Add New Listing</span>
          </Link>
        </div>

        {myDonations.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No surplus donations published yet.</p>
            <Link
              to="/add-donation"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-bold"
            >
              Publish First Donation
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Collection Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myDonations.map((d) => {
                  const statusInfo = getStatusBadge(d.status);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{d.foodName}</div>
                        <div className="text-[11px] text-slate-400">Added: {formatDateTime(d.createdAt)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {getCategoryLabel(d.category)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {d.quantity} {d.unit}
                      </td>
                      <td className="py-3 px-4">
                        <UrgencyBadge urgency={d.urgencyLevel} expiryTime={d.expiryTime} showTimer={true} />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/donations/${d.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-forest-800 font-bold text-[11px] transition-colors"
                        >
                          <span>AI Matches</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
