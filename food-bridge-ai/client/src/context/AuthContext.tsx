import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('foodbridge_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (localStorage.getItem('foodbridge_token')) {
        const u = await api.getMe();
        setUser(u);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      localStorage.removeItem('foodbridge_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    localStorage.setItem('foodbridge_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData: any) => {
    const data = await api.register(formData);
    localStorage.setItem('foodbridge_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('foodbridge_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    const demoEmails: Record<UserRole, string> = {
      ADMIN: 'admin@foodbridge.demo',
      DONOR: 'donor@foodbridge.demo',
      NGO: 'ngo@foodbridge.demo',
      VOLUNTEER: 'volunteer@foodbridge.demo',
    };
    await login(demoEmails[role], 'Demo@1234');
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
