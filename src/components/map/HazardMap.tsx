import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { Coordinates, Hazard } from '../../types/routeshield';
import { LiveLocationData } from '../../types/navigation';
import { PUNE_CENTER, PUNE_ZOOM } from '../../data/puneData';
import { Locate, Navigation, Crosshair } from 'lucide-react';

interface HazardMapProps {
  hazards?: Hazard[];
  onSelectHazard?: (hazard: Hazard) => void;
  showRouteComparison?: boolean;
  defaultRouteCoordinates?: Coordinates[];
  safeRouteCoordinates?: Coordinates[];
  originCoordinates?: Coordinates;
  destCoordinates?: Coordinates;
  originName?: string;
  destName?: string;
  center?: Coordinates;
  zoom?: number;
  draggablePin?: boolean;
  onPinDrag?: (coords: Coordinates) => void;
  onMapClickSelect?: (coords: Coordinates, role: 'origin' | 'destination') => void;
  userLocation?: Coordinates | null;
  liveLocation?: LiveLocationData | null;
  followUser?: boolean;
  onToggleFollow?: (follow: boolean) => void;
  onRecenter?: () => void;
  navigationActive?: boolean;
  className?: string;
}

// Custom DivIcon creator for Pune hazards
function createHazardIcon(type: string, severity: string) {
  let color = '#EF4444';
  let svgIcon = '';

  switch (type) {
    case 'waterlogging':
      color = '#24D6E8';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`;
      break;
    case 'accident':
      color = '#EF4444';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      break;
    case 'construction':
      color = '#F97316';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 10-18 10 18"/><path d="m5 16 14 0"/><path d="m7.5 11 9 0"/></svg>`;
      break;
    case 'manhole':
      color = '#FACC15';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;
      break;
    case 'electrical':
      color = '#EAB308';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      break;
    case 'tree_fall':
      color = '#22C55E';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/></svg>`;
      break;
    default:
      color = '#DC2626';
      svgIcon = `<circle cx="12" cy="12" r="8"/>`;
  }

  const isCritical = severity === 'Critical' || severity === 'High';

  return L.divIcon({
    className: 'custom-pune-hazard',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        ${isCritical ? `<div class="absolute w-9 h-9 rounded-full animate-ping opacity-45" style="background-color: ${color}"></div>` : ''}
        <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xl transition-transform transform group-hover:scale-115"
             style="background-color: ${color}; border: 2px solid #071A2B; box-shadow: 0 0 12px ${color}88;">
          ${svgIcon}
        </div>
        <div class="absolute -bottom-1 w-2 h-2 rotate-45" style="background-color: ${color}"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
}

// Custom Blue Navigation GPS Marker with heading orientation
function createNavigationGpsIcon(heading: number | null) {
  const hasHeading = typeof heading === 'number' && !isNaN(heading);
  const rotationStyle = hasHeading ? `transform: rotate(${heading}deg); transition: transform 0.3s ease;` : '';

  return L.divIcon({
    className: 'live-gps-marker',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        <!-- Outer pulsing aura ring -->
        <div class="absolute w-9 h-9 rounded-full bg-[#0091FF]/35 animate-ping"></div>
        <div class="absolute w-11 h-11 rounded-full bg-[#0091FF]/15"></div>
        
        <!-- Center navigation indicator -->
        ${
          hasHeading
            ? `
            <div class="relative z-10 w-7 h-7 flex items-center justify-center" style="${rotationStyle}">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#0091FF" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 6px rgba(0,145,255,0.7));">
                <polygon points="12 2 19 21 12 17 5 21 12 2" />
              </svg>
            </div>
            `
            : `
            <div class="relative z-10 w-5 h-5 rounded-full bg-[#0091FF] border-2 border-white shadow-[0_0_12px_#0091FF] flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
            `
        }
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
}

export function HazardMap({
  hazards = [],
  onSelectHazard,
  showRouteComparison = false,
  defaultRouteCoordinates = [],
  safeRouteCoordinates = [],
  originCoordinates,
  destCoordinates,
  originName = 'Origin',
  destName = 'Destination',
  center = PUNE_CENTER,
  zoom = PUNE_ZOOM,
  draggablePin = false,
  onPinDrag,
  onMapClickSelect,
  userLocation = null,
  liveLocation = null,
  followUser = true,
  onToggleFollow,
  onRecenter,
  navigationActive = false,
  className = 'w-full h-full min-h-[420px]'
}: HazardMapProps) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const clickPopupRef = useRef<L.Popup | null>(null);

  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Leaflet Map with OpenStreetMap tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: true
      });

      // Compliant OpenStreetMap tile layer (attribution must NOT be translated)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        // @ts-ignore leaflet types
        referrerPolicy: 'strict-origin-when-cross-origin'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routesLayerRef.current = L.layerGroup().addTo(map);
      userLocationLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // When the user drags the map, automatically pause follow mode
      map.on('dragstart', () => {
        if (onToggleFollow) {
          onToggleFollow(false);
        }
      });

      // Map Click Handler to set Start or End location
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const coords: Coordinates = [Number(lat.toFixed(5)), Number(lng.toFixed(5))];

        if (clickPopupRef.current) {
          map.closePopup(clickPopupRef.current);
        }

        const popup = L.popup()
          .setLatLng(e.latlng)
          .setContent(`
            <div style="font-family: 'Inter', sans-serif; min-width: 170px; padding: 4px;">
              <div style="font-size: 11px; font-weight: bold; color: #24D6E8; margin-bottom: 4px;">
                📍 Pune Coordinates
              </div>
              <div style="font-size: 10px; color: #94A3B8; margin-bottom: 8px;">
                ${coords[0]}, ${coords[1]}
              </div>
              <div style="display: flex; gap: 6px;">
                <button id="btn-set-origin" style="flex: 1; background: #2D9CDB; color: #fff; border: none; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: bold; cursor: pointer;">
                  ${t('plan.origin', 'Origin')}
                </button>
                <button id="btn-set-dest" style="flex: 1; background: #22C55E; color: #071A2B; border: none; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: bold; cursor: pointer;">
                  ${t('plan.destination', 'Destination')}
                </button>
              </div>
            </div>
          `)
          .openOn(map);

        clickPopupRef.current = popup;

        setTimeout(() => {
          const btnOrigin = document.getElementById('btn-set-origin');
          const btnDest = document.getElementById('btn-set-dest');
          if (btnOrigin && onMapClickSelect) {
            btnOrigin.onclick = () => {
              onMapClickSelect(coords, 'origin');
              map.closePopup(popup);
            };
          }
          if (btnDest && onMapClickSelect) {
            btnDest.onclick = () => {
              onMapClickSelect(coords, 'destination');
              map.closePopup(popup);
            };
          }
        }, 50);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center and Zoom if props change (when not actively following user)
  useEffect(() => {
    if (mapInstanceRef.current && center && !liveLocation && !navigationActive) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom, liveLocation, navigationActive]);

  // Handle Locate Me browser geolocation
  const handleLocateMe = () => {
    setIsLocating(true);
    setGeoMessage(null);

    if (!navigator.geolocation) {
      setGeoMessage(t('errors.unsupported', 'Geolocation is not supported by your browser.'));
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords: Coordinates = [position.coords.latitude, position.coords.longitude];
        setIsLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(userCoords, 15, { animate: true });
          if (userLocationLayerRef.current) {
            userLocationLayerRef.current.clearLayers();
            const gpsIcon = createNavigationGpsIcon(position.coords.heading || null);
            userLocationLayerRef.current.addLayer(
              L.marker(userCoords, { icon: gpsIcon }).bindPopup(t('plan.origin', 'You are here'))
            );
          }
        }
        setGeoMessage(t('map.liveGpsActive', 'Location found! Centered on your position in Pune.'));
        setTimeout(() => setGeoMessage(null), 3500);
      },
      () => {
        setIsLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(PUNE_CENTER, PUNE_ZOOM);
        }
        setGeoMessage(t('errors.positionUnavailable', 'Location permission denied or unavailable. Centered on Pune.'));
        setTimeout(() => setGeoMessage(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Render & smoothly update live location navigation marker & accuracy circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = userLocationLayerRef.current;
    if (!map || !layer) return;

    const activeLoc = liveLocation || (userLocation ? {
      latitude: userLocation[0],
      longitude: userLocation[1],
      accuracy: 20,
      heading: null,
      speed: null,
      timestamp: Date.now()
    } : null);

    if (!activeLoc) {
      layer.clearLayers();
      accuracyCircleRef.current = null;
      userMarkerRef.current = null;
      return;
    }

    const latlng: L.LatLngExpression = [activeLoc.latitude, activeLoc.longitude];

    // 1. Update or create accuracy circle
    if (!accuracyCircleRef.current) {
      const circle = L.circle(latlng, {
        radius: Math.max(10, activeLoc.accuracy),
        color: '#0091FF',
        weight: 1.5,
        opacity: 0.6,
        fillColor: '#0091FF',
        fillOpacity: 0.12
      });
      layer.addLayer(circle);
      accuracyCircleRef.current = circle;
    } else {
      accuracyCircleRef.current.setLatLng(latlng);
      accuracyCircleRef.current.setRadius(Math.max(10, activeLoc.accuracy));
    }

    // 2. Update or create GPS navigation marker
    const gpsIcon = createNavigationGpsIcon(activeLoc.heading);
    if (!userMarkerRef.current) {
      const marker = L.marker(latlng, {
        icon: gpsIcon,
        zIndexOffset: 1000
      });
      layer.addLayer(marker);
      userMarkerRef.current = marker;
    } else {
      userMarkerRef.current.setLatLng(latlng);
      userMarkerRef.current.setIcon(gpsIcon);
    }

    // 3. Auto-center on user if followUser is enabled
    if (followUser) {
      map.panTo(latlng, {
        animate: true,
        duration: 0.8
      });
    }
  }, [liveLocation, userLocation, followUser]);

  // Recenter click handler
  const handleRecenterClick = useCallback(() => {
    if (onRecenter) {
      onRecenter();
    }
    const map = mapInstanceRef.current;
    if (map && liveLocation) {
      map.setView([liveLocation.latitude, liveLocation.longitude], Math.max(map.getZoom(), 16), {
        animate: true
      });
    }
    if (onToggleFollow) {
      onToggleFollow(true);
    }
  }, [onRecenter, liveLocation, onToggleFollow]);

  // Update Hazard Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    hazards.forEach((hazard) => {
      const icon = createHazardIcon(hazard.type, hazard.severity);
      const marker = L.marker(hazard.coordinates, { icon });

      const popupContent = `
        <div style="min-width: 210px; padding: 4px; font-family: 'Inter', sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #24D6E8;">
              ${hazard.type.replace('_', ' ')}
            </span>
            <span style="font-size: 10px; background: rgba(239, 68, 68, 0.2); color: #EF4444; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
              ${hazard.severity}
            </span>
          </div>
          <h4 style="font-size: 12px; font-weight: bold; color: #FFFFFF; margin: 0 0 3px 0; line-height: 1.3;">
            ${hazard.title}
          </h4>
          <p style="font-size: 11px; color: #94A3B8; margin: 0 0 6px 0; line-height: 1.3;">
            ${hazard.locationName}
          </p>
          <div style="font-size: 10px; color: #E2E8F0; background: rgba(7, 26, 43, 0.5); padding: 4px; border-radius: 4px; margin-bottom: 6px;">
            ${hazard.severityLabel}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #CBD5E1; border-top: 1px solid #163A5E; padding-top: 5px;">
            <span>⏱️ ${hazard.reportedTime}</span>
            <span style="color: #22C55E; font-weight: bold;">🛡️ ${hazard.verificationCount} verified</span>
          </div>
          <button id="view-pune-hazard-${hazard.id}" style="width: 100%; margin-top: 8px; background: #2D9CDB; color: #FFFFFF; border: none; border-radius: 6px; padding: 5px 0; font-size: 11px; font-weight: bold; cursor: pointer;">
            ${t('map.inspectDetails', 'Inspect Safety Details →')}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectHazard) {
          onSelectHazard(hazard);
        }
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-pune-hazard-${hazard.id}`);
        if (btn && onSelectHazard) {
          btn.onclick = () => onSelectHazard(hazard);
        }
      });

      markersGroup.addLayer(marker);
    });

    // Draggable pin mode
    if (draggablePin && onPinDrag) {
      const pinIcon = L.divIcon({
        className: 'draggable-pin',
        html: `
          <div class="relative flex items-center justify-center animate-bounce">
            <div class="w-10 h-10 rounded-full bg-cyanGlow-400 flex items-center justify-center text-navy-950 font-black shadow-2xl border-2 border-white">
              📍
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const pinMarker = L.marker(center, { icon: pinIcon, draggable: true });
      pinMarker.on('dragend', (e) => {
        const latlng = e.target.getLatLng();
        onPinDrag([latlng.lat, latlng.lng]);
      });
      markersGroup.addLayer(pinMarker);
    }
  }, [hazards, draggablePin, center, t]);

  // Render Routes (Dual polyline: Risky in Red/Orange, Safe in Green/Cyan)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routesGroup = routesLayerRef.current;
    if (!map || !routesGroup) return;

    routesGroup.clearLayers();

    if (showRouteComparison && (defaultRouteCoordinates.length > 0 || safeRouteCoordinates.length > 0)) {
      // 1. Risky Default Route (Red/Orange dashed)
      if (defaultRouteCoordinates.length > 0) {
        const unsafeLine = L.polyline(defaultRouteCoordinates, {
          color: '#EF4444',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round'
        }).bindPopup(`
          <div style="font-size: 11px; color: #fff; padding: 4px;">
            <b style="color: #EF4444;">⚠️ Default Route (Via Shivajinagar / University Rd)</b>
            <p style="margin: 4px 0 0 0; color: #94A3B8;">Stalled by multi-vehicle collision and metro work.</p>
          </div>
        `);
        routesGroup.addLayer(unsafeLine);
      }

      // 2. Safe Alternate Route (Green with Cyan glow)
      if (safeRouteCoordinates.length > 0) {
        const safeGlow = L.polyline(safeRouteCoordinates, {
          color: '#24D6E8',
          weight: 9,
          opacity: 0.35,
          lineCap: 'round'
        });
        routesGroup.addLayer(safeGlow);

        const safeLine = L.polyline(safeRouteCoordinates, {
          color: '#22C55E',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round'
        }).bindPopup(`
          <div style="font-size: 11px; color: #fff; padding: 4px;">
            <b style="color: #22C55E;">🛡️ RouteShield Recommended Alternate</b>
            <p style="margin: 4px 0 0 0; color: #94A3B8;">Via Sangam Bridge & Senapati Bapat Marg bypass. Zero flood points.</p>
          </div>
        `);
        routesGroup.addLayer(safeLine);
      }

      // Origin Pin Marker
      if (originCoordinates) {
        const originIcon = L.divIcon({
          className: 'origin-marker',
          html: `
            <div class="px-2 py-1 bg-electric-500 text-white rounded-lg text-[10px] font-extrabold border border-white shadow-lg whitespace-nowrap">
              START: ${originName.slice(0, 18)}
            </div>
          `,
          iconSize: [110, 24],
          iconAnchor: [55, 12]
        });
        routesGroup.addLayer(L.marker(originCoordinates, { icon: originIcon }));
      }

      // Destination Pin Marker
      if (destCoordinates) {
        const destIcon = L.divIcon({
          className: 'dest-marker',
          html: `
            <div class="px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold border border-white shadow-lg whitespace-nowrap">
              DEST: ${destName.slice(0, 18)}
            </div>
          `,
          iconSize: [110, 24],
          iconAnchor: [55, 12]
        });
        routesGroup.addLayer(L.marker(destCoordinates, { icon: destIcon }));
      }

      // Only fit bounds if navigation is not active and not following user
      if (!navigationActive && !followUser) {
        const allCoords = [...defaultRouteCoordinates, ...safeRouteCoordinates];
        if (allCoords.length > 0) {
          const bounds = L.latLngBounds(allCoords);
          map.fitBounds(bounds, { padding: [40, 40] });
        }
      }
    }
  }, [
    showRouteComparison,
    defaultRouteCoordinates,
    safeRouteCoordinates,
    originCoordinates,
    destCoordinates,
    navigationActive,
    followUser
  ]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#163A5E] ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[inherit]" />

      {/* Floating Badge: Pune • Prototype / Demo Data */}
      <div className="absolute top-3 left-3 z-[400] pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-[#071A2B]/90 backdrop-blur-md border border-[#163A5E] text-[11px] text-slate-200 font-bold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyanGlow-400 animate-pulse"></span>
          <span>{t('app.prototypeBanner', 'Pune • Prototype / Demo Data')}</span>
        </div>
      </div>

      {/* Floating Map Controls: Recenter, Follow Toggle, Locate Me */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-2">
        {/* If live location is available or navigation active: show Recenter and Follow Toggle */}
        {(liveLocation || navigationActive) && (
          <div className="flex items-center gap-1.5 bg-[#0B2C47]/95 backdrop-blur-md border border-[#163A5E] rounded-xl p-1 shadow-xl">
            <button
              onClick={handleRecenterClick}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-electric-500/20 hover:bg-electric-500/30 text-cyanGlow-400 font-bold text-xs transition-all"
              title={t('map.recenter', 'Recenter')}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('map.recenter', 'Recenter')}</span>
            </button>

            {onToggleFollow && (
              <button
                onClick={() => onToggleFollow(!followUser)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  followUser
                    ? 'bg-cyanGlow-400 text-navy-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-[#071A2B]'
                }`}
                title={t('map.followLocation', 'Follow My Location')}
              >
                <span>{followUser ? 'Follow: ON' : 'Follow: OFF'}</span>
              </button>
            )}
          </div>
        )}

        {/* Locate Me GPS Button for overview mode */}
        {!navigationActive && (
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B2C47]/95 hover:bg-[#113E63] text-cyanGlow-400 border border-[#163A5E] shadow-xl text-xs font-bold transition-all disabled:opacity-50"
            title="Locate me in Pune"
          >
            <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('map.locateMe', 'Locate Me')}</span>
          </button>
        )}
      </div>

      {/* Geolocation feedback toast */}
      {geoMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 rounded-xl bg-[#0B2C47]/95 border border-[#163A5E] text-xs text-white shadow-2xl animate-fade-in text-center max-w-sm">
          {geoMessage}
        </div>
      )}
    </div>
  );
}
