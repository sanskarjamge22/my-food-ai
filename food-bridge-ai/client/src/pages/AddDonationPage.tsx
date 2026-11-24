import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FoodCategory } from '../types';
import confetti from 'canvas-confetti';
import {
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Upload,
  Info,
} from 'lucide-react';

export const AddDonationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const defaultPrep = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultExpiry = new Date(now.getTime() + 3.5 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [foodName, setFoodName] = useState<string>('');
  const [category, setCategory] = useState<FoodCategory>('COOKED_MEALS');
  const [description, setDescription] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(25);
  const [unit, setUnit] = useState<string>('meals');
  const [preparationTime, setPreparationTime] = useState<string>(defaultPrep);
  const [expiryTime, setExpiryTime] = useState<string>(defaultExpiry);
  const [pickupAddress, setPickupAddress] = useState<string>(
    user?.organization?.address || 'Linking Road, Bandra West, Mumbai, MH'
  );
  const [latitude, setLatitude] = useState<number>(user?.organization?.latitude || 19.0558);
  const [longitude, setLongitude] = useState<number>(user?.organization?.longitude || 72.8315);
  const [storageConditions, setStorageConditions] = useState<string>('WARM_HOT');
  const [allergenInformation, setAllergenInformation] = useState<string>('None declared');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60'
  );
  const [donorContact, setDonorContact] = useState<string>(user?.phone || '+91 98201 22334');

  // Mandatory Safety Checkboxes
  const [hygieneConfirmed, setHygieneConfirmed] = useState<boolean>(false);
  const [tempConfirmed, setTempConfirmed] = useState<boolean>(false);
  const [freshConfirmed, setFreshConfirmed] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const sampleImages = [
    { label: 'Biryani / Cooked Meals', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60' },
    { label: 'Artisan Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60' },
    { label: 'Fresh Fruits', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=60' },
    { label: 'Paneer / Dairy', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=60' },
    { label: 'Packaged Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60' },
  ];

  const handleAiDraft = () => {
    if (!foodName) {
      setFoodName('Surplus Veg Dum Biryani & Mirchi Salan');
    }
    setDescription(
      'Freshly prepared catering surplus from dinner service. Untouched, handled with gloves, and sealed in sanitized aluminum catering trays. Ideal for immediate community shelter dinner distribution.'
    );
    setAllergenInformation('Contains Ghee (Dairy). Nut-free.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hygieneConfirmed || !tempConfirmed || !freshConfirmed) {
      setError('Please verify all three food safety standards before publishing.');
      return;
    }

    setIsLoading(true);

    try {
      const donation = await api.createDonation({
        foodName,
        category,
        description,
        quantity: Number(quantity),
        unit,
        preparationTime: new Date(preparationTime).toISOString(),
        expiryTime: new Date(expiryTime).toISOString(),
        pickupAddress,
        latitude: Number(latitude),
        longitude: Number(longitude),
        storageConditions,
        allergenInformation,
        imageUrl,
        donorContact,
      });

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      navigate(`/donations/${donation.id}`);
    } catch (err: any) {
      setError(err.message || 'Error creating donation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider">
          <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
          <span>Surplus Food Rescue Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Publish Surplus Food Donation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Fill in food specifications. Our AI matching engine will immediately locate and notify verified nearby NGOs.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Food Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">Food Item Name</label>
            <button
              type="button"
              onClick={handleAiDraft}
              className="text-xs font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Auto-Draft</span>
            </button>
          </div>
          <input
            type="text"
            required
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g. 35 Meals Fresh Veg Biryani & Dal Makhani"
            className="sm:col-span-2 w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Food Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FoodCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
            >
              <option value="COOKED_MEALS">Cooked Meals</option>
              <option value="FRUITS">Fresh Fruits</option>
              <option value="VEGETABLES">Fresh Vegetables</option>
              <option value="BAKERY">Bakery & Bread</option>
              <option value="PACKAGED_FOOD">Packaged Edibles</option>
              <option value="DAIRY">Dairy Products</option>
              <option value="OTHER">Other Edibles</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Storage Condition</label>
            <select
              value={storageConditions}
              onChange={(e) => setStorageConditions(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
            >
              <option value="WARM_HOT">Keep Warm (&gt;60°C)</option>
              <option value="REFRIGERATED">Chilled / Refrigerated (&lt;4°C)</option>
              <option value="ROOM_TEMP">Room Temperature (Dry)</option>
              <option value="FROZEN">Deep Freeze</option>
            </select>
          </div>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Surplus Quantity</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
            >
              <option value="meals">meals / portions</option>
              <option value="kg">kg (kilograms)</option>
              <option value="packets">packets / boxes</option>
              <option value="portions">portions</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description & Preparation Notes</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about packaging, freshness, ingredients, and pickup instructions..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
          />
        </div>

        {/* Timestamps (Prep & Safe Expiry) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Prepared Timestamp</span>
            </label>
            <input
              type="datetime-local"
              required
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 text-red-600">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>Safe Collection Deadline (Expiry)</span>
            </label>
            <input
              type="datetime-local"
              required
              value={expiryTime}
              onChange={(e) => setExpiryTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Automated expiry will lock this listing when deadline arrives.
            </span>
          </div>
        </div>

        {/* Allergen Information */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Allergen Notice</label>
          <input
            type="text"
            value={allergenInformation}
            onChange={(e) => setAllergenInformation(e.target.value)}
            placeholder="e.g. Contains Dairy (Ghee). Nut-free."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-800"
          />
        </div>

        {/* Pickup Location & Coordinates */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Kitchen / Banquet Address, Mumbai"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-500">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500">Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Image Selection Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Food Image</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {sampleImages.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(s.url)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                  imageUrl === s.url
                    ? 'bg-emerald-100 text-forest-800 border-forest-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
          />
        </div>

        {/* Food Safety Declaration Checklist (Module 10) */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-forest-900 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-forest-800" />
            <span>Mandatory Food Safety Self-Audit Checklist</span>
          </div>

          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={hygieneConfirmed}
              onChange={(e) => setHygieneConfirmed(e.target.checked)}
              className="rounded text-forest-800 focus:ring-forest-800 mt-0.5"
            />
            <span>This food was prepared under licensed hygienic standards and packed in clean, food-grade containers.</span>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={tempConfirmed}
              onChange={(e) => setTempConfirmed(e.target.checked)}
              className="rounded text-forest-800 focus:ring-forest-800 mt-0.5"
            />
            <span>Food was maintained outside the temperature danger zone (&gt;60°C hot or &lt;4°C chilled) without prolonged room exposure.</span>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={freshConfirmed}
              onChange={(e) => setFreshConfirmed(e.target.checked)}
              className="rounded text-forest-800 focus:ring-forest-800 mt-0.5"
            />
            <span>I confirm this food is wholesome, unadulterated, and safe for human consumption within the declared deadline.</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-forest-800/20 transition-all disabled:opacity-50"
        >
          <span>{isLoading ? 'Publishing & Running AI Match...' : 'Publish Surplus Food & Notify NGOs'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
