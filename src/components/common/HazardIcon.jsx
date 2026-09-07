import React from 'react';
import {
  Droplets,
  AlertTriangle,
  Cone,
  OctagonAlert,
  CircleDotDashed,
  Trees,
  Zap,
  Shield,
  Plus,
  Flame,
  HelpCircle
} from 'lucide-react';

export function HazardIcon({ type, className = "w-5 h-5" }) {
  switch (type) {
    case 'waterlogging':
      return <Droplets className={className} />;
    case 'accident':
      return <AlertTriangle className={className} />;
    case 'construction':
      return <Cone className={className} />;
    case 'closure':
      return <OctagonAlert className={className} />;
    case 'manhole':
      return <CircleDotDashed className={className} />;
    case 'tree_fall':
      return <Trees className={className} />;
    case 'electrical':
      return <Zap className={className} />;
    case 'police':
      return <Shield className={className} />;
    case 'hospital':
      return <Plus className={className} />;
    case 'fire':
      return <Flame className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
