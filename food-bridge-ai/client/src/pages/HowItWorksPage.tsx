import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Clock,
  Scale,
  ShieldCheck,
  Building2,
  Truck,
  UtensilsCrossed,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DONOR' | 'NGO' | 'VOLUNTEER' | 'ADMIN'>('DONOR');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-forest-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>SYSTEM ARCHITECTURE & WORKFLOW</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How Food Bridge AI Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Explore the technology and logistics workflow powering Maharashtra’s smart food rescue network.
        </p>
      </div>

      {/* AI Smart Matching Engine Breakdown */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">Module 3 Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            The AI 4-Factor Smart Matching Algorithm
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Every published food donation runs through a transparent mathematical scoring model to match with the highest-priority nearby NGO or food bank.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-black text-forest-800">35%</span>
              <MapPin className="w-5 h-5 text-forest-700" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Distance (Haversine)</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Calculates great-circle distance between donor kitchen and NGO center. Organizations within &lt;5 km receive 100% proximity points.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-black text-amber-800">30%</span>
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Collection Urgency</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Monitors safe collection deadline. Items with &lt;2 hours remaining are elevated to Critical, triggering rapid response couriers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-black text-blue-800">20%</span>
              <Scale className="w-5 h-5 text-blue-700" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Quantity Suitability</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Ensures donation size matches receiver absorption capacity to prevent secondary spoilage at the food bank.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-black text-purple-800">15%</span>
              <ShieldCheck className="w-5 h-5 text-purple-700" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Receiver Capacity</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Prioritizes verified partner NGOs with cold storage units and documented distribution logs.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-700 font-mono">
          Final Match Score = (Distance × 0.35) + (Urgency × 0.30) + (Quantity Suitability × 0.20) + (Capacity × 0.15)
        </div>
      </section>

      {/* Role-Based Interactive Walkthrough */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">Role Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Tailored Experiences for Every Stakeholder
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab('DONOR')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'DONOR' ? 'bg-white text-forest-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Food Donors
          </button>
          <button
            onClick={() => setActiveTab('NGO')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'NGO' ? 'bg-white text-forest-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            NGOs & Food Banks
          </button>
          <button
            onClick={() => setActiveTab('VOLUNTEER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'VOLUNTEER' ? 'bg-white text-forest-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            Volunteers
          </button>
          <button
            onClick={() => setActiveTab('ADMIN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ADMIN' ? 'bg-white text-forest-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admins
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {activeTab === 'DONOR' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Food Donor Workflow (Restaurants, Hotels, Caterers)</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Publish surplus food in 60 seconds with photos, allergen details, and pickup windows. Receive automated matches with nearby food banks, accept requests with one click, and track volunteer couriers on the live map.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-forest-800 mb-1">1. Fast Publishing</div>
                  <p className="text-xs text-slate-500">Categorize cooked meals, bakery, dairy, and fruits with safe collection deadlines.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-forest-800 mb-1">2. 1-Click Approval</div>
                  <p className="text-xs text-slate-500">Review incoming requests from verified charities and dispatch immediately.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-forest-800 mb-1">3. Impact Dashboard</div>
                  <p className="text-xs text-slate-500">Track total kilograms rescued, meals served, and ESG sustainability reporting.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NGO' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">NGO & Food Bank Workflow</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Discover surplus food listings filtered by distance radius, food category, and urgency level. Submit requests with required quantities, track approved donations, and verify receipts upon delivery.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-blue-800 mb-1">1. Discovery Feed</div>
                  <p className="text-xs text-slate-500">Real-time alerts for urgent surplus near your distribution center.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-blue-800 mb-1">2. Quantity Reservation</div>
                  <p className="text-xs text-slate-500">Request partial or full batch sizes matched to your daily meal capacity.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-blue-800 mb-1">3. Delivery Tracking</div>
                  <p className="text-xs text-slate-500">Watch volunteer couriers in transit and confirm digital handover.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'VOLUNTEER' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Volunteer & Delivery Partner Hub</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Empower citizens and local couriers to accept nearby rescue missions. View route maps between restaurant kitchens and food banks, update status to "Picked Up" and "Delivered", and upload delivery confirmation proof.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-amber-800 mb-1">1. Browse Tasks</div>
                  <p className="text-xs text-slate-500">Claim deliveries based on your vehicle type (motorcycle, car, van).</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-amber-800 mb-1">2. Map Navigation</div>
                  <p className="text-xs text-slate-500">OpenStreetMap integration displays optimized pickup and dropoff routes.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-amber-800 mb-1">3. Proof of Delivery</div>
                  <p className="text-xs text-slate-500">Complete missions with photo verification and earn volunteer impact credits.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ADMIN' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Admin Control & Verification Center</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Comprehensive oversight across the entire redistribution network: verify NGO certifications, monitor reported food items, inspect audit logs, and oversee system analytics.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-purple-800 mb-1">1. NGO Verification</div>
                  <p className="text-xs text-slate-500">Review organization credentials and approve official verified partner status.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-purple-800 mb-1">2. Safety Oversight</div>
                  <p className="text-xs text-slate-500">Monitor urgency scanners and flag expired or suspicious listings.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-purple-800 mb-1">3. Immutable Audit Log</div>
                  <p className="text-xs text-slate-500">Every single donation, request, and status change is logged with timestamps.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
