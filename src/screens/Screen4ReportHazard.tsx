import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Droplets,
  Cone,
  OctagonAlert,
  CircleDotDashed,
  Trees,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HazardMap } from '../components/map/HazardMap';
import { Coordinates, Hazard, HazardType } from '../types/routeshield';
import confetti from 'canvas-confetti';

interface Screen4ReportHazardProps {
  onHazardCreated?: (newHazard: Hazard) => void;
  onCancel: () => void;
}

export function Screen4ReportHazard({ onHazardCreated, onCancel }: Screen4ReportHazardProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [hazardType, setHazardType] = useState<HazardType>('waterlogging');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80');
  const [aiDetectedType] = useState<HazardType>('waterlogging');
  const [aiConfidence] = useState(88);
  const [aiAccepted, setAiAccepted] = useState(true);

  const [pinCoordinates, setPinCoordinates] = useState<Coordinates>([18.5167, 73.8417]); // JM Road Deccan
  const [locationName, setLocationName] = useState('JM Road near Deccan Gymkhana, Pune');
  
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'Medium' | 'High' | 'Critical'>('High');
  const [severityLabel, setSeverityLabel] = useState('Knee-level water near pedestrian crossing');
  const [affectedModes, setAffectedModes] = useState<string[]>(['Walk', 'Two-Wheeler', 'Wheelchair User']);
  const [description, setDescription] = useState('Heavy monsoon accumulation near Deccan bus stand. Water rising quickly.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSelectType = (typeKey: HazardType) => {
    setHazardType(typeKey);
    if (typeKey !== aiDetectedType) {
      setAiAccepted(false);
    }
  };

  const toggleMode = (mode: string) => {
    setAffectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newHazard: Hazard = {
        id: `pune-hz-${Date.now()}`,
        type: hazardType,
        title: `${hazardType.replace('_', ' ').toUpperCase()} reported at ${locationName.split(',')[0]}`,
        locationName: locationName,
        coordinates: pinCoordinates,
        severity: severity,
        severityLabel: severityLabel,
        reportedTime: 'Just now',
        timestamp: new Date().toISOString(),
        status: 'unverified',
        verificationCount: 1,
        disputeCount: 0,
        description: description,
        imageUrl: photoPreview,
        affectedModes: affectedModes,
        recommendedAction: 'Caution advised. Community scout verification in progress.',
        lifecycle: 'Reported',
        reportedBy: 'You (Pune RouteShield Scout)',
        radiusMeters: 140
      };

      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      if (onHazardCreated) {
        onHazardCreated(newHazard);
      }
    }, 900);
  };

  const steps = [
    { num: 1, title: 'Hazard Type' },
    { num: 2, title: 'Photo & AI' },
    { num: 3, title: 'Pin Location' },
    { num: 4, title: 'Severity & Impact' },
    { num: 5, title: 'Confirm & Submit' }
  ];

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-glow-safe">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Poppins']">
          Pune Hazard Report Broadcasted!
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for protecting fellow commuters in Pune. Your report is now live on the RouteShield network and flagged for community verification.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl bg-electric-500 text-white font-bold text-sm shadow-glow-electric hover:bg-electric-600 transition-all"
          >
            Return to Pune Map →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pune Scout Reporting Desk</span>
          </div>
          <button onClick={onCancel} className="text-xs text-slate-400 hover:text-white">
            {t('report.cancel', 'Cancel')}
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Poppins']">
          {t('report.title', 'Report an Urban Hazard in Pune')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {t('report.subtitle', 'Crowd reports empower real-time road avoidance. All entries labeled Prototype / Demo Data.')}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-[#0B2C47] border border-[#163A5E] rounded-2xl p-4 mb-6 shadow-card">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-cyanGlow-400 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = step.num < currentStep;
            const isCurrent = step.num === currentStep;
            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-cyanGlow-400 text-navy-950 shadow-glow-cyan'
                      : isCurrent
                      ? 'bg-electric-500 text-white border-2 border-white shadow-glow-electric scale-110'
                      : 'bg-[#071A2B] border border-[#163A5E] text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </div>
                <span className={`text-[10px] mt-1 font-semibold hidden sm:block ${isCurrent ? 'text-cyanGlow-400 font-bold' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Body */}
      <div className="bg-[#0B2C47] border border-[#163A5E] rounded-3xl p-6 sm:p-8 shadow-card">
        {/* STEP 1: HAZARD TYPE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Step 1: Choose Hazard Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { id: 'waterlogging', title: 'Waterlogging & Flood', desc: 'Murky pools, flooded subways', icon: Droplets, color: '#24D6E8' },
                { id: 'accident', title: 'Road Accident', desc: 'Vehicular collision or lane blockage', icon: AlertTriangle, color: '#EF4444' },
                { id: 'construction', title: 'Metro / Road Work', desc: 'Barricades, trenches, lane closure', icon: Cone, color: '#F97316' },
                { id: 'closure', title: 'Road Closure / Diverted', desc: 'Police blockade, culvert shut', icon: OctagonAlert, color: '#DC2626' },
                { id: 'manhole', title: 'Open Manhole / Drain', desc: 'Submerged drain cover missing', icon: CircleDotDashed, color: '#FACC15' },
                { id: 'tree_fall', title: 'Fallen Tree / Heavy Bough', desc: 'Blocking roadway or footpath', icon: Trees, color: '#22C55E' },
                { id: 'electrical', title: 'Electrical / Snapped Wire', desc: 'Live cable touching water or sparks', icon: Zap, color: '#EAB308' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = hazardType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectType(item.id as HazardType)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#113E63] border-cyanGlow-400 text-white shadow-glow-cyan'
                        : 'bg-[#071A2B] border-[#163A5E] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}22`, color: item.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-cyanGlow-400 text-navy-950 font-black text-xs flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold block text-white">{item.title}</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">{item.desc}</span>
                  </button>
                );
              })}
            </div>

            {hazardType === 'accident' && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-xs text-red-200 flex items-start gap-3 mt-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Emergency Protocol Reminder:</span>
                  <span>Do not obstruct emergency responders or photograph injured people. Respect privacy and emergency dispatch lanes.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PHOTO & AI */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white">Step 2: Add Photo Evidence & AI Assist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-[#163A5E] bg-[#071A2B] h-60 flex items-center justify-center">
                <img src={photoPreview} alt="Hazard preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs text-slate-200 font-medium bg-[#071A2B]/80 px-2 py-1 rounded">
                    📸 Simulated Pune Camera Capture
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-3">
                <button
                  type="button"
                  onClick={() => setPhotoPreview('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80')}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-electric-500 text-white font-bold text-xs hover:bg-electric-600 transition-all shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Use Simulated Phone Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoPreview('https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80')}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#113E63] border border-[#163A5E] text-slate-200 font-bold text-xs hover:bg-[#1A5383] transition-all"
                >
                  <Upload className="w-4 h-4 text-cyanGlow-400" />
                  <span>Upload from Gallery</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  Privacy safeguard: Number plates and faces are automatically masked on public reports.
                </p>
              </div>
            </div>

            {/* AI Suggestion Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purpleAccent-500/20 via-electric-500/10 to-[#071A2B] border border-purpleAccent-500/40">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purpleAccent-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-cyanGlow-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold text-cyanGlow-400 tracking-wider">
                      RouteShield AI Model v2.4
                    </span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.2 rounded-full font-bold border border-purple-500/30">
                      {aiConfidence}% Confidence
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mt-1">
                    AI detected: <span className="text-cyanGlow-400">Waterlogged Road — 88% confidence</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-purpleAccent-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Is this AI classification correct?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setHazardType('waterlogging'); setAiAccepted(true); }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      aiAccepted ? 'bg-cyanGlow-400 text-navy-950 font-black' : 'bg-[#071A2B] text-slate-300'
                    }`}
                  >
                    ✓ Yes, Waterlogged
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAiAccepted(false); setCurrentStep(1); }}
                    className="px-3 py-1.5 rounded-lg bg-[#071A2B] hover:bg-[#113E63] text-slate-300 border border-[#163A5E]"
                  >
                    Change Type
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PIN LOCATION ON PUNE MAP */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Step 3: Confirm Exact Pune Map Location</h2>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Street / Landmark Name
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyanGlow-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#071A2B] border border-[#163A5E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-cyanGlow-400"
                />
              </div>
            </div>

            <div className="h-72 rounded-2xl overflow-hidden relative border border-[#163A5E]">
              <HazardMap
                center={pinCoordinates}
                zoom={15}
                draggablePin={true}
                onPinDrag={(coords) => setPinCoordinates(coords)}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* STEP 4: SEVERITY & IMPACT */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white">Step 4: Severity & Affected Commuter Modes</h2>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Hazard Severity Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'Low', label: 'Low', desc: 'Passable with caution' },
                  { id: 'Moderate', label: 'Moderate', desc: 'Noticeable delay' },
                  { id: 'High', label: 'High', desc: 'Severe water / 1 lane blocked' },
                  { id: 'Critical', label: 'Critical', desc: 'Impassable / Live hazard' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSeverity(s.id as any);
                      setSeverityLabel(`${s.id} Pune Road Impact`);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      severity === s.id
                        ? 'bg-[#113E63] border-cyanGlow-400 font-bold'
                        : 'bg-[#071A2B] border-[#163A5E] text-slate-400'
                    }`}
                  >
                    <span className="text-sm font-black block text-white">{s.label}</span>
                    <span className="text-[10px] text-slate-400">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Affected Commuters
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Walk', 'Two-Wheeler', 'Car', 'Bicycle', 'Senior Citizen', 'Wheelchair User'].map((m) => {
                  const active = affectedModes.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMode(m)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        active ? 'bg-[#113E63] border-cyanGlow-400 text-white' : 'bg-[#071A2B] border-[#163A5E] text-slate-400'
                      }`}
                    >
                      <span>{m}</span>
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${active ? 'bg-cyanGlow-400 text-navy-950' : 'bg-slate-800'}`}>
                        {active ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DESCRIPTION & SUBMIT */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Step 5: Review & Submit Pune Report</h2>
            <div className="p-4 rounded-2xl bg-[#071A2B] border border-[#163A5E] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Type</span>
                <span className="font-extrabold text-cyanGlow-400 text-sm capitalize">{hazardType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Severity</span>
                <span className="font-extrabold text-orange-400 text-sm">{severity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Location</span>
                <span className="font-bold text-white truncate block">{locationName.split(',')[0]}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">City</span>
                <span className="font-bold text-emerald-400">Pune, Maharashtra</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Ground Situation
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g. ankle to knee level water near junction, bypass via side lane is clear..."
                className="w-full bg-[#071A2B] border border-[#163A5E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyanGlow-400"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-purpleAccent-500/10 border border-purpleAccent-500/30 text-xs text-slate-300 flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                By broadcasting this alert, you earn <strong>+25 Pune Safety Scout Points</strong>.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-8 pt-4 border-t border-[#163A5E] flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentStep === 1 ? 'opacity-40 cursor-not-allowed text-slate-500' : 'bg-[#071A2B] hover:bg-[#113E63] text-slate-300 border border-[#163A5E]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric-500 to-cyanGlow-400 text-navy-950 font-black text-xs shadow-glow-cyan hover:opacity-95 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white font-black text-sm shadow-lg shadow-orange-500/30 hover:opacity-95 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast Pune Hazard Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
