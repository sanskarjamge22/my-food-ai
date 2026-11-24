import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FoodDonation, Organization } from '../types';
import { MapComponent } from '../components/MapComponent';
import {
  MapPin,
  UtensilsCrossed,
  Building2,
  Filter,
  Navigation,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const MapViewPage: React.FC = () => {
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDonations, setShowDonations] = useState<boolean>(true);
  const [showOrgs, setShowOrgs] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeRoute, setActiveRoute] = useState<{
    start: [number, number];
    end: [number, number];
    label?: string;
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true);
        const [donationsData, orgsData] = await Promise.all([
          api.getDonations({
            category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
            status: 'AVAILABLE',
          }),
          api.getOrganizations(),
        ]);

        setDonations(donationsData);
        setOrganizations(orgsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMapData();
  }, [selectedCategory]);

  const handleMarkerClick = (item: any, type: 'donation' | 'organization') => {
    setSelectedItem({ ...item, type });

    if (type === 'donation') {
      // Find nearest NGO to draw demo route
      if (organizations.length > 0) {
        const firstOrg = organizations[0];
        setActiveRoute({
          start: [item.latitude, item.longitude],
          end: [firstOrg.latitude, firstOrg.longitude],
          label: `Route to ${firstOrg.organizationName}`,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Geographic Rescue Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Live OpenStreetMap Rescue View
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Interactive map displaying real surplus food listings and verified charity hubs across Maharashtra
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Critical (&lt;2h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Urgent (2-6h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600"></span>
            <span>NGOs & Banks</span>
          </div>
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter & Selection Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-forest-700" />
              <span>Map Layer Controls</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                <span className="font-medium text-slate-700">Surplus Food Listings</span>
                <input
                  type="checkbox"
                  checked={showDonations}
                  onChange={(e) => setShowDonations(e.target.checked)}
                  className="rounded text-forest-800"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                <span className="font-medium text-slate-700">NGOs & Food Banks</span>
                <input
                  type="checkbox"
                  checked={showOrgs}
                  onChange={(e) => setShowOrgs(e.target.checked)}
                  className="rounded text-forest-800"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Filter Food Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              >
                <option value="ALL">All Categories</option>
                <option value="COOKED_MEALS">Cooked Meals</option>
                <option value="FRUITS">Fruits</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="BAKERY">Bakery</option>
                <option value="DAIRY">Dairy</option>
              </select>
            </div>
          </div>

          {/* Active selection preview */}
          {selectedItem && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-forest-800">
                Selected {selectedItem.type === 'donation' ? 'Surplus Food' : 'NGO Hub'}
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                {selectedItem.foodName || selectedItem.organizationName}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                {selectedItem.description || selectedItem.address}
              </p>
              {selectedItem.type === 'donation' && (
                <a
                  href={`/donations/${selectedItem.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-forest-800 hover:underline pt-1"
                >
                  <span>View Details & Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {activeRoute && (
            <div className="p-4 rounded-2xl bg-forest-900 text-white text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                <Navigation className="w-4 h-4" />
                <span>Simulated Transit Route</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Direct route visualized between donor kitchen and closest certified distribution point.
              </p>
              <button
                onClick={() => setActiveRoute(null)}
                className="text-[11px] text-emerald-300 underline font-bold"
              >
                Clear Route Line
              </button>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3">
          <MapComponent
            donations={showDonations ? donations : []}
            organizations={showOrgs ? organizations : []}
            activeRoute={activeRoute}
            height="620px"
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>
    </div>
  );
};
