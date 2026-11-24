import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FoodDonation, DashboardStats, UserRole } from '../types';
import { DonationCard } from '../components/DonationCard';
import {
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  TrendingUp,
  Building2,
  Truck,
  UtensilsCrossed,
  Sparkles,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [featuredDonations, setFeaturedDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, donationsData] = await Promise.all([
          api.getDashboardStats(),
          api.getDonations({ status: 'AVAILABLE' }),
        ]);
        setStats(statsData);
        setFeaturedDonations(donationsData.slice(0, 3));
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleQuickDemo = async (role: UserRole, targetRoute: string) => {
    await switchDemoRole(role);
    navigate(targetRoute);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-surface pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/40 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800 text-emerald-200 text-xs font-bold tracking-wide shadow-sm mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI-POWERED FOOD RESCUE PLATFORM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-medium text-emerald-300">Live in Maharashtra</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Rescue Food. <span className="text-forest-800 underline decoration-emerald-400 decoration-wavy decoration-2">Reduce Waste.</span> Feed Lives.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every day, edible food is discarded while communities go hungry. <strong className="text-slate-800 font-semibold">Food Bridge AI</strong> connects restaurants, hotels, and supermarkets with verified NGOs and volunteer couriers using an intelligent 4-factor matching engine.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/add-donation"
              className="px-7 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm sm:text-base shadow-lg shadow-forest-800/30 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <UtensilsCrossed className="w-5 h-5 text-emerald-300" />
              <span>Donate Surplus Food</span>
            </Link>

            <Link
              to="/donations"
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-forest-800 border-2 border-forest-800 font-bold text-sm sm:text-base shadow-sm hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <Building2 className="w-5 h-5 text-forest-800" />
              <span>Find Food (NGOs)</span>
            </Link>

            <Link
              to="/deliveries"
              className="px-6 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-sm sm:text-base shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <Truck className="w-5 h-5 text-slate-950" />
              <span>Become a Volunteer</span>
            </Link>
          </div>

          {/* Quick Demo Experience Selector Bar */}
          <div className="mt-12 max-w-2xl mx-auto p-3 bg-white/80 backdrop-blur rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Hackathon Demo:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleQuickDemo('DONOR', '/donor-dashboard')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-forest-800 font-semibold border border-emerald-200"
              >
                Donor Demo
              </button>
              <button
                onClick={() => handleQuickDemo('NGO', '/ngo-dashboard')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold border border-blue-200"
              >
                NGO Demo
              </button>
              <button
                onClick={() => handleQuickDemo('VOLUNTEER', '/volunteer-dashboard')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200"
              >
                Volunteer Demo
              </button>
              <button
                onClick={() => handleQuickDemo('ADMIN', '/admin-dashboard')}
                className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold border border-purple-200"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-forest-200 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Food Rescued</span>
              <div className="p-2 bg-emerald-100 text-forest-800 rounded-xl">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-forest-900">
              {stats?.totalFoodRescuedKg ? `${stats.totalFoodRescuedKg} kg` : '620+ kg'}
            </div>
            <p className="mt-1 text-xs text-slate-500">Diverted from urban landfills</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-forest-200 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Meals Provided</span>
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
              {stats?.estimatedMeals ? `${stats.estimatedMeals}` : '1,550+'}
            </div>
            <p className="mt-1 text-xs text-slate-500">Wholesome community servings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-forest-200 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Trips</span>
              <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
              {stats?.completedDeliveries ? `${stats.completedDeliveries}` : '68+'}
            </div>
            <p className="mt-1 text-xs text-slate-500">Volunteer rescue dispatches</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-forest-200 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CO₂e Diverted</span>
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-forest-800">
              {stats?.estimatedCo2PreventedKg ? `${stats.estimatedCo2PreventedKg} kg` : '1,550 kg'}
            </div>
            <p className="mt-1 text-xs text-slate-500">Prevented greenhouse emission</p>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-forest-800 uppercase tracking-wider">The Urgency of Now</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            Why Food Redistribution Requires Intelligent Automation
          </h3>
          <p className="text-slate-600 text-sm mt-3">
            Traditional food donation fails because cooked meals are perishable and coordination is fragmented.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Problem */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-8 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">The Food Waste Paradox</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Restaurants, banquet halls, and supermarkets discard fresh food daily because manual discovery of recipients is too slow and logistically unpredictable.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center flex-shrink-0 text-xs font-bold">✕</span>
                <span>Unpredictable surplus timing makes planning impossible</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center flex-shrink-0 text-xs font-bold">✕</span>
                <span>Cooked food spoils within 4 hours if not matched rapidly</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center flex-shrink-0 text-xs font-bold">✕</span>
                <span>Lack of volunteer drivers and route coordination</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center flex-shrink-0 text-xs font-bold">✕</span>
                <span>Zero visibility on verified safety and storage conditions</span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-8 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-forest-800 flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-6 h-6 text-forest-700" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">The Food Bridge AI Solution</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Our automated redistribution bridge balances distance, urgency, and capacity to turn food waste into dignified community nutrition.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-forest-900 flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                <span><strong>Instant AI Matching:</strong> 4-factor scoring (Distance, Urgency, Capacity, Compatibility)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-forest-900 flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                <span><strong>Dynamic Urgency Detection:</strong> Countdown badges prioritize imminent perishables</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-forest-900 flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                <span><strong>Volunteer Dispatch Network:</strong> 1-click delivery claiming with turn-by-turn route maps</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-forest-900 flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                <span><strong>Food Safety Protocols:</strong> Mandatory temperature & allergen declaration</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. LIVE RESCUE FEED PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Food Rescue Board</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Active Surplus Listings Needing Pickup
            </h3>
          </div>
          <Link
            to="/donations"
            className="mt-3 sm:mt-0 text-sm font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1.5"
          >
            <span>View All Surplus Food</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredDonations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">All surplus food is currently claimed or rescued!</p>
            <p className="text-xs text-slate-500 mt-1">Check back shortly or publish a new food donation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDonations.map((d) => (
              <DonationCard key={d.id} donation={d} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS 4-STEP WORKFLOW */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Seamless Pipeline</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              From Kitchen Surplus to Community Meals in 4 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-lg flex items-center justify-center mb-4 border border-emerald-400/30">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">Publish Surplus</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Restaurants enter quantity, safe collection deadline, storage conditions, and allergen information in under 60 seconds.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-lg flex items-center justify-center mb-4 border border-emerald-400/30">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">AI Smart Match</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our algorithm scores nearby NGOs based on distance (35%), urgency (30%), quantity suitability (20%), and receiver capacity (15%).
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-lg flex items-center justify-center mb-4 border border-emerald-400/30">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">Volunteer Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Couriers and community volunteers claim the pickup assignment and navigate using live OpenStreetMap directions.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-lg flex items-center justify-center mb-4 border border-emerald-400/30">
                04
              </div>
              <h4 className="text-base font-bold text-white mb-2">Verified Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Food arrives at the NGO shelter. Delivery is confirmed with digital verification, updating real-time carbon & hunger impact metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-800 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Turn Food Waste Into Hope?
            </h3>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Join dozens of restaurants, hotels, charities, and passionate volunteers across Maharashtra making zero food waste a reality.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl bg-white text-forest-900 font-extrabold text-sm hover:bg-emerald-50 transition-colors shadow-md"
              >
                Create Free Account
              </Link>
              <Link
                to="/map"
                className="px-8 py-3.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-600 transition-colors border border-emerald-400/30"
              >
                Explore Live Map
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
