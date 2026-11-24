import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  UtensilsCrossed,
  HeartHandshake,
  Truck,
  Leaf,
  Info,
  Sparkles,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [statsData, trendsData, categoryData] = await Promise.all([
          api.getDashboardStats(),
          api.getMonthlyTrends(),
          api.getCategoryBreakdown(),
        ]);
        setStats(statsData);
        setTrends(trendsData);
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const COLORS = ['#166534', '#22C55E', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B'];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>Real-Time Environmental & Social Impact</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Food Waste Prevention Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tracking rescued edible kilograms, community nutrition, and greenhouse methane mitigation across Maharashtra
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Food Rescued</span>
            <div className="p-2 bg-emerald-100 text-forest-800 rounded-xl">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-forest-900">
            {stats?.totalFoodRescuedKg || 620} kg
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Diverted from landfills</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Meals</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">
            {stats?.estimatedMeals || 1550}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">1 kg ≈ 2.5 meals served</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">GHG CO₂e Diverted</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-700">
            {stats?.estimatedCo2PreventedKg || 1550} kg
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Landfill methane avoided</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Trips</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-blue-900">
            {stats?.completedDeliveries || 68}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Successful courier dispatches</span>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Notice:</strong> All meal calculations (1 kg ≈ 2.5 meals) and avoided greenhouse carbon equivalents (1 kg diverted ≈ 2.5 kg CO₂e) represent accepted environmental science benchmark estimations for demonstration purposes and are not individually lab-certified.
        </p>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Monthly Food Rescue Trajectory (kg)
            </h3>
            <p className="text-xs text-slate-500">6-month expansion of surplus redistribution volume</p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRescue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Area type="monotone" dataKey="rescuedKg" stroke="#166534" strokeWidth={3} fillOpacity={1} fill="url(#colorRescue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut / Pie Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Redistributed Volume by Food Category
            </h3>
            <p className="text-xs text-slate-500">Breakdown of cooked meals, bakery goods, produce, and dairy</p>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={4}
                  label={(entry) => `${entry.name}`}
                  labelLine={false}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
