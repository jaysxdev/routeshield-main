import React from 'react';
import { MapPin, Navigation, PlusCircle, Shield, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MobileNav({ activeScreen, setActiveScreen }) {
  const { t } = useTranslation();

  const items = [
    { id: 'map', label: t('nav.mobileMap', 'Map'), icon: MapPin },
    { id: 'plan', label: t('nav.mobileJourney', 'Journey'), icon: Navigation },
    { id: 'report', label: t('nav.mobileReport', 'Report'), icon: PlusCircle, highlight: true },
    { id: 'emergency', label: t('nav.mobileEmergency', 'SOS'), icon: PhoneCall, danger: true },
    { id: 'admin', label: t('nav.mobileAdmin', 'Admin'), icon: Shield }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#071A2B]/95 backdrop-blur-lg border-t border-[#163A5E] px-3 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 border-2 border-[#071A2B]">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-orange-400 mt-1">{item.label}</span>
              </button>
            );
          }

          if (item.danger) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-red-400 font-bold' : 'text-slate-400 hover:text-red-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-400 scale-110' : ''}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-cyanGlow-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyanGlow-400 scale-110' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
