import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UtensilsCrossed,
  Building2,
  Truck,
  Shield,
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError('');
    setIsLoading(true);
    try {
      await switchDemoRole(role);
      if (role === 'DONOR') navigate('/donor-dashboard');
      else if (role === 'NGO') navigate('/ngo-dashboard');
      else if (role === 'VOLUNTEER') navigate('/volunteer-dashboard');
      else if (role === 'ADMIN') navigate('/admin-dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-emerald-300 flex items-center justify-center mx-auto shadow-md shadow-forest-800/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Food Bridge AI
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your role-based rescue dashboard
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>One-Click Hackathon Demo Logins:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('DONOR')}
              className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-forest-800 border border-slate-200 hover:border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-forest-700" />
              <span>Food Donor</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('NGO')}
              className="p-2 rounded-xl bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>NGO / Bank</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('VOLUNTEER')}
              className="p-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-slate-200 hover:border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>Volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2 rounded-xl bg-white hover:bg-purple-50 text-purple-800 border border-slate-200 hover:border-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Password: <code className="bg-slate-200 px-1 rounded">Demo@1234</code>
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-forest-800/20 disabled:opacity-50"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-forest-800 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
