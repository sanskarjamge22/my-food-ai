import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  Inbox,
  Truck,
  MapPin,
  BarChart3,
  Bell,
  Settings,
  Users,
  ShieldCheck,
  FileText,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const getLinks = () => {
    switch (role) {
      case 'DONOR':
        return [
          { to: '/donor-dashboard', label: 'Donor Overview', icon: LayoutDashboard },
          { to: '/add-donation', label: 'Create Donation', icon: PlusCircle, highlight: true },
          { to: '/donations', label: 'Browse Food Feed', icon: UtensilsCrossed },
          { to: '/map', label: 'Live Rescue Map', icon: MapPin },
          { to: '/analytics', label: 'Impact Analytics', icon: BarChart3 },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/profile', label: 'Organization Profile', icon: Settings },
        ];
      case 'NGO':
        return [
          { to: '/ngo-dashboard', label: 'NGO Overview', icon: LayoutDashboard },
          { to: '/donations', label: 'Discover Surplus Food', icon: UtensilsCrossed, highlight: true },
          { to: '/deliveries', label: 'Track Deliveries', icon: Truck },
          { to: '/map', label: 'Nearby Donors Map', icon: MapPin },
          { to: '/analytics', label: 'Impact Analytics', icon: BarChart3 },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/profile', label: 'Organization Profile', icon: Building2 },
        ];
      case 'VOLUNTEER':
        return [
          { to: '/volunteer-dashboard', label: 'Volunteer Hub', icon: LayoutDashboard },
          { to: '/deliveries', label: 'Available Deliveries', icon: Truck, highlight: true },
          { to: '/map', label: 'Live Routes Map', icon: MapPin },
          { to: '/analytics', label: 'My Impact Score', icon: BarChart3 },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/profile', label: 'Volunteer Profile', icon: Settings },
        ];
      case 'ADMIN':
        return [
          { to: '/admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { to: '/donations', label: 'Monitor All Listings', icon: UtensilsCrossed },
          { to: '/deliveries', label: 'Delivery Logistics', icon: Truck },
          { to: '/map', label: 'Regional Map', icon: MapPin },
          { to: '/analytics', label: 'System Analytics', icon: BarChart3 },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/profile', label: 'System Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0">
      {/* Role badge card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center font-bold text-base shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </div>
        {user.organization && (
          <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 truncate flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{user.organization.organizationName}</span>
          </div>
        )}
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/donor-dashboard' || link.to === '/ngo-dashboard' || link.to === '/volunteer-dashboard' || link.to === '/admin-dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-sm shadow-forest-800/20'
                    : link.highlight
                    ? 'bg-emerald-50 text-forest-800 hover:bg-emerald-100 border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom food safety tip */}
      <div className="p-4 m-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900">
        <div className="font-bold flex items-center gap-1 text-amber-950 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          Safety First
        </div>
        <p className="text-[10px] text-amber-800 leading-relaxed">
          Surplus cooked food must remain hot (&gt;60°C) or refrigerated (&lt;4°C) prior to pickup.
        </p>
      </div>
    </aside>
  );
};
