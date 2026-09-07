import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  Navigation,
  PlusCircle,
  PhoneCall,
  Clock,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HazardMap } from '../components/map/HazardMap';
import { MapLegend } from '../components/map/MapLegend';
import { StatusPill } from '../components/common/StatusPill';
import { HazardIcon } from '../components/common/HazardIcon';
import { Hazard } from '../types/routeshield';

interface Screen1LiveMapProps {
  hazards: Hazard[];
  onSelectHazard: (hazard: Hazard) => void;
  onPlanJourney: () => void;
  onReportHazard: () => void;
  onEmergencyHelp: () => void;
}

export function Screen1LiveMap({
  hazards,
  onSelectHazard,
  onPlanJourney,
  onReportHazard,
  onEmergencyHelp
}: Screen1LiveMapProps) {
  const { t } = useTranslation();

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({
    waterlogging: true,
    accident: true,
    construction: true,
    closure: true,
    manhole: true,
    tree_fall: true,
    electrical: true,
    verifiedOnly: false
  });

  const [searchFilter] = useState<string>('');

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredHazards = useMemo(() => {
    return hazards.filter((h) => {
      if (!activeFilters[h.type]) return false;
      if (activeFilters.verifiedOnly && h.status !== 'verified') return false;
      if (
        searchFilter &&
        !h.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !h.locationName.toLowerCase().includes(searchFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [hazards, activeFilters, searchFilter]);

  const recentAlerts = useMemo(() => {
    return [...hazards]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4);
  }, [hazards]);

  const hazardFilterCategories = [
    { key: 'waterlogging', labelKey: 'hazards.waterlogging', fallback: 'Waterlogging', color: '#24D6E8' },
    { key: 'accident', labelKey: 'hazards.accident', fallback: 'Accident', color: '#EF4444' },
    { key: 'construction', labelKey: 'hazards.construction', fallback: 'Construction', color: '#F97316' },
    { key: 'closure', labelKey: 'hazards.closure', fallback: 'Road Closure', color: '#DC2626' },
    { key: 'manhole', labelKey: 'hazards.manhole', fallback: 'Open Manhole', color: '#FACC15' },
    { key: 'electrical', labelKey: 'hazards.electrical', fallback: 'Electrical Hazard', color: '#EAB308' },
    { key: 'tree_fall', labelKey: 'hazards.tree_fall', fallback: 'Fallen Tree', color: '#22C55E' }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] min-h-[640px] flex flex-col overflow-hidden bg-[#071A2B]">
      {/* Floating Action Strip */}
      <div className="bg-[#0B2C47]/90 backdrop-blur-md border-b border-[#163A5E] px-4 py-2.5 z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyanGlow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyanGlow-400"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {t('map.puneRadar', 'Pune Road Safety & Monsoon Radar • OpenStreetMap & ORS Live')}
            </span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            ⚠️ {t('map.warnings', 'JM Road & Shivajinagar Warnings')}
          </span>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlanJourney}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-electric-500 to-cyanGlow-400 text-navy-950 text-xs sm:text-sm font-extrabold shadow-glow-cyan hover:scale-[1.02] transition-transform"
          >
            <Navigation className="w-4 h-4 fill-navy-950" />
            <span>{t('nav.planJourney', 'Plan My Journey')}</span>
          </button>
          <button
            onClick={onReportHazard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs sm:text-sm font-bold transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('nav.reportHazard', 'Report Hazard')}</span>
          </button>
          <button
            onClick={onEmergencyHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs sm:text-sm font-bold transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('nav.emergencyHelp', 'Emergency Help')}</span>
          </button>
        </div>
      </div>

      {/* Main Map Body: Filters + Map + Live Alerts */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Filter Panel */}
        <aside className="w-72 bg-[#0B2C47]/95 backdrop-blur-md border-r border-[#163A5E] flex flex-col p-4 z-20 overflow-y-auto hidden md:flex shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-[#163A5E]">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <SlidersHorizontal className="w-4 h-4 text-cyanGlow-400" />
              <span>{t('map.hazardRadar', 'Pune Hazard Radar')}</span>
            </div>
            <span className="text-xs bg-[#163A5E] text-cyanGlow-400 px-2 py-0.5 rounded-full font-bold">
              {filteredHazards.length} {t('map.active', 'Active')}
            </span>
          </div>

          {/* Verified Only Toggle */}
          <div className="my-3 p-3 rounded-xl bg-[#071A2B] border border-[#163A5E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {t('map.verifiedOnly', 'Verified Only')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {t('map.verifiedOnlyDesc', 'Scout & Traffic confirmed')}
                </span>
              </div>
            </div>
            <button
              onClick={() => toggleFilter('verifiedOnly')}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                activeFilters.verifiedOnly ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  activeFilters.verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              {t('map.activeTypes', 'Active Hazard Types')}
            </span>

            {hazardFilterCategories.map((cat) => {
              const isChecked = activeFilters[cat.key];
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleFilter(cat.key)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all border ${
                    isChecked
                      ? 'bg-[#113E63]/80 border-[#1A5383] text-white'
                      : 'bg-[#071A2B]/50 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{t(cat.labelKey, cat.fallback)}</span>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isChecked ? 'bg-cyanGlow-400 text-navy-950' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pune Commuter Question Box */}
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-purpleAccent-500/20 to-electric-500/20 border border-purpleAccent-500/40 text-xs">
            <span className="text-[10px] uppercase font-black text-cyanGlow-400 tracking-wider block mb-1">
              RouteShield Pune
            </span>
            <p className="text-slate-200 text-xs font-medium leading-relaxed">
              {t('map.commuterQuestion', '“Can I safely reach my destination right now?”')}
            </p>
            <button
              onClick={onPlanJourney}
              className="mt-2 text-cyanGlow-400 hover:text-white font-bold inline-flex items-center gap-1 text-[11px]"
            >
              {t('map.getScore', 'Get personalized route score →')}
            </button>
          </div>
        </aside>

        {/* Center Interactive OpenStreetMap */}
        <main className="flex-1 relative h-full">
          <HazardMap
            hazards={filteredHazards}
            onSelectHazard={onSelectHazard}
            className="w-full h-full"
          />

          {/* Map Floating Legend (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:block">
            <MapLegend />
          </div>
        </main>

        {/* Right Live Alerts Feed */}
        <aside className="w-80 lg:w-88 bg-[#0B2C47]/95 backdrop-blur-md border-l border-[#163A5E] flex flex-col p-4 z-20 overflow-y-auto hidden xl:flex shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-[#163A5E]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="font-bold text-white text-sm">
                {t('map.liveAlerts', 'Live Alerts Near You')}
              </span>
            </div>
            <span className="text-xs text-cyanGlow-400 font-bold">
              {t('map.puneCorridor', 'Pune Corridor')}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 my-2">
            {t('map.recentReportsDesc', 'Verified reports from Deccan, Shivajinagar & University Road:')}
          </p>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onSelectHazard(alert)}
                className="p-3 rounded-2xl bg-[#071A2B] hover:bg-[#113E63]/70 border border-[#163A5E] cursor-pointer transition-all hover:border-cyanGlow-400/40 group shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0B2C47] border border-[#163A5E] flex items-center justify-center text-cyanGlow-400">
                      <HazardIcon type={alert.type} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-cyanGlow-400 tracking-wide block">
                        {t(`hazards.${alert.type}`, alert.type.replace('_', ' '))}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {alert.reportedTime}
                      </span>
                    </div>
                  </div>
                  <StatusPill status={alert.status} count={alert.verificationCount} />
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-cyanGlow-400 transition-colors line-clamp-1">
                  {alert.title}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug">
                  {alert.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-[#163A5E]/80 flex items-center justify-between text-[10px]">
                  <span className="text-orange-400 font-semibold">{alert.severityLabel}</span>
                  <span className="text-cyanGlow-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                    {t('map.inspect', 'Inspect')} <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {t('nav.emergencyHelp', 'Emergency Help')}
                </span>
                <span className="text-[10px] text-slate-400">Police & Disaster Cell</span>
              </div>
            </div>
            <button
              onClick={onEmergencyHelp}
              className="px-2.5 py-1 rounded-lg bg-red-500 text-white font-black text-xs hover:bg-red-600"
            >
              {t('emergency.dial112', 'Dial 112')}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
