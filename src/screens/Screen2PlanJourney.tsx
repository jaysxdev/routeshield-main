import React, { useState } from 'react';
import {
  MapPin,
  ArrowUpDown,
  Shield,
  Sparkles,
  Footprints,
  Bike,
  Car,
  Accessibility,
  ArrowRight,
  MousePointerClick
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HazardMap } from '../components/map/HazardMap';
import { PUNE_PLACE_SUGGESTIONS } from '../data/puneData';
import {
  Coordinates,
  Hazard,
  TravelMode,
  AccessibilityProfile,
  AvoidRules
} from '../types/routeshield';

interface Screen2PlanJourneyProps {
  onFindSafestRoute: (params: {
    originCoords: Coordinates;
    destCoords: Coordinates;
    originName: string;
    destName: string;
    travelMode: TravelMode;
    accessibilityProfile: AccessibilityProfile;
    avoidRules: AvoidRules;
  }) => void;
  hazards: Hazard[];
  isCalculatingRoute?: boolean;
}

export function Screen2PlanJourney({
  onFindSafestRoute,
  hazards,
  isCalculatingRoute = false
}: Screen2PlanJourneyProps) {
  const { t } = useTranslation();

  // Default route: Pune Railway Station -> Savitribai Phule Pune University
  const [originName, setOriginName] = useState('Pune Railway Station');
  const [originCoords, setOriginCoords] = useState<Coordinates>([18.5284, 73.8739]);

  const [destName, setDestName] = useState('Savitribai Phule Pune University');
  const [destCoords, setDestCoords] = useState<Coordinates>([18.5538, 73.8249]);

  const [travelMode, setTravelMode] = useState<TravelMode>('Two-Wheeler');
  const [accessibilityProfile, setAccessibilityProfile] = useState<AccessibilityProfile>('Standard');

  const [avoidRules, setAvoidRules] = useState<AvoidRules>({
    waterlogging: true,
    accidents: true,
    construction: true,
    roadClosures: true,
    stairs: false
  });

  const swapLocations = () => {
    const tempName = originName;
    const tempCoords = originCoords;
    setOriginName(destName);
    setOriginCoords(destCoords);
    setDestName(tempName);
    setDestCoords(tempCoords);
  };

  const handleSelectOriginSuggestion = (s: (typeof PUNE_PLACE_SUGGESTIONS)[0]) => {
    setOriginName(s.name);
    setOriginCoords(s.coordinates);
  };

  const handleSelectDestSuggestion = (s: (typeof PUNE_PLACE_SUGGESTIONS)[0]) => {
    setDestName(s.name);
    setDestCoords(s.coordinates);
  };

  const handleMapClickSelect = (coords: Coordinates, role: 'origin' | 'destination') => {
    if (role === 'origin') {
      setOriginCoords(coords);
      setOriginName(`Map Point (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`);
    } else {
      setDestCoords(coords);
      setDestName(`Map Point (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`);
    }
  };

  const travelModes: { id: TravelMode; labelKey: string; label: string; subLabel: string; icon: any }[] = [
    { id: 'Car', labelKey: 'travelModes.car', label: 'Car', subLabel: 'driving-car', icon: Car },
    { id: 'Two-Wheeler', labelKey: 'travelModes.twoWheeler', label: 'Two-Wheeler', subLabel: 'road route', icon: Bike },
    { id: 'Walk', labelKey: 'travelModes.walk', label: 'Walk', subLabel: 'foot-walking', icon: Footprints },
    { id: 'Bicycle', labelKey: 'travelModes.bicycle', label: 'Bicycle', subLabel: 'cycling-regular', icon: Bike },
    { id: 'Wheelchair', labelKey: 'travelModes.wheelchair', label: 'Wheelchair', subLabel: 'accessible', icon: Accessibility }
  ];

  const accessibilityProfiles: { id: AccessibilityProfile; labelKey: string; label: string }[] = [
    { id: 'Standard', labelKey: 'accessibility.standard', label: 'Standard' },
    { id: 'Senior Citizen', labelKey: 'accessibility.senior', label: 'Senior Citizen' },
    { id: 'Wheelchair User', labelKey: 'accessibility.wheelchair', label: 'Wheelchair User' },
    { id: 'Parent with Child', labelKey: 'accessibility.parent', label: 'Parent with Child' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindSafestRoute({
      originCoords,
      destCoords,
      originName,
      destName,
      travelMode,
      accessibilityProfile,
      avoidRules
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyanGlow-400/10 border border-cyanGlow-400/30 text-cyanGlow-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OpenRouteService & OSM Hazard-Aware Navigation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Poppins']">
          {t('plan.heading', 'Plan My Safe Journey in Pune')}
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mt-1">
          {t(
            'plan.subtitle',
            'RouteShield calculates live flood depths, road accidents, and construction barricades to answer: “Can I safely reach my destination right now?”'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Routing Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Origin & Destination Inputs */}
            <div className="space-y-3 relative">
              {/* Origin */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyanGlow-400"></span>
                    {t('plan.originLabel', 'Origin (Start Point)')}
                  </span>
                  <span className="text-[10px] text-cyanGlow-400 font-medium">
                    {t('plan.originHint', 'Search landmark or click map')}
                  </span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-cyanGlow-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={originName}
                    onChange={(e) => setOriginName(e.target.value)}
                    placeholder={t('plan.originPlaceholder', 'Enter Pune location or landmark...')}
                    required
                    className="w-full bg-[#071A2B] border border-[#163A5E] rounded-2xl pl-10 pr-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-cyanGlow-400 transition-all"
                  />
                </div>

                {/* Quick Pune Place Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 self-center">{t('plan.popular', 'Popular:')}</span>
                  {PUNE_PLACE_SUGGESTIONS.slice(0, 4).map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => handleSelectOriginSuggestion(s)}
                      className="px-2 py-0.5 rounded-lg bg-[#071A2B] hover:bg-[#113E63] text-slate-300 hover:text-white border border-[#163A5E] text-[10px] transition-colors"
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="w-8 h-8 rounded-full bg-[#113E63] border border-[#1A5383] text-cyanGlow-400 hover:text-white flex items-center justify-center hover:scale-110 shadow-md transition-all"
                  title="Swap Origin and Destination"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    {t('plan.destinationLabel', 'Destination')}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {t('plan.destinationHint', 'Pune destination')}
                  </span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    placeholder={t('plan.destinationPlaceholder', 'Enter destination, university, or IT park...')}
                    required
                    className="w-full bg-[#071A2B] border border-[#163A5E] rounded-2xl pl-10 pr-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-400 transition-all"
                  />
                </div>

                {/* Quick Pune Destination Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 self-center">{t('plan.popular', 'Popular:')}</span>
                  {PUNE_PLACE_SUGGESTIONS.slice(1, 5).map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => handleSelectDestSuggestion(s)}
                      className="px-2 py-0.5 rounded-lg bg-[#071A2B] hover:bg-[#113E63] text-slate-300 hover:text-white border border-[#163A5E] text-[10px] transition-colors"
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel Mode Selector with ORS Profile Mapping */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t('plan.travelModeDesc', 'Travel Mode & ORS Profile')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {travelModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = travelMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setTravelMode(mode.id);
                        if (mode.id === 'Wheelchair') setAccessibilityProfile('Wheelchair User');
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-electric-500/20 border-cyanGlow-400 text-white shadow-glow-cyan'
                          : 'bg-[#071A2B] border-[#163A5E] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-cyanGlow-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold block">{t(mode.labelKey, mode.label)}</span>
                      <span className="text-[9px] text-slate-400 truncate max-w-full block">{mode.subLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessibility Profile */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t('plan.accessibilityProfile', 'Accessibility Profile')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {accessibilityProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setAccessibilityProfile(p.id);
                      if (p.id === 'Wheelchair User') {
                        setAvoidRules((r) => ({ ...r, stairs: true }));
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      accessibilityProfile === p.id
                        ? 'bg-purpleAccent-500/20 border-purpleAccent-400 text-white font-bold'
                        : 'bg-[#071A2B] border-[#163A5E] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{t(p.labelKey, p.label)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avoidance Toggles */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t('plan.avoidHeading', 'Hazard Avoidance Toggles')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { key: 'waterlogging', labelKey: 'plan.avoidWaterlogging', label: 'Avoid Floods' },
                  { key: 'accidents', labelKey: 'plan.avoidAccidents', label: 'Avoid Accidents' },
                  { key: 'construction', labelKey: 'plan.avoidConstruction', label: 'Avoid Work' },
                  { key: 'roadClosures', labelKey: 'plan.avoidRoadClosures', label: 'Avoid Closures' },
                  { key: 'stairs', labelKey: 'plan.avoidStairs', label: 'Avoid Stairs' }
                ].map((rule) => {
                  // @ts-ignore
                  const active = avoidRules[rule.key];
                  return (
                    <button
                      key={rule.key}
                      type="button"
                      onClick={() =>
                        // @ts-ignore
                        setAvoidRules((prev) => ({ ...prev, [rule.key]: !prev[rule.key] }))
                      }
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        active
                          ? 'bg-[#113E63] border-cyanGlow-400 text-white'
                          : 'bg-[#071A2B] border-[#163A5E] text-slate-400'
                      }`}
                    >
                      <span className="truncate mr-1">{t(rule.labelKey, rule.label)}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${
                          active ? 'bg-cyanGlow-400 text-navy-950' : 'bg-slate-800'
                        }`}
                      >
                        {active ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isCalculatingRoute}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-electric-500 via-cyanGlow-400 to-electric-500 text-navy-950 text-base font-black shadow-glow-cyan hover:opacity-95 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Shield className="w-5 h-5 fill-navy-950" />
              <span>
                {isCalculatingRoute
                  ? t('plan.calculating', 'Calculating OpenStreetMap Route...')
                  : t('plan.findSafestRouteBtn', 'Find Safest Pune Route Now')}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Right Column: Interactive Map Preview with Click-To-Pick (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-4 shadow-card flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#163A5E]">
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-cyanGlow-400" />
                <h3 className="font-bold text-white text-sm">
                  {t('plan.clickToSet', 'Click Map to Set Points')}
                </h3>
              </div>
              <span className="text-[10px] bg-[#163A5E] text-cyanGlow-400 font-bold px-2 py-0.5 rounded-full">
                Pune Interactive
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-2">
              {t('map.clickTip', 'Tip: Click anywhere on the Pune street map to set Origin or Destination directly.')}
            </p>

            <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden relative">
              <HazardMap
                hazards={hazards}
                originCoordinates={originCoords}
                destCoordinates={destCoords}
                originName={originName}
                destName={destName}
                onMapClickSelect={handleMapClickSelect}
                className="w-full h-full min-h-[300px]"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#071A2B] border border-[#163A5E]">
                <span className="text-slate-400 text-[10px] block">Deccan JM Road</span>
                <span className="font-extrabold text-cyanGlow-400 text-xs">
                  {t('hazards.waterlogging', 'Waterlogged')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#071A2B] border border-[#163A5E]">
                <span className="text-slate-400 text-[10px] block">Shivajinagar</span>
                <span className="font-extrabold text-red-400 text-xs">
                  {t('hazards.accident', 'Accident Stalled')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#071A2B] border border-[#163A5E]">
                <span className="text-slate-400 text-[10px] block">Sangam Bypass</span>
                <span className="font-extrabold text-emerald-400 text-xs">
                  {t('risk.safe', 'Clear & Safe')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
