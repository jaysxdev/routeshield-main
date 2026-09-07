import React from 'react';
import { CheckCircle, AlertTriangle, CornerUpRight, Clock, AlertOctagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function RiskBadge({ decision = 'USE ALTERNATE ROUTE', size = 'md', showDescription = false }) {
  const { t } = useTranslation();

  const configs = {
    'GO': {
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.35)]',
      icon: CheckCircle,
      label: t('recommendations.go', 'Go'),
      description: 'Roads are clear of severe waterlogging, accidents, or electrical hazards.'
    },
    'GO WITH CAUTION': {
      bg: 'bg-yellow-500/15',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_15px_rgba(250,204,21,0.35)]',
      icon: AlertTriangle,
      label: t('recommendations.goCaution', 'Go With Caution'),
      description: 'Minor waterlogging or construction in slow lanes. Reduce speed.'
    },
    'USE ALTERNATE ROUTE': {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_18px_rgba(245,158,11,0.4)]',
      icon: CornerUpRight,
      label: t('recommendations.alternateRoute', 'Use Alternate Route'),
      description: 'Default path severely obstructed. Verified safer detour available.'
    },
    'DELAY TRAVEL': {
      bg: 'bg-orange-500/15',
      border: 'border-orange-500/50',
      text: 'text-orange-400',
      glow: 'shadow-[0_0_18px_rgba(249,115,22,0.4)]',
      icon: Clock,
      label: t('recommendations.delayTravel', 'Delay Travel'),
      description: 'Active flash flooding or live wire hazard being cleared by responders.'
    },
    'AVOID TRAVEL': {
      bg: 'bg-red-500/20',
      border: 'border-red-500/60',
      text: 'text-red-400',
      glow: 'shadow-[0_0_22px_rgba(239,68,68,0.5)]',
      icon: AlertOctagon,
      label: t('recommendations.avoidTravel', 'Avoid Travel'),
      description: 'Extreme danger! Multiple closures and submerged roads reported.'
    }
  };

  const current = configs[decision] || configs['USE ALTERNATE ROUTE'];
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
    md: 'px-3.5 py-1.5 text-sm gap-2 font-bold',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-extrabold tracking-wide'
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center rounded-xl border backdrop-blur-md transition-all ${current.bg} ${current.border} ${current.text} ${current.glow} ${sizeClasses[size]}`}
      >
        <Icon className={size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>{current.label}</span>
      </div>
      {showDescription && (
        <span className="text-xs text-slate-300 pl-1">{current.description}</span>
      )}
    </div>
  );
}
