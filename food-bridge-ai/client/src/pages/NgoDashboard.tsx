import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FoodDonation, DonationRequest } from '../types';
import { DonationCard } from '../components/DonationCard';
import { getStatusBadge, formatDateTime } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  Building2,
  UtensilsCrossed,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [availableFood, setAvailableFood] = useState<FoodDonation[]>([]);
  const [myRequests, setMyRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [requestModalDonation, setRequestModalDonation] = useState<FoodDonation | null>(null);
  const [requestQty, setRequestQty] = useState<number>(10);
  const [requestNotes, setRequestNotes] = useState<string>('Can distribute immediately to 50 shelter residents.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [donations, requests] = await Promise.all([
        api.getDonations({
          status: 'AVAILABLE',
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          urgency: selectedUrgency !== 'ALL' ? selectedUrgency : undefined,
        }),
        api.getRequests(),
      ]);
      setAvailableFood(donations);
      setMyRequests(requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedUrgency]);

  const handleOpenRequest = (d: FoodDonation) => {
    setRequestModalDonation(d);
    setRequestQty(d.quantity);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalDonation) return;
    setIsSubmitting(true);
    try {
      await api.createRequest({
        donationId: requestModalDonation.id,
        requestedQuantity: Number(requestQty),
        notes: requestNotes,
      });
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.7 } });
      setToastMsg(`Successfully requested ${requestQty} ${requestModalDonation.unit} of "${requestModalDonation.foodName}"!`);
      setRequestModalDonation(null);
      setTimeout(() => setToastMsg(''), 4000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error submitting food request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
            <Building2 className="w-4 h-4" />
            <span>NGO / Food Bank Mission Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.organization?.organizationName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
            Discover surplus food from nearby verified restaurants and hotels. Request batches matching your community shelter capacity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Partner Organization</span>
          </span>
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
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Available Surplus</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-forest-900 mt-2">{availableFood.length}</div>
          <span className="text-[10px] text-slate-400">Ready for claim</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">My Active Requests</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">
            {myRequests.filter((r) => r.requestStatus === 'PENDING').length}
          </div>
          <span className="text-[10px] text-slate-400">Under donor review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Approved / Dispatched</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-2">
            {myRequests.filter((r) => r.requestStatus === 'APPROVED').length}
          </div>
          <span className="text-[10px] text-slate-400">Couriers assigned</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Daily Shelter Capacity</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {user?.organization?.capacity || 250} meals
          </div>
          <span className="text-[10px] text-slate-400">Distribution bandwidth</span>
        </div>
      </div>

      {/* 1. DISCOVER NEARBY SURPLUS FOOD FEED */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-forest-700" />
              <span>Surplus Food Available for Rescue</span>
            </h2>
            <p className="text-xs text-slate-500">Pickups organized across Mumbai & Maharashtra region</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-forest-800"
            >
              <option value="ALL">All Categories</option>
              <option value="COOKED_MEALS">Cooked Meals</option>
              <option value="FRUITS">Fruits</option>
              <option value="VEGETABLES">Vegetables</option>
              <option value="BAKERY">Bakery</option>
              <option value="PACKAGED_FOOD">Packaged</option>
              <option value="DAIRY">Dairy</option>
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-forest-800"
            >
              <option value="ALL">All Urgencies</option>
              <option value="CRITICAL">Critical (&lt;2h)</option>
              <option value="HIGH">High (2-6h)</option>
              <option value="MEDIUM">Medium (6-12h)</option>
              <option value="NORMAL">Normal (&gt;12h)</option>
            </select>

            <Link
              to="/map"
              className="px-3 py-1.5 text-xs rounded-xl bg-forest-800 text-white font-bold flex items-center gap-1 shadow-sm hover:bg-forest-900 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Map View</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : availableFood.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No surplus food currently matches this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableFood.map((d) => (
              <div key={d.id} className="relative flex flex-col">
                <DonationCard donation={d} />
                <button
                  onClick={() => handleOpenRequest(d)}
                  className="mt-2 w-full py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-emerald-300" />
                  <span>Request Food for Our NGO</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. MY REQUESTS & DELIVERY PROGRESS TRACKER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Requested Donations & Delivery Status</h2>
          <p className="text-xs text-slate-500">Track fulfillment and volunteer couriers dispatched to your site</p>
        </div>

        {myRequests.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl text-xs text-slate-500">
            No active requests. Browse available surplus food above and click "Request Food" to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Donor Restaurant</th>
                  <th className="py-3 px-4">Requested Qty</th>
                  <th className="py-3 px-4">Request Status</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myRequests.map((r) => {
                  const statusInfo = getStatusBadge(r.requestStatus as any);
                  const deliveryStatus = r.delivery?.deliveryStatus || 'PENDING_ASSIGNMENT';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.donation?.foodName}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {r.donation?.donor?.organization?.organizationName || r.donation?.donor?.name}
                      </td>
                      <td className="py-3 px-4 font-bold text-forest-900">
                        {r.requestedQuantity} {r.donation?.unit}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.color}`}>
                          {r.requestStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[11px] flex items-center gap-1 w-fit">
                          <Truck className="w-3 h-3 text-slate-500" />
                          <span>{deliveryStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {r.donation && (
                          <Link
                            to={`/donations/${r.donation.id}`}
                            className="text-xs font-bold text-forest-800 hover:underline"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Food Modal Dialog */}
      {requestModalDonation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">
                  Request Surplus Donation
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {requestModalDonation.foodName}
                </h3>
              </div>
              <button
                onClick={() => setRequestModalDonation(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>Available Total:</strong> {requestModalDonation.quantity} {requestModalDonation.unit}</div>
              <div><strong>Pickup Location:</strong> {requestModalDonation.pickupAddress}</div>
              <div><strong>Storage:</strong> {requestModalDonation.storageConditions}</div>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requested Quantity ({requestModalDonation.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  max={requestModalDonation.quantity}
                  required
                  value={requestQty}
                  onChange={(e) => setRequestQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distribution Notes for Donor
                </label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="e.g. Will distribute immediately to 45 community residents."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalDonation(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
