import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FoodDonation, FoodMatch } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { getCategoryLabel, getStatusBadge, formatDateTime, getTimeRemaining } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Scale,
} from 'lucide-react';

export const DonationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donation, setDonation] = useState<FoodDonation | null>(null);
  const [aiMatches, setAiMatches] = useState<FoodMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [matchingLoading, setMatchingLoading] = useState<boolean>(false);
  const [requestQty, setRequestQty] = useState<number>(10);
  const [requestNotes, setRequestNotes] = useState<string>('Can distribute to community residents immediately.');
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>('');

  const loadDonation = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getDonationById(id);
      setDonation(data);
      setRequestQty(data.quantity);

      // Fetch AI Matches
      setMatchingLoading(true);
      const matches = await api.getAiMatches(id);
      setAiMatches(matches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setMatchingLoading(false);
    }
  };

  useEffect(() => {
    loadDonation();
  }, [id]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donation) return;
    setIsSubmitting(true);
    try {
      await api.createRequest({
        donationId: donation.id,
        requestedQuantity: Number(requestQty),
        notes: requestNotes,
      });
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      setSuccessToast('Your request has been submitted to the food donor!');
      setShowRequestModal(false);
      loadDonation();
    } catch (err: any) {
      alert(err.message || 'Error submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !donation) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-xs text-slate-500">
        <Sparkles className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-2" />
        <span>Loading food rescue details & running AI matching...</span>
      </div>
    );
  }

  const statusConfig = getStatusBadge(donation.status);
  const remaining = getTimeRemaining(donation.expiryTime);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Back button */}
      <Link
        to="/donations"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-forest-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Directory</span>
      </Link>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-forest-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image & Badges */}
        <div className="relative h-72 md:h-full bg-slate-100 min-h-[300px]">
          <img
            src={
              donation.imageUrl ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'
            }
            alt={donation.foodName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 backdrop-blur shadow-sm">
              {getCategoryLabel(donation.category)}
            </span>
            <UrgencyBadge urgency={donation.urgencyLevel} expiryTime={donation.expiryTime} showTimer={false} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
            <div className="text-xl font-extrabold bg-emerald-700/90 backdrop-blur px-3 py-1 rounded-xl">
              {donation.quantity} {donation.unit}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Right: Specifications & Safety */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">
                Food Donation Record
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {donation.foodName}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {donation.description}
            </p>

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Preparation Time</span>
                <span className="font-semibold text-slate-800">{formatDateTime(donation.preparationTime)}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Collection Deadline</span>
                <span className={`font-semibold ${remaining.isPast ? 'text-red-600' : 'text-slate-800'}`}>
                  {formatDateTime(donation.expiryTime)} ({remaining.text})
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Storage Protocol</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-slate-500" />
                  <span>{donation.storageConditions}</span>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Allergen Notice</span>
                <span className="font-semibold text-amber-800 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{donation.allergenInformation}</span>
                </span>
              </div>
            </div>

            {/* Donor & Location */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs space-y-1">
              <div className="font-bold text-forest-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-forest-700" />
                <span>Donor: {donation.donor?.organization?.organizationName || donation.donor?.name}</span>
              </div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{donation.pickupAddress}</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact: {donation.donorContact || donation.donor?.phone || 'Verified on platform'}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {user?.role === 'NGO' && donation.status === 'AVAILABLE' && (
            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span>Request Food Donation for Our NGO</span>
            </button>
          )}
        </div>
      </div>

      {/* MODULE 3: AI SMART MATCHING ENGINE RESULTS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Smart Matching Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Recommended NGO & Food Bank Receivers
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked using our 4-factor scoring model: Distance (35%), Urgency (30%), Quantity Suitability (20%), and Receiver Capacity (15%).
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-forest-800 border border-emerald-200">
            {aiMatches.length} Compatible Receivers Found
          </span>
        </div>

        {matchingLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Computing Haversine distance and capacity compatibility...
          </div>
        ) : aiMatches.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No matching NGOs within immediate radius. Try expanding search parameters.
          </div>
        ) : (
          <div className="space-y-4">
            {aiMatches.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-800 text-emerald-300 flex items-center justify-center font-black text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{m.organizationName || m.organization?.organizationName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {m.organization?.organizationType || 'NGO'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.distanceKm} km away</span>
                        <span>•</span>
                        <span>Daily Capacity: ~{m.organization?.capacity || 300} meals</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Match Score Badge */}
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-forest-800 border border-emerald-300 text-xs font-extrabold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{m.matchingScore}% Match</span>
                    </div>
                  </div>
                </div>

                {/* Sub-scores breakdown */}
                {m.subScores && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Distance (35%)</span>
                      <span className="font-bold text-slate-700">{m.subScores.distanceScore} pts</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Urgency (30%)</span>
                      <span className="font-bold text-slate-700">{m.subScores.urgencyScore} pts</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Quantity (20%)</span>
                      <span className="font-bold text-slate-700">{m.subScores.quantityScore} pts</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Capacity (15%)</span>
                      <span className="font-bold text-slate-700">{m.subScores.capacityScore} pts</span>
                    </div>
                  </div>
                )}

                {/* Explainable Match Reasons */}
                {m.matchingReason && (
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {m.matchingReason.split(' | ').map((reason, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-forest-900 border border-emerald-200/60 flex items-center gap-1 font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{reason}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Request {donation.foodName}</h3>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requested Quantity ({donation.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  max={donation.quantity}
                  required
                  value={requestQty}
                  onChange={(e) => setRequestQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distribution Notes
                </label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-forest-800 text-white text-xs font-bold shadow-md"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
