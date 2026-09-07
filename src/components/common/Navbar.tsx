import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Bell,
  Navigation,
  PlusCircle,
  PhoneCall,
  Palette,
  AlertTriangle,
  Layers,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { PUNE_PLACE_SUGGESTIONS } from '../../data/puneData';
import { Coordinates } from '../../types/routeshield';

interface NavbarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  onOpenDesignSystem: () => void;
  hazardsCount?: number;
  onSearchPlace?: (coords: Coordinates, name: string) => void;
}

export function Navbar({
  activeScreen,
  setActiveScreen,
  onOpenDesignSystem,
  hazardsCount: _hazardsCount = 8,
  onSearchPlace
}: NavbarProps) {
  const { t, currentLanguage, setLanguage, languages } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof PUNE_PLACE_SUGGESTIONS>([]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 1) {
      const filtered = PUNE_PLACE_SUGGESTIONS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPlace = (place: (typeof PUNE_PLACE_SUGGESTIONS)[0]) => {
    setSearchQuery(place.name);
    setSearchResults([]);
    if (onSearchPlace) {
      onSearchPlace(place.coordinates, place.name);
    }
  };

  const notifications = [
    { id: 1, title: 'Knee-level flood at JM Road Deccan pedestrian crossing', time: '6m ago' },
    { id: 2, title: 'Multi-vehicle collision stalled Shivajinagar approach', time: '12m ago' },
    { id: 3, title: 'Uncovered open drain chamber flagged at Nal Stop Karve Rd', time: '4m ago' }
  ];

  const screenNavItems = [
    { id: 'map', labelKey: 'nav.map', fallback: '1. Pune Map' },
    { id: 'plan', labelKey: 'nav.plan', fallback: '2. Plan Journey' },
    { id: 'result', labelKey: 'nav.result', fallback: '3. Route Result' },
    { id: 'report', labelKey: 'nav.report', fallback: '4. Report Hazard' },
    { id: 'details', labelKey: 'nav.details', fallback: '5. Hazard Details' },
    { id: 'emergency', labelKey: 'nav.emergency', fallback: '6. Emergency Help' },
    { id: 'admin', labelKey: 'nav.admin', fallback: '7. Admin Dashboard' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071A2B]/95 backdrop-blur-md border-b border-[#163A5E]">
      {/* Top Pune Prototype / Demo Data Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-800 to-navy-950 px-4 py-1 text-center border-b border-navy-700/60 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 mx-auto">
          <span className="inline-block w-2 h-2 rounded-full bg-cyanGlow-400 animate-ping"></span>
          <span className="font-semibold text-cyanGlow-400 uppercase tracking-wider text-[11px]">
            {t('app.prototypeBanner', 'RouteShield Pune • Prototype / Demo Data')}
          </span>
          <span className="hidden sm:inline text-slate-400">
            • {t('app.corridorDesc', 'OpenStreetMap & OpenRouteService (ORS) • Shivajinagar • Deccan • SPPU • Swargate')}
          </span>
        </div>
        <button
          onClick={onOpenDesignSystem}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purpleAccent-500/20 hover:bg-purpleAccent-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-medium transition-all"
        >
          <Palette className="w-3 h-3" />
          <span>{t('app.designSystem', 'Design System')}</span>
        </button>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('map')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-cyanGlow-400 flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-navy-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-['Poppins']">
                  Route<span className="text-cyanGlow-400">Shield</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-electric-500/20 text-electric-400 border border-electric-500/30 text-[10px] font-bold">
                  {t('app.city', 'Pune')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
                {t('app.tagline', 'OpenStreetMap & ORS Safe Routing')}
              </p>
            </div>
          </button>
        </div>

        {/* Global Pune Place Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
          <div className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('app.searchPlaceholder', 'Search Pune landmark (e.g. Pune Station, SPPU, Deccan, Swargate)...')}
              className="w-full bg-[#0B2C47] border border-[#163A5E] rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyanGlow-400"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-[#0B2C47] border border-[#163A5E] rounded-2xl shadow-2xl p-2 z-50">
              {searchResults.map((p) => (
                <div
                  key={p.name}
                  onClick={() => handleSelectPlace(p)}
                  className="p-2 hover:bg-[#113E63] rounded-xl cursor-pointer text-xs flex items-center justify-between"
                >
                  <span className="font-bold text-white">{p.name}</span>
                  <span className="text-[10px] text-cyanGlow-400">{p.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setActiveScreen('plan')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeScreen === 'plan' || activeScreen === 'result'
                ? 'bg-electric-500 text-white shadow-glow-electric'
                : 'bg-[#0B2C47] text-slate-200 hover:bg-[#113E63] border border-[#163A5E]'
            }`}
          >
            <Navigation className="w-4 h-4 text-cyanGlow-400" />
            <span className="hidden sm:inline">{t('nav.planJourney', 'Plan My Journey')}</span>
          </button>

          <button
            onClick={() => setActiveScreen('report')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeScreen === 'report'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-orange-400" />
            <span className="hidden md:inline">{t('nav.reportHazard', 'Report Hazard')}</span>
          </button>

          <button
            onClick={() => setActiveScreen('emergency')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeScreen === 'emergency'
                ? 'bg-red-600 text-white shadow-glow-danger'
                : 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/40'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-red-400" />
            <span>{t('nav.sos', 'SOS')}</span>
          </button>

          {/* Fully Functional Language Selector (English, Marathi, Hindi) */}
          <div className="relative">
            <div className="flex items-center rounded-xl bg-[#0B2C47] border border-[#163A5E] p-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-cyanGlow-400 mx-1 hidden sm:inline" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    currentLanguage === lang.code
                      ? 'bg-cyanGlow-400/25 text-cyanGlow-300 font-bold border border-cyanGlow-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={lang.label}
                >
                  {lang.short}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-[#0B2C47] hover:bg-[#113E63] border border-[#163A5E] text-slate-300"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B2C47] border border-[#163A5E] rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#163A5E]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-cyanGlow-400" />
                    <span className="font-bold text-sm text-white">Pune Live Broadcast Alerts</span>
                  </div>
                  <span className="text-[11px] text-cyanGlow-400 font-semibold bg-cyanGlow-400/10 px-2 py-0.5 rounded-full">
                    Shivajinagar
                  </span>
                </div>
                <div className="divide-y divide-[#163A5E]/60 my-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setActiveScreen('map');
                        setShowNotifications(false);
                      }}
                      className="py-2.5 px-2 hover:bg-[#113E63]/60 rounded-xl cursor-pointer text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screen Navigation Strip */}
      <div className="bg-[#071A2B]/80 border-t border-[#163A5E]/60 px-4 py-1.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 font-medium mr-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyanGlow-400" />
              {t('app.screens', 'Screens:')}
            </span>
            {screenNavItems.map((scr) => (
              <button
                key={scr.id}
                onClick={() => setActiveScreen(scr.id)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-all ${
                  activeScreen === scr.id
                    ? 'bg-electric-500 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#0B2C47]'
                }`}
              >
                {t(scr.labelKey, scr.fallback)}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenDesignSystem}
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] whitespace-nowrap"
          >
            <Palette className="w-3 h-3" />
            {t('app.styleGuide', 'Style Guide')}
          </button>
        </div>
      </div>
    </header>
  );
}
