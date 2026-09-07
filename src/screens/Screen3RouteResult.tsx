import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  RotateCcw,
  Share2,
  PlusCircle,
  PhoneCall,
  AlertTriangle,
  Play,
  CheckCircle,
  Footprints,
  Compass,
  ListOrdered
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HazardMap } from '../components/map/HazardMap';
import { RiskBadge } from '../components/common/RiskBadge';
import { RouteData, Hazard, TurnType, Coordinates } from '../types/routeshield';
import confetti from 'canvas-confetti';

interface Screen3RouteResultProps {
  routeData: RouteData;
  hazards: Hazard[];
  onSelectHazard: (hazard: Hazard) => void;
  onReportHazard: () => void;
  onEmergencyHelp: () => void;
  onReplan: () => void;
  onStartNavigation: () => void;
  userGPSCoords?: Coordinates | null;
}

export function Screen3RouteResult({
  routeData,
  hazards,
  onSelectHazard,
  onReportHazard,
  onEmergencyHelp,
  onReplan,
  onStartNavigation,
  userGPSCoords = null
}: Screen3RouteResultProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'directions' | 'hazards'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareRoute = () => {
    setCopiedLink(true);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch {}

    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `RouteShield Pune Safe Route: ${routeData.origin.name} to ${routeData.destination.name}. Recommendation: ${routeData.recommendation} (Risk: ${routeData.riskScore}/100).`
      );
    }
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const renderTurnIcon = (type: TurnType) => {
    switch (type) {
      case 'left':
      case 'slight-left':
        return <ArrowLeft className="w-4 h-4 text-cyanGlow-400" />;
      case 'right':
      case 'slight-right':
        return <ArrowRight className="w-4 h-4 text-cyanGlow-400" />;
      case 'u-turn':
        return <RotateCcw className="w-4 h-4 text-yellow-400" />;
      case 'arrive':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <ArrowUp className="w-4 h-4 text-cyanGlow-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Route Header Card */}
      <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyanGlow-400 font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>OpenRouteService & OSM Computed Safety Route</span>
            {routeData.isOrsLive && (
              <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ORS Cloud Live
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-black text-white font-['Poppins']">
            <span>{routeData.origin.name}</span>
            <ArrowRight className="w-5 h-5 text-cyanGlow-400" />
            <span>{routeData.destination.name}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Corridor: Pune Station • Sangam Bridge • Shivajinagar • Ganeshkhind • SPPU University
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onStartNavigation}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-navy-950 text-xs sm:text-sm font-black shadow-glow-safe hover:scale-105 transition-all"
          >
            <Play className="w-4 h-4 fill-navy-950" />
            <span>{t('result.startNavigation', 'Start Navigation')}</span>
          </button>
          <button
            onClick={handleShareRoute}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-electric-500/20 hover:bg-electric-500/30 text-electric-400 border border-electric-500/40 text-xs sm:text-sm font-bold transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedLink ? t('result.copied', 'Copied!') : t('result.shareRoute', 'Share My Route')}</span>
          </button>
          <button
            onClick={onReportHazard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs sm:text-sm font-bold transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('nav.reportHazard', 'Report Hazard')}</span>
          </button>
          <button
            onClick={onEmergencyHelp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs sm:text-sm font-bold transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('nav.emergencyHelp', 'Emergency Help')}</span>
          </button>
        </div>
      </div>

      {/* PROMINENT SAFETY DECISION CARD */}
      <div className="bg-gradient-to-br from-[#0B2C47] via-[#0D3659] to-[#071A2B] border-2 border-amber-500/50 rounded-3xl p-6 shadow-glow-caution relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Decision Pill & Explanation (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t('risk.verdict', 'Route Safety Verdict:')}
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/40">
                Confidence 94%
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge decision={routeData.recommendation} size="lg" />
              <div className="text-xs text-slate-300">
                Default route is <span className="text-red-400 font-bold">Stalled / High Hazard</span>.
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {routeData.explanation}
            </p>

            {/* Ground Obstructions near Route */}
            <div className="space-y-2 pt-2 border-t border-[#163A5E]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Detected Pune Hazards Affecting Default Path:
              </span>
              {routeData.nearbyHazards.length === 0 ? (
                <p className="text-xs text-emerald-400">Zero major hazards within 150m buffer.</p>
              ) : (
                routeData.nearbyHazards.map(({ hazard, distanceMeters }) => (
                  <div
                    key={hazard.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#071A2B]/60 border border-[#163A5E]/80 text-xs"
                  >
                    <span className="p-1.5 rounded-lg bg-red-500/15 text-red-400 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{hazard.title}</span>
                        <span className="text-cyanGlow-400 font-bold text-[10px]">{distanceMeters}m from road</span>
                      </div>
                      <span className="text-slate-300 text-[11px] block mt-0.5">{hazard.severityLabel}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Risk Gauge Bar & Fast Metrics (5 cols) */}
          <div className="lg:col-span-5 bg-[#071A2B]/90 border border-[#163A5E] rounded-2xl p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('risk.score', 'Default Route Risk Score')}
                </span>
                <span className="text-xl font-black text-amber-400">
                  {routeData.riskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
              </div>

              {/* Gradient risk bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 relative overflow-hidden border border-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 to-red-500 transition-all duration-1000"
                  style={{ width: `${routeData.riskScore}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>0 {t('risk.safe', 'Safe')}</span>
                <span>35 {t('risk.caution', 'Caution')}</span>
                <span className="text-amber-400 font-bold">72 {t('risk.high', 'High Risk')}</span>
                <span>100 {t('risk.critical', 'Critical')}</span>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                <span className="text-[10px] font-bold text-red-400 uppercase block">Default (Shivajinagar)</span>
                <span className="text-lg font-black text-white block mt-0.5">{routeData.durationMins + 18} mins</span>
                <span className="text-[11px] text-red-300 font-medium">+18 min delay</span>
                <span className="text-[10px] text-slate-400 block mt-1">4.8 km • 2 Severe Hazards</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-navy-950 font-black text-[9px] px-1.5 py-0.2 rounded-bl">
                  RECOMMENDED
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase block">Sangam Bypass</span>
                <span className="text-lg font-black text-emerald-300 block mt-0.5">{routeData.durationMins} mins</span>
                <span className="text-[11px] text-emerald-400 font-bold">{routeData.safetyAdvantage}</span>
                <span className="text-[10px] text-slate-400 block mt-1">{routeData.distanceKm} km • 0 Floods</span>
              </div>
            </div>

            <button
              onClick={onReplan}
              className="w-full py-2 rounded-xl bg-[#113E63] hover:bg-[#1A5383] text-cyanGlow-400 font-bold text-xs transition-colors text-center block"
            >
              {t('result.adjustSettings', 'Adjust Avoidance Settings & Travel Mode →')}
            </button>
          </div>
        </div>
      </div>

      {/* 3 TABS: Overview, Directions, and Hazards */}
      <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#163A5E] pb-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'overview', label: t('result.overviewTab', '1. Map Overview'), icon: Compass },
              {
                id: 'directions',
                label: t('result.directionsTab', '2. Turn-by-Turn Directions'),
                icon: ListOrdered,
                badge: `${routeData.steps.length} ${t('result.steps', 'Steps')}`
              },
              {
                id: 'hazards',
                label: t('result.hazardsTab', '3. Hazard Proximity Radar'),
                icon: AlertTriangle,
                badge: `${routeData.nearbyHazards.length}`
              }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-electric-500 text-white shadow-glow-electric'
                      : 'bg-[#071A2B] text-slate-400 hover:text-white border border-[#163A5E]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-cyanGlow-400/20 text-cyanGlow-300 text-[10px]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={onStartNavigation}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-navy-950 font-black text-xs shadow-glow-safe hover:bg-emerald-400"
          >
            <Play className="w-3.5 h-3.5 fill-navy-950" />
            <span>{t('result.startNavigation', 'Start Navigation')}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-[440px] rounded-2xl overflow-hidden relative border border-[#163A5E]">
              <HazardMap
                hazards={hazards}
                showRouteComparison={true}
                defaultRouteCoordinates={routeData.defaultRouteCoordinates}
                safeRouteCoordinates={routeData.safeRouteCoordinates}
                originCoordinates={routeData.origin.coordinates}
                destCoordinates={routeData.destination.coordinates}
                originName={routeData.origin.name}
                destName={routeData.destination.name}
                userLocation={userGPSCoords}
                onSelectHazard={onSelectHazard}
                className="w-full h-full"
              />
            </div>

            {/* Last-Mile Safety Card */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-2xl bg-[#071A2B] border border-cyanGlow-400/40 space-y-2.5">
                <div className="flex items-center gap-2 text-cyanGlow-400 font-bold text-xs">
                  <Footprints className="w-4 h-4" />
                  <span>{t('result.lastMileGuidance', 'Pune Last-Mile Safety Guidance')}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B2C47] border border-[#163A5E] text-xs">
                  <span className="text-[10px] uppercase font-black text-cyanGlow-400 block mb-1">
                    Station Concourse Access
                  </span>
                  <p className="text-slate-200 leading-snug">
                    Use Pune Station Platform 1 Foot-Over-Bridge to Sasoon Road Exit. Avoid flooded luggage underpass.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0B2C47] border border-[#163A5E] text-xs">
                  <span className="text-[10px] uppercase font-black text-emerald-400 block mb-1">
                    University Approach Advice
                  </span>
                  <p className="text-slate-200 leading-snug">
                    Enter SPPU through West Campus Gate via Chatushrungi Road to bypass University Circle metro barricades.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/15 to-navy-950 border border-emerald-500/40 text-xs">
                  <span className="text-[10px] uppercase font-black text-emerald-300 block mb-1">
                    Safe Dry Waiting Point Nearby
                  </span>
                  <p className="text-slate-200 font-semibold leading-snug">
                    Shivajinagar Pune Metro Concourse (Dry platform with first aid & clean water)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TURN-BY-TURN DIRECTIONS */}
        {activeTab === 'directions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#163A5E] text-xs">
              <span className="text-slate-300 font-bold">
                Numbered Instructions for Recommended Safe Pune Route ({routeData.steps.length} {t('result.turns', 'turns')})
              </span>
              <span className="text-cyanGlow-400 font-mono">
                {t('result.remaining', 'Total Distance')}: {routeData.distanceKm} km • {t('result.eta', 'Est')}: {routeData.durationMins} mins
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {routeData.steps.map((step) => (
                <div
                  key={step.id}
                  className="p-3.5 rounded-2xl bg-[#071A2B] border border-[#163A5E] hover:border-cyanGlow-400/40 transition-all flex items-start gap-3.5 text-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#113E63] text-cyanGlow-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#1A5383]">
                    {step.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {renderTurnIcon(step.type)}
                        <span className="text-white font-bold text-sm">{step.instruction}</span>
                      </div>
                      <span className="text-cyanGlow-400 font-mono font-bold whitespace-nowrap">
                        {step.distanceMeters >= 1000
                          ? `${(step.distanceMeters / 1000).toFixed(1)} km`
                          : `${step.distanceMeters} m`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Road: {step.roadName}</span>
                      <span>•</span>
                      <span>~{Math.ceil(step.durationSeconds / 60)} min</span>
                    </div>

                    {/* Step-specific Hazard Caution Warning */}
                    {step.caution && (
                      <div className="mt-2 p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-[11px] text-red-200 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="font-semibold">{step.caution}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HAZARD PROXIMITY RADAR */}
        {activeTab === 'hazards' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              Hazards detected within approximately 150 meters of the standard route in Pune:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {routeData.nearbyHazards.map(({ hazard, distanceMeters, penalty }) => (
                <div
                  key={hazard.id}
                  onClick={() => onSelectHazard(hazard)}
                  className="p-4 rounded-2xl bg-[#071A2B] border border-[#163A5E] hover:border-cyanGlow-400 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-cyanGlow-400">
                      {t(`hazards.${hazard.type}`, hazard.type.replace('_', ' '))}
                    </span>
                    <span className="text-xs bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/40">
                      +{penalty} Risk Penalty
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{hazard.title}</h4>
                  <p className="text-xs text-slate-300">{hazard.description}</p>

                  <div className="pt-2 border-t border-[#163A5E] flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">📍 {distanceMeters}m off corridor</span>
                    <span className="text-cyanGlow-400 font-bold">
                      {t('map.inspectDetails', 'Inspect details →')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
