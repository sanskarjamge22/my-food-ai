import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Globe, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-white shadow-md shadow-forest-900/40">
                <HeartHandshake className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">FOOD BRIDGE AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Rescue Food. Reduce Waste. Feed Lives."
              <br />
              An intelligent redistribution platform connecting commercial food surplus with verified community food banks and NGOs.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Maharashtra Regional Pilot
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/donations" className="hover:text-emerald-400 transition-colors">
                  Surplus Food Listings
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-emerald-400 transition-colors">
                  Interactive Rescue Map
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-emerald-400 transition-colors">
                  Impact & Carbon Metrics
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  How AI Matching Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Safety & Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Safety & Compliance</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Standard Safe Holding Protocols</span>
              </li>
              <li>Temperature Danger Zone: 5°C to 60°C</li>
              <li>Mandatory Allergen Labeling</li>
              <li>Verified Organization Delivery Protocol</li>
              <li>Automated Expiry Safeguards</li>
            </ul>
          </div>

          {/* SDG Alignment & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">UN SDG Goals</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                SDG 2: Zero Hunger
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                SDG 12: Responsible Consumption
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                SDG 13: Climate Action
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Notice: All estimates of rescued meals and CO2e greenhouse reduction are calculated for demo purposes using accepted standard benchmarks (1 kg ≈ 2.5 meals; 1 kg ≈ 2.5 kg CO2e).
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Food Bridge AI. All rights reserved.</div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Built with care for a hunger-free, waste-free planet</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
