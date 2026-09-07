import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  RotateCcw,
  AlertTriangle,
  X,
  PhoneCall,
  Volume2,
  VolumeX,
  CheckCircle,
  Compass,
  Share2,
  Lock,
  ShieldCheck,
  AlertOctagon,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RouteData, TurnType, Coordinates, Hazard } from '../../types/routeshield';
import { useLiveLocation } from '../../hooks/useLiveLocation';
import { useNavigationProgress } from '../../hooks/useNavigationProgress';
import { HazardMap } from '../map/HazardMap';
import confetti from 'canvas-confetti';

interface LiveNavigationOverlayProps {
  routeData: RouteData;
  hazards?: Hazard[];
  onExitNavigation: () => void;
  onRecalculate: () => void;
  onEmergencyHelp: () => void;
  onUpdateUserCoords?: (coords: Coordinates) => void;
}

export function LiveNavigationOverlay({
  routeData,
  hazards = [],
  onExitNavigation,
  onRecalculate,
  onEmergencyHelp,
  onUpdateUserCoords
}: LiveNavigationOverlayProps) {
  const { t } = useTranslation();
  const [muted, setMuted] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [showShareConfirm, setShowShareConfirm] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Initialize live geolocation tracking
  const {
    location: liveLocation,
    error: geoError,
    startTracking,
    stopTracking,
    setSimulatedLocation
  } = useLiveLocation({
    enableHighAccuracy: true,
    maximumAge: 3000,
    timeout: 10000,
    initialCoords: routeData.safeRouteCoordinates[0] || routeData.origin.coordinates
  });

  // Calculate live navigation progress along route
  const {
    currentStep,
    nextStep,
    currentStepIndex,
    totalSteps,
    distanceToNextTurnMeters,
    remainingDistanceMeters,
    remainingDurationSeconds,
    isOffRoute,
    distanceToRouteMeters,
    isArrived,
    currentSpeedKmh,
    advanceStep,
    prevStep: _prevStep,
    stepWaypoints
  } = useNavigationProgress({
    routeData,
    liveLocation,
    offRouteThresholdMeters: 85,
    stepAdvanceThresholdMeters: 40
  });

  // Start tracking upon entering navigation mode
  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  // Sync coords to parent if callback provided
  useEffect(() => {
    if (liveLocation && onUpdateUserCoords) {
      onUpdateUserCoords([liveLocation.latitude, liveLocation.longitude]);
    }
  }, [liveLocation, onUpdateUserCoords]);

  // Trigger arrival confetti when user reaches destination
  useEffect(() => {
    if (isArrived) {
      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  }, [isArrived]);

  // Handle Stop Navigation: clears watch and exits
  const handleStopNavigation = useCallback(() => {
    stopTracking();
    onExitNavigation();
  }, [stopTracking, onExitNavigation]);

  // Simulate next move for desktop/laptop testing without moving physically
  const handleSimulateNextMove = () => {
    const nextIdx = Math.min(currentStepIndex + 1, totalSteps - 1);
    advanceStep();
    const targetWaypoint = stepWaypoints[nextIdx];
    if (targetWaypoint) {
      setSimulatedLocation(targetWaypoint, 45, 8.33); // ~30 km/h
    }
  };

  // Turn icons mapping
  const renderTurnIcon = (type: TurnType) => {
    switch (type) {
      case 'left':
      case 'slight-left':
        return <ArrowLeft className="w-8 h-8 text-cyanGlow-400" />;
      case 'right':
      case 'slight-right':
        return <ArrowRight className="w-8 h-8 text-cyanGlow-400" />;
      case 'u-turn':
        return <RotateCcw className="w-8 h-8 text-yellow-400" />;
      case 'arrive':
        return <CheckCircle className="w-8 h-8 text-emerald-400" />;
      default:
        return <ArrowUp className="w-8 h-8 text-cyanGlow-400" />;
    }
  };

  const formatDist = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.ceil(seconds / 60);
    return `${mins} min`;
  };

  // Privacy Share Route confirmation handler
  const handleConfirmShare = () => {
    setShowShareConfirm(false);
    setShareSuccess(true);
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch {}

    const textToShare = `RouteShield Pune Safe Route: Navigating from ${routeData.origin.name} to ${routeData.destination.name}. Distance remaining: ${formatDist(remainingDistanceMeters)} (~${formatTime(remainingDurationSeconds)}). Current status: Safe Corridor.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
    }
    setTimeout(() => setShareSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-[#071A2B] flex flex-col overflow-hidden select-none">
      {/* Interactive Leaflet Map Background */}
      <div className="absolute inset-0 z-0">
        <HazardMap
          hazards={hazards}
          showRouteComparison={true}
          defaultRouteCoordinates={routeData.defaultRouteCoordinates}
          safeRouteCoordinates={routeData.safeRouteCoordinates}
          originCoordinates={routeData.origin.coordinates}
          destCoordinates={routeData.destination.coordinates}
          originName={routeData.origin.name}
          destName={routeData.destination.name}
          liveLocation={liveLocation}
          followUser={followUser}
          onToggleFollow={setFollowUser}
          navigationActive={true}
          className="w-full h-full"
        />
      </div>

      {/* TOP FLOATING HUD CARD: Current Road, Status & Controls */}
      <div className="relative z-10 p-3 sm:p-4 max-w-xl mx-auto w-full space-y-2 pointer-events-none">
        <div className="pointer-events-auto bg-[#071A2B]/95 backdrop-blur-md border border-[#163A5E] rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyanGlow-400/20 text-cyanGlow-400 border border-cyanGlow-400/40 flex items-center justify-center font-bold shrink-0">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase text-cyanGlow-400 tracking-wider">
                  {t('navigation.turnMode', 'Live Turn-by-Turn Mode')}
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                  {t('navigation.safeGps', 'Pune Safe GPS')}
                </span>
              </div>
              <h3 className="text-sm font-black text-white truncate max-w-[200px] sm:max-w-xs">
                {currentStep.roadName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-xl bg-[#0B2C47] text-slate-300 hover:text-white border border-[#163A5E]"
              title={muted ? t('navigation.unmute', 'Unmute Audio') : t('navigation.mute', 'Mute Audio')}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowShareConfirm(true)}
              className="p-2 rounded-xl bg-electric-500/20 text-electric-400 hover:bg-electric-500/30 border border-electric-500/40"
              title={t('result.shareRoute', 'Share My Route')}
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleStopNavigation}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40 text-xs font-bold transition-colors"
              title={t('result.stopNavigation', 'Stop Navigation')}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">{t('result.stopNavigation', 'Stop')}</span>
            </button>
          </div>
        </div>

        {/* ARRIVED AT DESTINATION BANNER */}
        {isArrived && (
          <div className="pointer-events-auto bg-emerald-600/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-emerald-400 flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
              <div>
                <p className="text-xs font-black leading-tight">
                  {t('navigation.arrived', 'You have arrived at your destination!')}
                </p>
                <p className="text-[10px] text-emerald-100">
                  {routeData.destination.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleStopNavigation}
              className="px-3 py-1.5 rounded-xl bg-white text-emerald-700 font-black text-xs shadow-md hover:bg-emerald-50 shrink-0"
            >
              {t('result.stopNavigation', 'Done')}
            </button>
          </div>
        )}

        {/* OFF-ROUTE WARNING BANNER */}
        {isOffRoute && (
          <div className="pointer-events-auto bg-red-600/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-red-400 flex items-center justify-between gap-2 animate-bounce">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">
                  {t('navigation.offRouteTitle', 'You are off route. Recalculate?')}
                </p>
                <p className="text-[10px] text-red-100">
                  {distanceToRouteMeters}m off planned route
                </p>
              </div>
            </div>
            <button
              onClick={onRecalculate}
              className="px-3 py-1.5 rounded-xl bg-white text-red-600 font-extrabold text-xs shadow-md hover:bg-red-50 shrink-0"
            >
              {t('navigation.recalculateBtn', 'Recalculate Route')}
            </button>
          </div>
        )}

        {/* GEOLOCATION ERROR OR WARNING BANNER */}
        {geoError && (
          <div className="pointer-events-auto bg-amber-500/95 text-navy-950 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-amber-300 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{geoError.message}</span>
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION CARD */}
      <div className="mt-auto relative z-10 p-3 sm:p-5 max-w-xl mx-auto w-full space-y-2 pointer-events-none">
        {/* Next step preview banner */}
        {nextStep && (
          <div className="pointer-events-auto bg-[#0B2C47]/90 backdrop-blur-md border border-[#163A5E] rounded-2xl px-4 py-2 text-xs text-slate-300 flex items-center justify-between shadow-lg">
            <span className="text-[11px] text-slate-400">
              {t('navigation.nextTurnIn', 'Then in')} {formatDist(distanceToNextTurnMeters)}:
            </span>
            <span className="font-semibold text-white truncate max-w-xs">{nextStep.instruction}</span>
          </div>
        )}

        {/* Primary Large Instruction Card */}
        <div className="pointer-events-auto bg-gradient-to-br from-[#0B2C47] via-[#071A2B] to-[#0B2C47] border-2 border-cyanGlow-400/60 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-start gap-3.5">
            {/* Turn Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyanGlow-400/15 border border-cyanGlow-400/40 flex items-center justify-center shrink-0 shadow-glow-cyan">
              {renderTurnIcon(currentStep.type)}
            </div>

            {/* Turn Instruction Text & Distance */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl sm:text-2xl font-black text-cyanGlow-400 font-mono">
                  {formatDist(distanceToNextTurnMeters)}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {t('navigation.stepOf', { current: currentStepIndex + 1, total: totalSteps })}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-black text-white leading-snug">
                {currentStep.instruction}
              </h2>

              {/* Step Hazard Warning Callout */}
              {currentStep.caution && (
                <div className="mt-2 p-2 rounded-xl bg-red-500/15 border border-red-500/40 text-[11px] text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="font-bold">{currentStep.caution}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Strip: Remaining Distance, ETA, Speed & Risk Score */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#163A5E] text-center text-xs">
            {/* Remaining Dist */}
            <div className="p-2 rounded-xl bg-[#071A2B]/80 border border-[#163A5E]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {t('result.remaining', 'Remaining')}
              </span>
              <span className="font-black text-white text-xs sm:text-sm">
                {formatDist(remainingDistanceMeters)}
              </span>
            </div>

            {/* ETA */}
            <div className="p-2 rounded-xl bg-[#071A2B]/80 border border-[#163A5E]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {t('result.eta', 'ETA')}
              </span>
              <span className="font-black text-cyanGlow-400 text-xs sm:text-sm">
                {formatTime(remainingDurationSeconds)}
              </span>
            </div>

            {/* Current Speed */}
            <div className="p-2 rounded-xl bg-[#071A2B]/80 border border-[#163A5E]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {t('result.speed', 'Speed')}
              </span>
              <span className="font-black text-white text-xs sm:text-sm">
                {currentSpeedKmh !== null ? `${currentSpeedKmh} ${t('navigation.speedUnit', 'km/h')}` : '--'}
              </span>
            </div>

            {/* Route Risk Score */}
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">
                {t('risk.title', 'Route Risk')}
              </span>
              <span className="font-black text-amber-300 text-xs sm:text-sm">
                {routeData.riskScore}/100
              </span>
            </div>
          </div>

          {/* Action Row: Emergency Help, Simulation Step Control, Stop Button */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={onEmergencyHelp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold transition-all"
              title={t('nav.emergencyHelp', 'Emergency Help')}
            >
              <PhoneCall className="w-4 h-4 text-red-400" />
              <span>{t('nav.sos', 'SOS')}</span>
            </button>

            {/* Simulated step progress for desktop testing */}
            <button
              onClick={handleSimulateNextMove}
              className="px-3 py-2 rounded-xl bg-[#071A2B] hover:bg-[#113E63] border border-[#163A5E] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
              title="Test next waypoint advancement"
            >
              <span>{t('navigation.simNextStep', 'Simulate Move')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyanGlow-400" />
            </button>

            <button
              onClick={handleStopNavigation}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-xs font-black shadow-md hover:opacity-90 transition-all"
            >
              {t('result.stopNavigation', 'Stop Navigation')}
            </button>
          </div>

          {/* Prototype Limitation & Privacy Note */}
          <div className="pt-2 border-t border-[#163A5E]/60 text-[10px] text-slate-400 text-center space-y-0.5">
            <p className="flex items-center justify-center gap-1 text-slate-300 font-medium">
              <Info className="w-3 h-3 text-cyanGlow-400 shrink-0" />
              <span>{t('map.accuracyNote', 'Live location accuracy depends on device GPS, browser permission, and network availability.')}</span>
            </p>
            <p className="text-[9px] text-slate-400">
              {t('privacy.note', 'Your live location stays on your device unless you explicitly choose to share it.')}
            </p>
          </div>
        </div>
      </div>

      {/* PRIVACY CONFIRMATION MODAL FOR "SHARE MY ROUTE" */}
      {showShareConfirm && (
        <div className="fixed inset-0 z-[700] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyanGlow-400/15 border border-cyanGlow-400/40 flex items-center justify-center text-cyanGlow-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-white">
                {t('privacy.shareConfirmTitle', 'Share My Safe Route?')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  'privacy.shareConfirmDesc',
                  'This will copy your journey summary and route status to share with your emergency contacts or companions. Your live location is not uploaded anywhere.'
                )}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#071A2B] border border-[#163A5E] text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>{routeData.origin.name}</span>
                <span>→</span>
                <span>{routeData.destination.name}</span>
              </div>
              <p className="text-[11px] text-cyanGlow-400">
                {formatDist(remainingDistanceMeters)} • ETA ~{formatTime(remainingDurationSeconds)}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowShareConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#071A2B] border border-[#163A5E] text-slate-300 hover:text-white font-bold text-xs"
              >
                {t('privacy.cancelBtn', 'Cancel')}
              </button>
              <button
                onClick={handleConfirmShare}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-electric-500 to-cyanGlow-400 text-navy-950 font-black text-xs shadow-glow-cyan"
              >
                {t('privacy.shareConfirmBtn', 'Confirm & Share')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {shareSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[750] px-4 py-2.5 rounded-2xl bg-emerald-500 text-navy-950 font-extrabold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('result.copied', 'Route summary copied to clipboard!')}</span>
        </div>
      )}
    </div>
  );
}
