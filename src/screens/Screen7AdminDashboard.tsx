import React, { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  CheckCircle2,
  Flame,
  Activity,
  Layers
} from 'lucide-react';
import { HazardMap } from '../components/map/HazardMap';
import { HazardIcon } from '../components/common/HazardIcon';
import { Hazard } from '../types/routeshield';
import { useTranslation } from 'react-i18next';

interface Screen7AdminDashboardProps {
  hazards: Hazard[];
  onUpdateHazardLifecycle: (id: string, stage: Hazard['lifecycle'], status: Hazard['status']) => void;
  onSelectHazard: (hazard: Hazard) => void;
}

export function Screen7AdminDashboard({
  hazards,
  onUpdateHazardLifecycle,
  onSelectHazard
}: Screen7AdminDashboardProps) {
  const { t } = useTranslation();
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<Hazard>(hazards[0]);

  const lifecycleStages = [
    { id: 'Reported', labelKey: 'status.reported', label: 'Reported', color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30' },
    { id: 'Verified', labelKey: 'status.verified', label: 'Verified', color: 'text-cyanGlow-400 bg-cyanGlow-400/15 border-cyanGlow-400/30' },
    { id: 'Prioritised', labelKey: 'status.prioritised', label: 'Prioritised', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
    { id: 'In Progress', labelKey: 'status.inProgress', label: 'In Progress', color: 'text-orange-400 bg-orange-500/15 border-orange-500/30' },
    { id: 'Resolved', labelKey: 'status.resolved', label: 'Resolved', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' }
  ];

  const countsByStage = useMemo(() => {
    const counts: Record<string, number> = { Reported: 0, Verified: 0, Prioritised: 0, 'In Progress': 0, Resolved: 0 };
    hazards.forEach((h) => {
      const stage = h.lifecycle || 'Reported';
      if (counts[stage] !== undefined) counts[stage]++;
    });
    return counts;
  }, [hazards]);

  const filteredIncidents = useMemo(() => {
    return hazards.filter((h) => {
      const stage = h.lifecycle || 'Reported';
      if (lifecycleFilter !== 'All' && stage !== lifecycleFilter) return false;
      if (severityFilter !== 'All' && h.severity !== severityFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return h.title.toLowerCase().includes(query) || h.locationName.toLowerCase().includes(query);
      }
      return true;
    });
  }, [hazards, lifecycleFilter, severityFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#163A5E]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purpleAccent-500/20 text-purple-400 flex items-center justify-center font-black text-sm border border-purpleAccent-500/40">
              PN
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Poppins']">
              Pune Volunteer & Civic Operations Command
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident triage, volunteer verification queue, and civic responder pipeline for Pune.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Civic Desk Live • Pune Central Corridor
        </span>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0B2C47] border border-[#163A5E] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Pune Hazards</span>
            <Activity className="w-4 h-4 text-cyanGlow-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{hazards.length}</span>
            <span className="text-xs text-cyanGlow-400 font-bold">+2 verified today</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across Deccan, Shivajinagar & Kothrud</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B2C47] border border-red-500/30 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase">Critical Severity</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-red-400">
              {hazards.filter((h) => h.severity === 'Critical').length}
            </span>
            <span className="text-xs text-red-300 font-bold">Priority Triage</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Nal Stop manhole & FC Rd wire</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B2C47] border border-yellow-500/30 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-400 uppercase">Pending Verification</span>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-yellow-400">{countsByStage['Reported'] || 1}</span>
            <span className="text-xs text-yellow-300 font-bold">Needs Scouts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg response time: 3.8 mins</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B2C47] border border-emerald-500/30 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase">Resolved Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{countsByStage['Resolved'] || 3}</span>
            <span className="text-xs text-emerald-300 font-bold">Water Pumped</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Roadways restored to safe status</p>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Pune Hazard Lifecycle Progression</h3>
          </div>
          <button
            onClick={() => setLifecycleFilter('All')}
            className={`text-xs px-2.5 py-1 rounded-lg ${
              lifecycleFilter === 'All' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Show All ({hazards.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {lifecycleStages.map((stage, idx) => {
            const isSelected = lifecycleFilter === stage.id;
            const count = countsByStage[stage.id] || 0;
            return (
              <button
                key={stage.id}
                onClick={() => setLifecycleFilter(isSelected ? 'All' : stage.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected ? 'bg-[#113E63] border-cyanGlow-400 shadow-glow-cyan' : 'bg-[#071A2B] border-[#163A5E]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Step {idx + 1}</span>
                  <span className={`text-xs font-black px-2 py-0.2 rounded-full border ${stage.color}`}>{count}</span>
                </div>
                <span className="font-bold text-sm text-white block">{t(stage.labelKey, stage.label)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUEUE & PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-5 shadow-card flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#163A5E]">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter Pune incidents..."
                className="w-full bg-[#071A2B] border border-[#163A5E] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyanGlow-400"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Severity:</span>
              {['All', 'Critical', 'High', 'Medium'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${
                    severityFilter === sev
                      ? 'bg-cyanGlow-400/20 text-cyanGlow-400 font-bold border border-cyanGlow-400/40'
                      : 'text-slate-400'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 my-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected ? 'bg-[#113E63] border-cyanGlow-400' : 'bg-[#071A2B] border-[#163A5E]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-[#0B2C47] text-cyanGlow-400 border border-[#163A5E] mt-0.5">
                        <HazardIcon type={inc.type} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-cyanGlow-400 tracking-wider">
                          {inc.type.replace('_', ' ')} • {inc.severity}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-snug">{inc.title}</h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">{inc.locationName}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#0B2C47] border border-[#163A5E] text-slate-200">
                      {inc.lifecycle || 'Verified'}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#163A5E]/80 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[11px] text-slate-400">🛡️ {inc.verificationCount} verified</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateHazardLifecycle(inc.id, 'Verified', 'verified')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold"
                      >
                        ✓ Verify
                      </button>
                      <button
                        onClick={() => onUpdateHazardLifecycle(inc.id, 'In Progress', 'verified')}
                        className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold"
                      >
                        Dispatch Crew
                      </button>
                      <button
                        onClick={() => onUpdateHazardLifecycle(inc.id, 'Resolved', 'resolved')}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[11px] font-bold"
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Dossier & OSM Map */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {selectedIncident && (
            <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-5 shadow-card space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#163A5E]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pune Incident Dossier</span>
                  <h3 className="font-bold text-white text-sm">{selectedIncident.title}</h3>
                </div>
                <button
                  onClick={() => onSelectHazard(selectedIncident)}
                  className="px-2.5 py-1 rounded-lg bg-electric-500 text-white text-xs font-bold hover:bg-electric-600"
                >
                  Full Details →
                </button>
              </div>

              <div className="h-56 rounded-2xl overflow-hidden border border-[#163A5E] relative">
                <HazardMap
                  center={selectedIncident.coordinates}
                  zoom={15}
                  hazards={[selectedIncident]}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#071A2B] border border-[#163A5E]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Landmark</span>
                  <p className="text-white font-medium">{selectedIncident.locationName}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#071A2B] border border-[#163A5E]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Situation Report</span>
                  <p className="text-slate-200 text-xs">{selectedIncident.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
