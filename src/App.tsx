import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { DesignSystemModal } from './components/common/DesignSystemModal';
import { LiveNavigationOverlay } from './components/navigation/LiveNavigationOverlay';
import { Screen1LiveMap } from './screens/Screen1LiveMap';
import { Screen2PlanJourney } from './screens/Screen2PlanJourney';
import { Screen3RouteResult } from './screens/Screen3RouteResult';
import { Screen4ReportHazard } from './screens/Screen4ReportHazard';
import { Screen5HazardDetails } from './screens/Screen5HazardDetails';
import { Screen6EmergencyHelp } from './screens/Screen6EmergencyHelp';
import { Screen7AdminDashboard } from './screens/Screen7AdminDashboard';
import { PUNE_HAZARDS } from './data/puneData';
import { generateSafeRoute } from './services/routingService';
import {
  Hazard,
  RouteData,
  Coordinates,
  TravelMode,
  AccessibilityProfile,
  AvoidRules
} from './types/routeshield';

export function App() {
  const [activeScreen, setActiveScreen] = useState<string>('map');
  const [hazards, setHazards] = useState<Hazard[]>(PUNE_HAZARDS);
  const [selectedHazard, setSelectedHazard] = useState<Hazard>(PUNE_HAZARDS[0]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [userGPSCoords, setUserGPSCoords] = useState<Coordinates | null>(null);

  // Initialize a default computed route for Pune Station -> SPPU on startup
  useEffect(() => {
    generateSafeRoute({
      originCoords: [18.5284, 73.8739],
      destCoords: [18.5538, 73.8249],
      originName: 'Pune Railway Station',
      destName: 'Savitribai Phule Pune University',
      travelMode: 'Two-Wheeler',
      accessibilityProfile: 'Standard',
      allHazards: PUNE_HAZARDS
    }).then((res) => {
      setRouteData(res);
    });
  }, []);

  // Handle plan route submission from Screen 2
  const handleFindSafestRoute = async (params: {
    originCoords: Coordinates;
    destCoords: Coordinates;
    originName: string;
    destName: string;
    travelMode: TravelMode;
    accessibilityProfile: AccessibilityProfile;
    avoidRules: AvoidRules;
  }) => {
    setIsCalculatingRoute(true);
    try {
      const result = await generateSafeRoute({
        ...params,
        allHazards: hazards
      });
      setRouteData(result);
      setActiveScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error generating safe route:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Select a hazard to inspect
  const handleSelectHazard = (hazard: Hazard) => {
    setSelectedHazard(hazard);
    setActiveScreen('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new hazard reported from Screen 4
  const handleHazardCreated = (newHazard: Hazard) => {
    setHazards((prev) => [newHazard, ...prev]);
    setSelectedHazard(newHazard);
    setActiveScreen('map');
  };

  // Admin/Volunteer updates lifecycle
  const handleUpdateHazardLifecycle = (
    hazardId: string,
    newStage: Hazard['lifecycle'],
    newStatus: Hazard['status']
  ) => {
    setHazards((prev) =>
      prev.map((h) => {
        if (h.id === hazardId) {
          return {
            ...h,
            lifecycle: newStage,
            status: newStatus || h.status
          };
        }
        return h;
      })
    );
  };

  // Route around a hazard from Details page
  const handlePlanRouteWithHazard = (_hazard: Hazard) => {
    setActiveScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start live turn-by-turn navigation HUD
  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleExitNavigation = () => {
    setIsNavigating(false);
  };

  const handleRecalculate = () => {
    if (routeData) {
      setIsCalculatingRoute(true);
      generateSafeRoute({
        originCoords: userGPSCoords || routeData.origin.coordinates,
        destCoords: routeData.destination.coordinates,
        originName: 'Current Position (Pune GPS)',
        destName: routeData.destination.name,
        allHazards: hazards
      }).then((updated) => {
        setRouteData(updated);
        setIsCalculatingRoute(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-slate-100 flex flex-col font-sans selection:bg-cyanGlow-400 selection:text-navy-950 pb-16 md:pb-0">
      {/* Global Top Navbar */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        hazardsCount={hazards.length}
      />

      {/* Screen Switcher Body */}
      <main className="flex-1 flex flex-col">
        {activeScreen === 'map' && (
          <Screen1LiveMap
            hazards={hazards}
            onSelectHazard={handleSelectHazard}
            onPlanJourney={() => setActiveScreen('plan')}
            onReportHazard={() => setActiveScreen('report')}
            onEmergencyHelp={() => setActiveScreen('emergency')}
          />
        )}

        {activeScreen === 'plan' && (
          <Screen2PlanJourney
            hazards={hazards}
            onFindSafestRoute={handleFindSafestRoute}
            isCalculatingRoute={isCalculatingRoute}
          />
        )}

        {activeScreen === 'result' && routeData && (
          <Screen3RouteResult
            routeData={routeData}
            hazards={hazards}
            onSelectHazard={handleSelectHazard}
            onReportHazard={() => setActiveScreen('report')}
            onEmergencyHelp={() => setActiveScreen('emergency')}
            onReplan={() => setActiveScreen('plan')}
            onStartNavigation={handleStartNavigation}
            userGPSCoords={userGPSCoords}
          />
        )}

        {activeScreen === 'report' && (
          <Screen4ReportHazard
            onHazardCreated={handleHazardCreated}
            onCancel={() => setActiveScreen('map')}
          />
        )}

        {activeScreen === 'details' && (
          <Screen5HazardDetails
            hazard={selectedHazard}
            onBack={() => setActiveScreen('map')}
            onPlanRouteWithHazard={handlePlanRouteWithHazard}
            onEmergencyHelp={() => setActiveScreen('emergency')}
          />
        )}

        {activeScreen === 'emergency' && <Screen6EmergencyHelp />}

        {activeScreen === 'admin' && (
          <Screen7AdminDashboard
            hazards={hazards}
            onUpdateHazardLifecycle={handleUpdateHazardLifecycle}
            onSelectHazard={handleSelectHazard}
          />
        )}
      </main>

      {/* Live Turn-by-Turn Navigation HUD Overlay */}
      {isNavigating && routeData && (
        <LiveNavigationOverlay
          routeData={routeData}
          hazards={hazards}
          onExitNavigation={handleExitNavigation}
          onRecalculate={handleRecalculate}
          onEmergencyHelp={() => {
            setIsNavigating(false);
            setActiveScreen('emergency');
          }}
          onUpdateUserCoords={(coords) => setUserGPSCoords(coords)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {/* Design System Inspector Modal */}
      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />
    </div>
  );
}

export default App;
