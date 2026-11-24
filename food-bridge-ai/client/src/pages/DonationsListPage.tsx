import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { FoodDonation, FoodCategory, UrgencyLevel } from '../types';
import { DonationCard } from '../components/DonationCard';
import {
  UtensilsCrossed,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export const DonationsListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'ALL');
  const [urgency, setUrgency] = useState<string>(searchParams.get('urgency') || 'ALL');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'ALL');

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Cooked Meals', value: 'COOKED_MEALS' },
    { label: 'Bakery & Bread', value: 'BAKERY' },
    { label: 'Fresh Fruits', value: 'FRUITS' },
    { label: 'Vegetables', value: 'VEGETABLES' },
    { label: 'Dairy', value: 'DAIRY' },
    { label: 'Packaged', value: 'PACKAGED_FOOD' },
  ];

  const urgencies: { label: string; value: string }[] = [
    { label: 'All Urgencies', value: 'ALL' },
    { label: '🚨 Critical (<2h)', value: 'CRITICAL' },
    { label: 'High (2-6h)', value: 'HIGH' },
    { label: 'Medium (6-12h)', value: 'MEDIUM' },
    { label: 'Normal (>12h)', value: 'NORMAL' },
  ];

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await api.getDonations({
        category: category !== 'ALL' ? category : undefined,
        urgency: urgency !== 'ALL' ? urgency : undefined,
        status: status !== 'ALL' ? status : undefined,
        search: searchTerm || undefined,
      });
      setDonations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [category, urgency, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDonations();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
          <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
          <span>Surplus Redistribution Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Available Surplus Food Listings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Discover verified commercial food batches ready for rescue across Maharashtra
        </p>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, ingredients, or pickup location..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-2 uppercase">Category:</span>
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  category === c.value
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-2 uppercase">Urgency:</span>
            {urgencies.map((u) => (
              <button
                key={u.value}
                onClick={() => setUrgency(u.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  urgency === u.value
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500">
            Showing {donations.length} food listing{donations.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No surplus food listings match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or clearing search terms.</p>
            <button
              onClick={() => {
                setCategory('ALL');
                setUrgency('ALL');
                setStatus('ALL');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((d) => (
              <DonationCard key={d.id} donation={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
