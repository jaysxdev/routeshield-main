import React, { useState } from 'react';
import { Shield, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MapLegend() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-[#0B2C47]/95 backdrop-blur-md border border-[#163A5E] rounded-2xl shadow-2xl p-3 text-xs text-slate-200 transition-all max-w-sm">
      <div
        className="flex items-center justify-between cursor-pointer pb-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 font-bold text-white text-xs">
          <Shield className="w-3.5 h-3.5 text-cyanGlow-400" />
          <span>{t('map.legendTitle', 'Road Safety & Hazard Legend')}</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 space-y-2.5 pt-2 border-t border-[#163A5E]/80">
          {/* Risk Levels */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              {t('risk.score', 'Route Risk Score')}
            </span>
            <div className="grid grid-cols-4 gap-1 text-center font-bold text-[10px]">
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded py-1">
                0-30 {t('risk.safe', 'Safe')}
              </div>
              <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded py-1">
                31-60 {t('risk.caution', 'Caution')}
              </div>
              <div className="bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded py-1">
                61-80 {t('risk.high', 'High')}
              </div>
              <div className="bg-red-500/20 text-red-400 border border-red-500/40 rounded py-1">
                81-100 {t('risk.critical', 'Critical')}
              </div>
            </div>
          </div>

          {/* Hazard Marker Icons */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t('map.markers', 'Active Map Markers')}
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#24D6E8] inline-block shadow-sm"></span>
                <span>{t('hazards.waterlogging', 'Waterlogging')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block shadow-sm"></span>
                <span>{t('hazards.accident', 'Accident')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F97316] inline-block shadow-sm"></span>
                <span>{t('hazards.construction', 'Construction')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FACC15] inline-block shadow-sm"></span>
                <span>{t('hazards.manhole', 'Open Manhole')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#22C55E] inline-block shadow-sm"></span>
                <span>{t('hazards.tree_fall', 'Fallen Tree')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EAB308] inline-block shadow-sm"></span>
                <span>{t('hazards.electrical', 'Electrical Hazard')}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-[#163A5E]/60 pt-1.5 flex items-center justify-between">
            <span>{t('map.pulsingTip', 'Pulsing rings = Critical severity')}</span>
            <span className="text-cyanGlow-400">{t('map.liveGpsActive', 'Live GPS Active')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
