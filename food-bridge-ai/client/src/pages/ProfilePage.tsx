import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Building2,
  Truck,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Database,
  Sparkles,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
          <User className="w-4 h-4 text-emerald-600" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Profile & Organization Credentials
        </h1>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-forest-800/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-forest-800">
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold transition-colors flex items-center gap-2 border border-slate-200 w-fit"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Organization Information if Donor or NGO */}
        {user.organization && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-forest-700" />
                <span>Organization Details</span>
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  user.organization.verificationStatus === 'VERIFIED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                Verification: {user.organization.verificationStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Name</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {user.organization.organizationName}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Operating Type</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {user.organization.organizationType}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Primary Hub Address</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {user.organization.address}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Daily Meal Capacity</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  ~{user.organization.capacity} meals / day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Volunteer Profile if Courier */}
        {user.volunteerProfile && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <span>Courier Delivery Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Transport Vehicle</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {user.volunteerProfile.transportType}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">License Plate</span>
                <span className="font-bold text-slate-900 mt-0.5 block font-mono">
                  {user.volunteerProfile.vehicleNumber || 'MH-02-CD-5432'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Missions Completed</span>
                <span className="font-bold text-forest-800 text-sm mt-0.5 block">
                  {user.volunteerProfile.totalDeliveries} rescue runs
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Production Migration Readiness Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Database Architecture & Production Readiness</span>
        </div>
        <h3 className="text-xl font-bold text-white">
          Isolated Repository Layer & Future Migrations
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The current local demo executes against high-speed <strong>SQLite with Prisma ORM</strong>. The data access layer is cleanly decoupled:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="font-bold text-emerald-300 block mb-1">Current Active DB</span>
            <span className="text-slate-300">SQLite (<code className="font-mono text-emerald-200">dev.db</code>) with Prisma ORM migrations</span>
          </div>

          <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="font-bold text-blue-300 block mb-1">PostgreSQL / Supabase</span>
            <span className="text-slate-300">Switch `provider = "postgresql"` in schema.prisma without rewriting services</span>
          </div>

          <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="font-bold text-amber-300 block mb-1">Firebase Ready</span>
            <span className="text-slate-300">Prepared for Firebase Auth, Cloud Firestore, and FCM push notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
};
