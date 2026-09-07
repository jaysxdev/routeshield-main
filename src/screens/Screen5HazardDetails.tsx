import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Share2,
  Navigation,
  ShieldAlert,
  ArrowLeft,
  PhoneCall
} from 'lucide-react';
import { HazardMap } from '../components/map/HazardMap';
import { StatusPill } from '../components/common/StatusPill';
import { HazardIcon } from '../components/common/HazardIcon';
import { Hazard } from '../types/routeshield';
import { useTranslation } from 'react-i18next';

interface Screen5HazardDetailsProps {
  hazard: Hazard | null;
  onBack: () => void;
  onPlanRouteWithHazard: (hazard: Hazard) => void;
  onEmergencyHelp: () => void;
}

export function Screen5HazardDetails({
  hazard,
  onBack,
  onPlanRouteWithHazard,
  onEmergencyHelp
}: Screen5HazardDetailsProps) {
  const { t } = useTranslation();
  const [confirmCount, setConfirmCount] = useState(hazard?.verificationCount || 15);
  const [disputeCount, setDisputeCount] = useState(hazard?.disputeCount || 0);
  const [userVote, setUserVote] = useState<'confirm' | 'dispute' | 'resolved' | null>(null);
  const [status, setStatus] = useState(hazard?.status || 'verified');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!hazard) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-slate-300">
        <p>{t('hazard.noSelected', 'No hazard selected.')}</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-electric-500 rounded-xl text-white font-bold text-xs">
          {t('hazard.returnToMap', 'Return to Pune Map')}
        </button>
      </div>
    );
  }

  const handleConfirm = () => {
    if (userVote === 'confirm') return;
    setConfirmCount((c) => c + 1);
    if (userVote === 'dispute') setDisputeCount((d) => Math.max(0, d - 1));
    setUserVote('confirm');
  };

  const handleDispute = () => {
    if (userVote === 'dispute') return;
    setDisputeCount((d) => d + 1);
    if (userVote === 'confirm') setConfirmCount((c) => Math.max(0, c - 1));
    setUserVote('dispute');
  };

  const handleMarkResolved = () => {
    setStatus('resolved');
    setUserVote('resolved');
  };

  const handleShare = () => {
    setCopiedLink(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`RouteShield Pune Alert: ${hazard.title} at ${hazard.locationName}. Avoid area.`);
    }
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B2C47] hover:bg-[#113E63] text-slate-300 hover:text-white border border-[#163A5E] text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pune Map</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2C47] hover:bg-[#113E63] text-cyanGlow-400 border border-[#163A5E] text-xs font-bold transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied' : 'Share Hazard Alert'}</span>
          </button>
          <button
            onClick={onEmergencyHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS Help</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl overflow-hidden shadow-card">
        {/* Header Ribbon */}
        <div className="p-6 border-b border-[#163A5E] bg-gradient-to-r from-[#0B2C47] to-[#071A2B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#113E63] border border-[#1A5383] text-cyanGlow-400 flex items-center justify-center shrink-0 shadow-lg">
              <HazardIcon type={hazard.type} className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-cyanGlow-400 text-navy-950">
                  {hazard.type.replace('_', ' ')}
                </span>
                <StatusPill status={status} count={confirmCount} />
                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-md font-bold">
                  {hazard.severity} Severity
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white font-['Poppins']">
                {hazard.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyanGlow-400" />
                  {hazard.locationName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Reported {hazard.reportedTime}
                </span>
                <span>•</span>
                <span className="text-purple-300 font-medium">
                  {hazard.reportedBy || 'Pune Scout Network'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onPlanRouteWithHazard(hazard)}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-electric-500 to-cyanGlow-400 text-navy-950 font-black text-xs shadow-glow-cyan hover:opacity-95 transition-all flex items-center gap-2 shrink-0"
          >
            <Navigation className="w-4 h-4 fill-navy-950" />
            <span>Route Around This Hazard</span>
          </button>
        </div>

        {/* Content: Photo with Privacy Blur + Details + 500m Vicinity Map */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#163A5E] bg-[#071A2B]">
              <img src={hazard.imageUrl} alt={hazard.title} className="w-full h-72 object-cover" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-[10px] text-white flex items-center gap-1.5 shadow-lg">
                <ShieldAlert className="w-3 h-3 text-cyanGlow-400" />
                <span>Privacy: Face & Vehicle Plates Blurred</span>
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#071A2B]/85 border border-[#163A5E] text-[10px] text-slate-300">
                Pune Civic Evidence #{hazard.id}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#071A2B] border border-[#163A5E]">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                Ground Situation Report
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">{hazard.description}</p>
              <div className="mt-3 pt-3 border-t border-[#163A5E] flex items-center justify-between text-xs">
                <span className="text-slate-400">Recommended Action:</span>
                <span className="text-emerald-400 font-bold">{hazard.recommendedAction}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Affected Commuter Modes
              </span>
              <div className="flex flex-wrap gap-2">
                {hazard.affectedModes.map((mode) => (
                  <span
                    key={mode}
                    className="px-3 py-1.5 rounded-xl bg-[#071A2B] border border-[#163A5E] text-xs font-bold text-slate-200 flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span>{mode}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            {/* Community Consensus */}
            <div className="p-5 rounded-2xl bg-[#071A2B] border border-[#163A5E] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Pune Community Verification</span>
                  <span className="text-[11px] text-slate-400">Real-time crowdsourced consensus</span>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {confirmCount} Confirmations
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    userVote === 'confirm'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-[#0B2C47] border-[#163A5E] text-slate-300'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Confirm ({confirmCount})</span>
                </button>

                <button
                  type="button"
                  onClick={handleDispute}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    userVote === 'dispute'
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 font-bold'
                      : 'bg-[#0B2C47] border-[#163A5E] text-slate-300'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Not Present ({disputeCount})</span>
                </button>

                <button
                  type="button"
                  onClick={handleMarkResolved}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    userVote === 'resolved' || status === 'resolved'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                      : 'bg-[#0B2C47] border-[#163A5E] text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-cyanGlow-400" />
                  <span>Mark Cleared</span>
                </button>
              </div>
            </div>

            {/* 500m Compact Vicinity Map */}
            <div className="flex-1 min-h-[220px] rounded-2xl overflow-hidden border border-[#163A5E] relative">
              <HazardMap
                center={hazard.coordinates}
                zoom={16}
                hazards={[hazard]}
                className="w-full h-full min-h-[220px]"
              />
              <div className="absolute top-2 left-2 z-[400] bg-[#071A2B]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-slate-200 border border-[#163A5E]">
                📍 500m Hazard Vicinity in Pune
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
