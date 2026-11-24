import React from 'react';
import { HeartHandshake, ShieldCheck, Globe, Users, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-forest-800 text-xs font-bold">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>ABOUT FOOD BRIDGE AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          "Rescue Food. Reduce Waste. Feed Lives."
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Food Bridge AI is an intelligent humanitarian logistics platform built to eliminate urban food waste and connect commercial kitchens directly with grassroots NGOs and food banks.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5 text-forest-800" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Every day in major metropolitan centers, metric tons of safe, delicious, edible food are thrown away due to minor over-preparation, event cancellations, or inventory cycles. Concurrently, thousands of children and families struggle to access a single nutritious meal. Our mission is to bridge this disconnect with technology that is fast, safe, and transparent.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Why AI Makes The Difference</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Perishable food has an unforgiving shelf life. A batch of cooked biryani or vegetable curry must be collected and served within 2 to 4 hours. Human coordination over telephone trees and WhatsApp groups is too slow. Our AI Smart Matching Engine instantly calculates travel distance, urgency, and NGO receiver capacity, reducing dispatch delays by over 80%.
          </p>
        </div>
      </div>

      {/* UN Sustainable Development Goals */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Global Alignment</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Supporting United Nations Sustainable Development Goals
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-amber-400 block mb-2">SDG 2</span>
            <h4 className="font-bold text-base text-white">Zero Hunger</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Providing nutritious meals to shelters, orphanages, and community kitchens across Maharashtra.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-emerald-400 block mb-2">SDG 12</span>
            <h4 className="font-bold text-base text-white">Responsible Consumption</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Cutting commercial food waste in half through circular surplus redistribution and real-time alerts.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-blue-400 block mb-2">SDG 13</span>
            <h4 className="font-bold text-base text-white">Climate Action</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Preventing organic waste from generating potent methane emissions in Municipal solid waste landfills.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Protocol Charter */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-forest-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-forest-800" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Food Safety Charter & Disclaimer</h3>
            <p className="text-xs text-slate-500">Public health is our non-negotiable highest priority</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Food Bridge AI enforces strict food safety protocols. All participating donors must declare preparation time, storage temperature (refrigerated, warm, or room temperature), and allergen presence. Food nearing or past safe consumption limits is automatically locked and prevented from distribution.
        </p>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Important Food Safety Notice:</strong> Automated AI suggestions and verification checks do not substitute for on-site visual and temperature inspections. Receivers and volunteers are instructed to verify temperature and integrity upon arrival. Any food showing signs of spoilage or temperature abuse must be rejected and composted.
        </div>
      </div>
    </div>
  );
};
