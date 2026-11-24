import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  HeartHandshake,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  MapPin,
  ArrowRight,
  AlertCircle,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('DONOR');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [organizationType, setOrganizationType] = useState<string>('RESTAURANT');
  const [address, setAddress] = useState<string>('Bandra West, Mumbai');
  const [capacity, setCapacity] = useState<number>(100);
  const [transportType, setTransportType] = useState<string>('MOTORCYCLE');
  const [vehicleNumber, setVehicleNumber] = useState<string>('MH-02-AB-1234');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        role,
        phone,
        organizationName: role !== 'VOLUNTEER' ? organizationName || `${name}'s Organization` : undefined,
        organizationType: role === 'DONOR' ? organizationType : role === 'NGO' ? 'NGO' : undefined,
        address: role !== 'VOLUNTEER' ? address : undefined,
        city: 'Mumbai',
        latitude: 19.0760,
        longitude: 72.8777,
        capacity: Number(capacity),
        transportType: role === 'VOLUNTEER' ? transportType : undefined,
        vehicleNumber: role === 'VOLUNTEER' ? vehicleNumber : undefined,
      });

      if (role === 'DONOR') navigate('/donor-dashboard');
      else if (role === 'NGO') navigate('/ngo-dashboard');
      else if (role === 'VOLUNTEER') navigate('/volunteer-dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-emerald-300 flex items-center justify-center mx-auto shadow-md shadow-forest-800/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Join the Food Bridge Network
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Choose your role to start rescuing or receiving food
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Select Your Platform Role</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setRole('DONOR');
                setOrganizationType('RESTAURANT');
              }}
              className={`p-3 rounded-2xl border text-center transition-all ${
                role === 'DONOR'
                  ? 'bg-emerald-50 border-forest-800 text-forest-800 font-bold ring-2 ring-forest-800/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 mx-auto mb-1 text-forest-700" />
              <div className="text-xs">Food Donor</div>
              <div className="text-[10px] text-slate-400">Restaurant/Hotel</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('NGO');
                setOrganizationType('NGO');
              }}
              className={`p-3 rounded-2xl border text-center transition-all ${
                role === 'NGO'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div className="text-xs">NGO / Bank</div>
              <div className="text-[10px] text-slate-400">Charity Receiver</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('VOLUNTEER')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                role === 'VOLUNTEER'
                  ? 'bg-amber-50 border-amber-600 text-amber-900 font-bold ring-2 ring-amber-600/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-5 h-5 mx-auto mb-1 text-amber-600" />
              <div className="text-xs">Volunteer</div>
              <div className="text-[10px] text-slate-400">Courier Partner</div>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Contact Person</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajesh Kumar"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@kitchen.org"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
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
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          {/* Conditional Role Fields */}
          {role !== 'VOLUNTEER' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'DONOR' ? 'Restaurant / Business Name' : 'NGO / Shelter Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder={role === 'DONOR' ? 'Mumbai Delights Bistro' : 'Annapurna Relief Fund'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'DONOR' ? 'Daily Surplus Capacity (kg/meals)' : 'Daily Meal Distribution Capacity'}
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address (Maharashtra)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Linking Road, Bandra West, Mumbai"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'VOLUNTEER' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  >
                    <option value="MOTORCYCLE">Motorcycle / Scooter</option>
                    <option value="CAR">Car / Hatchback</option>
                    <option value="VAN">Van / Commercial Utility</option>
                    <option value="BICYCLE">Bicycle</option>
                    <option value="ON_FOOT">On Foot / Public Transit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Number Plate</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="MH-02-AB-1234"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-forest-800/20 disabled:opacity-50"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-forest-800 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
