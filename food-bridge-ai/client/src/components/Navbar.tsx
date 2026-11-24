import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { NotificationItem, UserRole } from '../types';
import {
  HeartHandshake,
  Bell,
  MapPin,
  BarChart3,
  PlusCircle,
  LogOut,
  User,
  Shield,
  Truck,
  Building2,
  UtensilsCrossed,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications.slice(0, 5));
      setUnreadCount(data.unreadCount);
    } catch (err) {
      // quiet fail on background notifications
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleSwitch = async (role: UserRole) => {
    setShowRoleMenu(false);
    await switchDemoRole(role);
    // Navigate to respective dashboard
    if (role === 'DONOR') navigate('/donor-dashboard');
    else if (role === 'NGO') navigate('/ngo-dashboard');
    else if (role === 'VOLUNTEER') navigate('/volunteer-dashboard');
    else if (role === 'ADMIN') navigate('/admin-dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white shadow-md shadow-forest-800/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-forest-900">FOOD BRIDGE</span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Rescue Food. Reduce Waste. Feed Lives.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/donations"
              className="text-sm font-medium text-slate-700 hover:text-forest-800 transition-colors flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
              Surplus Food
            </Link>
            <Link
              to="/map"
              className="text-sm font-medium text-slate-700 hover:text-forest-800 transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              Live Map
            </Link>
            <Link
              to="/analytics"
              className="text-sm font-medium text-slate-700 hover:text-forest-800 transition-colors flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Impact Analytics
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-slate-700 hover:text-forest-800 transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* Actions & User profile */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* 1-Click Demo Role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-forest-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    title="Switch Demo Role for testing"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Role: {user.role}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-1 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Quick Demo Role Switch
                      </div>
                      <button
                        onClick={() => handleRoleSwitch('DONOR')}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-emerald-50 ${
                          user.role === 'DONOR' ? 'bg-emerald-50 text-forest-800 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                        Food Donor (Restaurant)
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('NGO')}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-emerald-50 ${
                          user.role === 'NGO' ? 'bg-emerald-50 text-forest-800 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-blue-600" />
                        NGO / Food Bank
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('VOLUNTEER')}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-emerald-50 ${
                          user.role === 'VOLUNTEER' ? 'bg-emerald-50 text-forest-800 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-amber-600" />
                        Volunteer Partner
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('ADMIN')}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-emerald-50 ${
                          user.role === 'ADMIN' ? 'bg-emerald-50 text-forest-800 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        Admin Superuser
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-forest-800 hover:bg-slate-100 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <div className="font-semibold text-sm text-slate-900">Notifications</div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-forest-700 hover:underline flex items-center gap-1 font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              to={n.link || '/notifications'}
                              onClick={() => setShowNotifications(false)}
                              className={`block px-4 py-3 hover:bg-slate-50 transition-colors ${
                                !n.isRead ? 'bg-emerald-50/50' : ''
                              }`}
                            >
                              <div className="text-xs font-semibold text-slate-900">{n.title}</div>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                      <div className="border-t border-slate-100 px-4 py-1.5 text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs font-medium text-forest-700 hover:underline"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard / Donate CTA */}
                {user.role === 'DONOR' && (
                  <Link
                    to="/add-donation"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-forest-800 text-white hover:bg-forest-900 transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-300" />
                    <span className="hidden sm:inline">Donate Food</span>
                  </Link>
                )}

                {/* Profile link */}
                <Link
                  to={
                    user.role === 'DONOR'
                      ? '/donor-dashboard'
                      : user.role === 'NGO'
                      ? '/ngo-dashboard'
                      : user.role === 'VOLUNTEER'
                      ? '/volunteer-dashboard'
                      : '/admin-dashboard'
                  }
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity"
                  title="Go to Dashboard"
                >
                  <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-slate-900 leading-tight">{user.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 font-medium capitalize">{user.role.toLowerCase()}</div>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-forest-800 transition-colors px-3 py-1.5"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-forest-800 text-white hover:bg-forest-900 px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Join Food Bridge
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
