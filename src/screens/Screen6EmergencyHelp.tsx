import React, { useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  Plus,
  Home,
  Share2,
  HeartPulse,
  Send
} from 'lucide-react';
import { PUNE_EMERGENCY_SERVICES } from '../data/puneData';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';

export function Screen6EmergencyHelp() {
  const { t } = useTranslation();
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [checkedList, setCheckedList] = useState<{ [key: string]: boolean }>({
    p1: false,
    p2: false,
    p3: false,
    p4: true,
    p5: false
  });

  const toggleCheck = (id: string) => {
    setCheckedList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShareSafetyStatus = () => {
    setCopiedStatus(true);
    const message = `RouteShield Emergency Alert: I am currently near Pune, Maharashtra. I am safe and tracking live flood & accident radars on RouteShield. Coordinates verified safe.`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
    }

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    setTimeout(() => setCopiedStatus(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* LARGE EMERGENCY WARNING BANNER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-glow-danger relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg font-black">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-black uppercase tracking-wider mb-1">
                Life Safety Protocol • Pune
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-['Poppins']">
                {t('emergency.immediateDanger', 'If there is immediate danger, contact official emergency services.')}
              </h1>
              <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-2xl">
                RouteShield provides crowdsourced hazard awareness in Pune. For active medical trauma, structural rescue, or fire, call official national hotlines immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:112"
              className="px-6 py-3 rounded-2xl bg-white text-red-600 font-black text-sm sm:text-base hover:bg-red-50 transition-all shadow-xl flex items-center gap-2 shrink-0"
            >
              <PhoneCall className="w-5 h-5 fill-red-600" />
              <span>{t('emergency.dial112', 'Dial 112')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* QUICK EMERGENCY HELPLINES GRID */}
      <div>
        <h2 className="text-sm font-bold uppercase text-slate-300 tracking-wider mb-3">
          Official Pune Emergency Desks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PUNE_EMERGENCY_SERVICES.helplines.map((line) => (
            <a
              key={line.number}
              href={`tel:${line.number}`}
              className="p-4 rounded-2xl bg-[#0B2C47] hover:bg-[#113E63] border border-[#163A5E] hover:border-red-400 transition-all group block shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-white group-hover:text-red-400 transition-colors font-mono">
                  {line.number}
                </span>
                <span className="w-8 h-8 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                  <PhoneCall className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{line.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{line.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* CHECKLIST & NEARBY HOSPITALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Safety Broadcast & Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#0B2C47] to-[#113E63] border border-cyanGlow-400/30 rounded-3xl p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-cyanGlow-400 font-bold text-sm">
              <Share2 className="w-4 h-4" />
              <span>Pune Trusted Contacts Broadcast</span>
            </div>
            <h3 className="text-lg font-black text-white font-['Poppins']">
              {t('emergency.shareSafetyStatus', 'Share My Safety Status')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Send a 1-tap WhatsApp or SMS alert with your current safe coordinates to reassure family during heavy Pune rains.
            </p>
            <button
              onClick={handleShareSafetyStatus}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-navy-950 font-black text-sm shadow-glow-safe hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 fill-navy-950" />
              <span>{copiedStatus ? 'Opening WhatsApp...' : 'Ping Trusted Contacts Now'}</span>
            </button>
          </div>

          <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#163A5E]">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <HeartPulse className="w-4 h-4 text-red-400" />
                <span>Pune Monsoon Safety Protocol</span>
              </div>
              <span className="text-[11px] text-cyanGlow-400 font-bold">
                {Object.values(checkedList).filter(Boolean).length}/5 Checked
              </span>
            </div>

            <div className="space-y-2">
              {PUNE_EMERGENCY_SERVICES.safetyChecklist.map((item) => {
                const isChecked = checkedList[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                        : 'bg-[#071A2B] border-[#163A5E] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 text-navy-950'
                          : 'bg-slate-800 border border-slate-600 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <span className={`leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Hospitals & Shelters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#163A5E]">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Plus className="w-4 h-4 text-red-400" />
                <span>Pune Emergency Hospitals (Trauma & 24/7 ICU)</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold">Dry Access Routes</span>
            </div>

            <div className="space-y-2.5">
              {PUNE_EMERGENCY_SERVICES.nearbyHospitals.map((hosp) => (
                <div
                  key={hosp.name}
                  className="p-3.5 rounded-2xl bg-[#071A2B] border border-[#163A5E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{hosp.name}</h4>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {hosp.beds}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{hosp.address}</p>
                    <span className="text-cyanGlow-400 font-semibold text-[11px] mt-1 inline-block">
                      📍 {hosp.distance}
                    </span>
                  </div>

                  <a
                    href={`tel:${hosp.phone}`}
                    className="px-3.5 py-2 rounded-xl bg-[#113E63] hover:bg-[#1A5383] text-white font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-cyanGlow-400" />
                    <span>Call Emergency</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#163A5E]">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Home className="w-4 h-4 text-cyanGlow-400" />
                <span>Safe Dry Waiting Shelters in Pune</span>
              </div>
              <span className="text-xs text-cyanGlow-400 font-bold">Elevated Ground</span>
            </div>

            <div className="space-y-2.5">
              {PUNE_EMERGENCY_SERVICES.safeWaitingPoints.map((pt) => (
                <div
                  key={pt.name}
                  className="p-3.5 rounded-2xl bg-[#071A2B] border border-[#163A5E] text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white text-sm">{pt.name}</h4>
                    <span className="text-[10px] bg-cyanGlow-400/20 text-cyanGlow-300 font-bold px-2 py-0.5 rounded-full">
                      {pt.capacity}
                    </span>
                  </div>
                  <p className="text-emerald-400 text-[11px] font-medium">{pt.type} • {pt.distance}</p>
                  <p className="text-slate-300 text-[11px] mt-1 leading-snug">{pt.features}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
