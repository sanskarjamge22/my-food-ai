import { FoodDonation, DonationRequest, Delivery, NotificationItem, DashboardStats, FoodMatch, User } from '../types';

const API_BASE = '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('foodbridge_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(formData: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.user as User;
  },

  // Donations
  async getDonations(params?: {
    category?: string;
    status?: string;
    urgency?: string;
    search?: string;
    donorId?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/donations?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch donations');
    return data.donations as FoodDonation[];
  },

  async getOrganizations(type?: string) {
    const query = type && type !== 'ALL' ? `?type=${type}` : '';
    const res = await fetch(`${API_BASE}/organizations${query}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch organizations');
    return data.organizations;
  },

  async getDonationById(id: string) {
    const res = await fetch(`${API_BASE}/donations/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch donation');
    return data.donation as FoodDonation;
  },

  async createDonation(donationData: any) {
    const res = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(donationData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create donation');
    return data.donation as FoodDonation;
  },

  async updateDonation(id: string, donationData: any) {
    const res = await fetch(`${API_BASE}/donations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(donationData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update donation');
    return data.donation as FoodDonation;
  },

  async deleteDonation(id: string) {
    const res = await fetch(`${API_BASE}/donations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete donation');
    return data;
  },

  // Requests
  async getRequests(params?: { status?: string; donationId?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.donationId) query.append('donationId', params.donationId);

    const res = await fetch(`${API_BASE}/requests?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch requests');
    return data.requests as DonationRequest[];
  },

  async createRequest(payload: { donationId: string; requestedQuantity: number; notes?: string }) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to request food');
    return data;
  },

  async approveRequest(requestId: string) {
    const res = await fetch(`${API_BASE}/requests/${requestId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to approve request');
    return data;
  },

  async rejectRequest(requestId: string) {
    const res = await fetch(`${API_BASE}/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reject request');
    return data;
  },

  // Deliveries / Volunteers
  async getDeliveries(params?: { status?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${API_BASE}/deliveries/deliveries?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch deliveries');
    return data.deliveries as Delivery[];
  },

  async assignDelivery(payload: { deliveryId: string; volunteerId?: string }) {
    const res = await fetch(`${API_BASE}/deliveries/deliveries/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to accept delivery');
    return data;
  },

  async updateDeliveryStatus(deliveryId: string, payload: { deliveryStatus: string; proofImage?: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/deliveries/deliveries/${deliveryId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update delivery');
    return data;
  },

  // AI Matching
  async getAiMatches(donationId: string) {
    const res = await fetch(`${API_BASE}/ai/matches/${donationId}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get AI matches');
    return data.matches as FoodMatch[];
  },

  // AI Assistant
  async sendAiAssistantMessage(messages: { role: string; content: string }[], userContext?: any) {
    const res = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ messages, userContext }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Assistant request failed');
    return data as { reply: string; suggestions?: string[]; safetyNotice?: string };
  },

  // Analytics
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get dashboard stats');
    return data.stats as DashboardStats;
  },

  async getMonthlyTrends() {
    const res = await fetch(`${API_BASE}/analytics/monthly`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get monthly trends');
    return data.trends as { month: string; rescuedKg: number; meals: number; deliveries: number }[];
  },

  async getCategoryBreakdown() {
    const res = await fetch(`${API_BASE}/analytics/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get category data');
    return data.categories as { name: string; count: number; totalQuantity: number; code: string }[];
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get notifications');
    return {
      notifications: data.notifications as NotificationItem[],
      unreadCount: data.unreadCount as number,
    };
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all/all`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Admin
  async getAdminUsers(role?: string) {
    const query = role && role !== 'ALL' ? `?role=${role}` : '';
    const res = await fetch(`${API_BASE}/admin/users${query}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get users');
    return data.users;
  },

  async verifyOrganization(orgId: string, status: 'VERIFIED' | 'REJECTED' | 'PENDING') {
    const res = await fetch(`${API_BASE}/admin/organizations/${orgId}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to verify organization');
    return data;
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get audit logs');
    return data.logs;
  },
};
