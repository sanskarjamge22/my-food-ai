import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatDateTime } from '../utils/helpers';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string>('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [usersData, logsData] = await Promise.all([
        api.getAdminUsers(roleFilter),
        api.getAuditLogs(),
      ]);
      setUsers(usersData);
      setAuditLogs(logsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [roleFilter]);

  const handleVerify = async (orgId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await api.verifyOrganization(orgId, status);
      setToastMsg(`Organization verification status updated to ${status}!`);
      setTimeout(() => setToastMsg(''), 4000);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating organization verification');
    }
  };

  const pendingOrganizations = users
    .filter((u) => u.organization && u.organization.verificationStatus === 'PENDING')
    .map((u) => u.organization);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 mb-1">
            <Shield className="w-4 h-4" />
            <span>Platform Governance & Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Superuser Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Verify charitable organizations, inspect real-time safety audit trails, and oversee system stakeholders across Maharashtra.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold">
          System Status: Operational
        </span>
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
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registered Users</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{users.length}</div>
          <span className="text-[10px] text-slate-400">Donors, NGOs, Couriers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verification Queue</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">{pendingOrganizations.length}</div>
          <span className="text-[10px] text-amber-700 font-medium">Organizations pending review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verified NGOs & Banks</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">
            {users.filter((u) => u.organization?.verificationStatus === 'VERIFIED').length}
          </div>
          <span className="text-[10px] text-slate-400">Authenticated partners</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Logged Audit Events</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-2">{auditLogs.length}</div>
          <span className="text-[10px] text-slate-400">Immutable operations</span>
        </div>
      </div>

      {/* 1. ORGANIZATION VERIFICATION QUEUE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Organization Verification Queue
              </h2>
              <p className="text-xs text-slate-500">
                Ensure only vetted charities and licensed food businesses receive surplus allocations
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            {pendingOrganizations.length} Pending
          </span>
        </div>

        {pendingOrganizations.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl text-xs text-slate-500 border border-dashed border-slate-200">
            All registered organizations have been reviewed. Queue is currently clear.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingOrganizations.map((org: any) => (
              <div key={org.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>{org.organizationName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {org.organizationType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    📍 {org.address} • Daily Capacity: ~{org.capacity} meals
                  </div>
                  <div className="text-[11px] text-slate-400">Contact: {org.contactPerson || 'Authorized rep'}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerify(org.id, 'VERIFIED')}
                    className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Approve & Verify</span>
                  </button>
                  <button
                    onClick={() => handleVerify(org.id, 'REJECTED')}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. ALL SYSTEM USERS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Platform Registered Users</h2>
            <p className="text-xs text-slate-500">Filter accounts by role and inspect profiles</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="ALL">All Roles</option>
              <option value="DONOR">Donors</option>
              <option value="NGO">NGOs</option>
              <option value="VOLUNTEER">Volunteers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Organization / Transport</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {u.organization?.organizationName ||
                      (u.volunteerProfile ? `Vehicle: ${u.volunteerProfile.transportType}` : 'Direct Citizen')}
                  </td>
                  <td className="py-3 px-4">
                    {u.organization ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          u.organization.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {u.organization.verificationStatus}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. AUDIT LOGS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-700" />
            <span>Real-Time Audit Trail & Integrity Log</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cryptographically timestamped transaction log for food safety compliance
          </p>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
          {auditLogs.map((log: any) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 mr-2">{log.action}</span>
                <span className="text-slate-600">{log.details}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex-shrink-0 ml-4">
                {formatDateTime(log.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
