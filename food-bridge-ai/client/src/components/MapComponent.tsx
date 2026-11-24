import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FoodDonation, Organization } from '../types';

interface MapComponentProps {
  donations?: FoodDonation[];
  organizations?: Organization[];
  activeRoute?: {
    start: [number, number];
    end: [number, number];
    label?: string;
  } | null;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (item: any, type: 'donation' | 'organization') => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  donations = [],
  organizations = [],
  activeRoute = null,
  center = [19.0760, 72.8777], // Mumbai default center
  zoom = 12,
  height = '500px',
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and route when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    const bounds = L.latLngBounds([]);

    // 1. Add Donation Markers (Green/Orange/Red depending on urgency)
    donations.forEach((d) => {
      if (!d.latitude || !d.longitude) return;

      const urgencyColor =
        d.urgencyLevel === 'CRITICAL'
          ? '#EF4444'
          : d.urgencyLevel === 'HIGH'
          ? '#F97316'
          : d.urgencyLevel === 'MEDIUM'
          ? '#F59E0B'
          : '#10B981';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${urgencyColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;">
            <svg style="width: 18px; height: 18px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([d.latitude, d.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: Inter, sans-serif; min-width: 200px;">
          <div style="font-size: 11px; font-weight: 700; color: ${urgencyColor}; text-transform: uppercase;">
            ${d.urgencyLevel} Urgency • ${d.category}
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #0F172A; margin: 4px 0;">
            ${d.foodName}
          </h4>
          <p style="font-size: 12px; color: #475569; margin: 2px 0;">
            <b>Quantity:</b> ${d.quantity} ${d.unit}
          </p>
          <p style="font-size: 11px; color: #64748B; margin: 2px 0;">
            📍 ${d.pickupAddress}
          </p>
          <div style="margin-top: 8px;">
            <a href="/donations/${d.id}" style="display: inline-block; background: #166534; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
              View & Match
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => onMarkerClick?.(d, 'donation'));
      markersLayer.addLayer(marker);
      bounds.extend([d.latitude, d.longitude]);
    });

    // 2. Add Organization Markers (Blue building for NGOs, Indigo for Food Banks)
    organizations.forEach((org) => {
      if (!org.latitude || !org.longitude) return;

      const orgColor = org.organizationType === 'FOOD_BANK' ? '#4F46E5' : '#0284C7';

      const orgIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${orgColor}; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;">
            <svg style="width: 17px; height: 17px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([org.latitude, org.longitude], { icon: orgIcon });

      const popupContent = `
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <span style="font-size: 10px; font-weight: 700; color: ${orgColor}; text-transform: uppercase;">
            ${org.organizationType}
          </span>
          <h4 style="font-size: 13px; font-weight: 700; color: #0F172A; margin: 3px 0;">
            ${org.organizationName}
          </h4>
          <p style="font-size: 11px; color: #475569; margin: 2px 0;">
            📍 ${org.address}
          </p>
          <p style="font-size: 11px; color: #166534; font-weight: 600; margin: 2px 0;">
            Daily Capacity: ~${org.capacity} meals
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => onMarkerClick?.(org, 'organization'));
      markersLayer.addLayer(marker);
      bounds.extend([org.latitude, org.longitude]);
    });

    // 3. Draw active route polyline if specified
    if (activeRoute) {
      const line = L.polyline([activeRoute.start, activeRoute.end], {
        color: '#166534',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(map);

      routeLayerRef.current = line;
      bounds.extend(activeRoute.start);
      bounds.extend(activeRoute.end);
    }

    // Auto fit bounds if we have points
    if (bounds.isValid() && (donations.length > 0 || organizations.length > 0 || activeRoute)) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [donations, organizations, activeRoute]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%', borderRadius: '16px' }}
      className="shadow-sm border border-slate-200 z-10 overflow-hidden"
    />
  );
};
