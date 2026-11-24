import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { NotificationItem } from '../types';
import { formatDateTime } from '../utils/helpers';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Communications Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Notifications & Dispatch Alerts
          </h1>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Your notification inbox is clear!</h3>
          <p className="text-xs text-slate-500 mt-1">Status changes and requests will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    n.type === 'ALERT' || n.type === 'URGENT'
                      ? 'bg-rose-100 text-rose-700'
                      : n.type === 'STATUS'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-forest-800'
                  }`}
                >
                  {n.type === 'ALERT' || n.type === 'URGENT' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.type === 'STATUS' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    className="p-2 rounded-xl text-xs font-bold text-forest-800 hover:bg-emerald-50 transition-colors"
                    title="View related item"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkOne(n.id)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
