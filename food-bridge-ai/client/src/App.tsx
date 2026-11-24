import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { DonorDashboard } from './pages/DonorDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

import { AddDonationPage } from './pages/AddDonationPage';
import { DonationsListPage } from './pages/DonationsListPage';
import { DonationDetailsPage } from './pages/DonationDetailsPage';
import { MapViewPage } from './pages/MapViewPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
  },
});

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing & Educational Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Dashboard & App Views */}
            <Route element={<DashboardLayout />}>
              {/* Role Dashboards */}
              <Route
                path="/donor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['NGO']}>
                    <NgoDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['VOLUNTEER']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Functional Feature Pages */}
              <Route
                path="/add-donation"
                element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <AddDonationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/donations" element={<DonationsListPage />} />
              <Route path="/donations/:id" element={<DonationDetailsPage />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/deliveries" element={<DeliveriesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
