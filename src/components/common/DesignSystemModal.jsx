import React from 'react';
import {
  X,
  Palette,
  Type,
  Shield,
  Layers,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Cone,
  OctagonAlert,
  CircleDotDashed,
  Trees,
  Zap,
  PhoneCall,
  Plus
} from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { StatusPill } from './StatusPill';

export function DesignSystemModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const colorPalette = [
    { name: 'Dark Navy Background', hex: '#071A2B', class: 'bg-[#071A2B]', text: 'Primary Canvas' },
    { name: 'Deep Blue Surface', hex: '#0B2C47', class: 'bg-[#0B2C47]', text: 'Card Background' },
    { name: 'Electric Blue Primary', hex: '#2D9CDB', class: 'bg-[#2D9CDB]', text: 'Action / CTA' },
    { name: 'Cyan Glow Accent', hex: '#24D6E8', class: 'bg-[#24D6E8]', text: 'High Visibility Radar' },
    { name: 'Purple Civic Accent', hex: '#7C3AED', class: 'bg-[#7C3AED]', text: 'Volunteer / Badges' },
    { name: 'Safe Green (GO)', hex: '#22C55E', class: 'bg-[#22C55E]', text: 'Safe Passable Routes' },
    { name: 'Caution Yellow', hex: '#FACC15', class: 'bg-[#FACC15]', text: 'Slow Lane / Advisory' },
    { name: 'Construction Orange', hex: '#F97316', class: 'bg-[#F97316]', text: 'Metro / Road Works' },
    { name: 'Danger Red (AVOID)', hex: '#EF4444', class: 'bg-[#EF4444]', text: 'Subway Flood / Collisions' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#071A2B] border border-[#163A5E] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#163A5E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purpleAccent-500/20 border border-purpleAccent-500/40 text-purple-300 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Poppins']">
                RouteShield Civic-Tech Design System
              </h2>
              <p className="text-xs text-slate-400">
                Design Tokens, High-Contrast Palette, Typography, Badges & Accessibility Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0B2C47] hover:bg-[#113E63] text-slate-400 hover:text-white border border-[#163A5E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Color Palette Tokens */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-cyanGlow-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Core Color System & HSL Contrast Specs</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {colorPalette.map((col) => (
              <div
                key={col.name}
                className="p-3 rounded-2xl bg-[#0B2C47] border border-[#163A5E] flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${col.class} shrink-0 border border-white/20 shadow-md`}
                />
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">{col.name}</span>
                  <span className="text-[10px] font-mono text-cyanGlow-400 block">{col.hex}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{col.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Typography Scale */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-cyanGlow-400 tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>2. Typography Hierarchy (Inter & Poppins)</span>
          </h3>
          <div className="p-4 rounded-2xl bg-[#0B2C47] border border-[#163A5E] space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Display Heading 1 (Poppins 32px / Bold 900)</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-['Poppins']">
                “Can I safely reach my destination right now?”
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Card Title & Decision (Inter 18px / Bold 800)</span>
              <span className="text-lg font-extrabold text-cyanGlow-400">
                USE ALTERNATE ROUTE • 72/100 Route Risk Score
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Body Copy (Inter 14px / Regular 400)</span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Optimized for low-glare visibility in heavy downpours, night commuting, and high-urgency decision making.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Safety Decision Badges */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-cyanGlow-400 tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>3. Commuter Decision Badges (Color + Icon Accessible)</span>
          </h3>
          <div className="p-4 rounded-2xl bg-[#0B2C47] border border-[#163A5E] space-y-3">
            <p className="text-xs text-slate-400">
              Every status badge incorporates distinctive icon geometry, high contrast border, and text so color-blind commuters are never misled:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge decision="GO" size="md" />
              <RiskBadge decision="GO WITH CAUTION" size="md" />
              <RiskBadge decision="USE ALTERNATE ROUTE" size="md" />
              <RiskBadge decision="DELAY TRAVEL" size="md" />
              <RiskBadge decision="AVOID TRAVEL" size="md" />
            </div>
          </div>
        </div>

        {/* 4. Map Marker Styles & Icons */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-cyanGlow-400 tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>4. Map Marker Styles & Categorical Icons</span>
          </h3>
          <div className="p-4 rounded-2xl bg-[#0B2C47] border border-[#163A5E] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#071A2B]">
              <div className="w-8 h-8 rounded-lg bg-[#24D6E8] text-navy-950 flex items-center justify-center font-bold">
                🌊
              </div>
              <div>
                <span className="font-bold text-white block">Waterlogging</span>
                <span className="text-[10px] text-cyanGlow-400">#24D6E8</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#071A2B]">
              <div className="w-8 h-8 rounded-lg bg-[#EF4444] text-white flex items-center justify-center font-bold">
                ⚠️
              </div>
              <div>
                <span className="font-bold text-white block">Accident</span>
                <span className="text-[10px] text-red-400">#EF4444</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#071A2B]">
              <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold">
                🚧
              </div>
              <div>
                <span className="font-bold text-white block">Construction</span>
                <span className="text-[10px] text-orange-400">#F97316</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#071A2B]">
              <div className="w-8 h-8 rounded-lg bg-[#FACC15] text-navy-950 flex items-center justify-center font-bold">
                🕳️
              </div>
              <div>
                <span className="font-bold text-white block">Open Manhole</span>
                <span className="text-[10px] text-yellow-400">#FACC15</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close footer */}
        <div className="pt-4 border-t border-[#163A5E] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold transition-colors"
          >
            Close Design System Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
