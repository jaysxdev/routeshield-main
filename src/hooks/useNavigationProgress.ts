import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteData, Coordinates } from '../types/routeshield';
import { LiveLocationData, NavigationProgressState } from '../types/navigation';
import { calculateDistanceMeters, minDistanceToPolyline } from '../services/routingService';

interface UseNavigationProgressOptions {
  routeData: RouteData;
  liveLocation: LiveLocationData | null;
  offRouteThresholdMeters?: number; // default 85m
  stepAdvanceThresholdMeters?: number; // default 40m
}

export function useNavigationProgress({
  routeData,
  liveLocation,
  offRouteThresholdMeters = 85,
  stepAdvanceThresholdMeters = 40
}: UseNavigationProgressOptions) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const polyline = useMemo(() => {
    return routeData.safeRouteCoordinates.length > 0
      ? routeData.safeRouteCoordinates
      : routeData.defaultRouteCoordinates;
  }, [routeData]);

  const steps = routeData.steps;

  // Derive step coordinates along the polyline if not explicitly given
  const stepWaypoints = useMemo(() => {
    if (polyline.length === 0 || steps.length === 0) return [];
    
    // Distribute polyline points across steps to give each step a target waypoint
    return steps.map((step, idx) => {
      if (step.coordinates) return step.coordinates;
      const pointIndex = Math.min(
        polyline.length - 1,
        Math.floor((idx / Math.max(1, steps.length - 1)) * (polyline.length - 1))
      );
      return polyline[pointIndex];
    });
  }, [steps, polyline]);

  // Compute progress whenever liveLocation or polyline updates
  const progress: NavigationProgressState = useMemo(() => {
    if (!liveLocation || polyline.length === 0) {
      return {
        currentStepIndex,
        distanceToNextTurnMeters: steps[currentStepIndex]?.distanceMeters || 300,
        remainingDistanceMeters: routeData.distanceKm * 1000,
        remainingDurationSeconds: routeData.durationMins * 60,
        isOffRoute: false,
        distanceToRouteMeters: 0,
        isArrived: false,
        currentSpeedKmh: null
      };
    }

    const userCoords: Coordinates = [liveLocation.latitude, liveLocation.longitude];

    // 1. Calculate distance from user to route polyline
    const distToRoute = minDistanceToPolyline(userCoords, polyline);
    const isOff = distToRoute > offRouteThresholdMeters;

    // 2. Find nearest vertex index on polyline
    let nearestIdx = 0;
    let minVertexDist = Infinity;
    polyline.forEach((pt, idx) => {
      const d = calculateDistanceMeters(userCoords, pt);
      if (d < minVertexDist) {
        minVertexDist = d;
        nearestIdx = idx;
      }
    });

    // 3. Calculate remaining distance from nearest vertex to end of polyline
    let remDist = 0;
    for (let i = nearestIdx; i < polyline.length - 1; i++) {
      remDist += calculateDistanceMeters(polyline[i], polyline[i + 1]);
    }

    // Check if arrived at destination (within 40m of last coordinate)
    const destCoords = polyline[polyline.length - 1];
    const distToDest = calculateDistanceMeters(userCoords, destCoords);
    const isArrived = distToDest <= 40;

    // 4. Distance to next turn waypoint
    const currentWaypoint = stepWaypoints[currentStepIndex] || destCoords;
    const distToNextTurn = calculateDistanceMeters(userCoords, currentWaypoint);

    // 5. Remaining duration estimate (seconds)
    // If user has a speed from GPS (m/s), use it if valid (> 1 m/s), else fallback to route baseline pace
    let remSeconds = 0;
    if (liveLocation.speed && liveLocation.speed > 1.5) {
      remSeconds = Math.round(remDist / liveLocation.speed);
    } else {
      const pace = (routeData.durationMins * 60) / Math.max(1, routeData.distanceKm * 1000);
      remSeconds = Math.max(30, Math.round(remDist * pace));
    }

    // Convert speed to km/h if available
    const speedKmh =
      liveLocation.speed !== null && liveLocation.speed >= 0
        ? Math.round(liveLocation.speed * 3.6)
        : null;

    return {
      currentStepIndex,
      distanceToNextTurnMeters: Math.round(distToNextTurn),
      remainingDistanceMeters: Math.round(remDist),
      remainingDurationSeconds: remSeconds,
      isOffRoute: isOff,
      distanceToRouteMeters: Math.round(distToRoute),
      isArrived,
      currentSpeedKmh: speedKmh
    };
  }, [liveLocation, polyline, steps, stepWaypoints, currentStepIndex, offRouteThresholdMeters, routeData]);

  // Automatic step advancement:
  // When liveLocation is within 30-50m of the current waypoint, advance to the next step
  useEffect(() => {
    if (!liveLocation || stepWaypoints.length === 0) return;

    const userCoords: Coordinates = [liveLocation.latitude, liveLocation.longitude];
    const currentWaypoint = stepWaypoints[currentStepIndex];

    if (currentWaypoint) {
      const dist = calculateDistanceMeters(userCoords, currentWaypoint);
      if (dist <= stepAdvanceThresholdMeters && currentStepIndex < steps.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [liveLocation, currentStepIndex, stepWaypoints, stepAdvanceThresholdMeters, steps.length]);

  // Manual step controls
  const advanceStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const resetProgress = useCallback(() => {
    setCurrentStepIndex(0);
  }, []);

  return {
    ...progress,
    currentStep: steps[currentStepIndex] || steps[0],
    nextStep: steps[currentStepIndex + 1] || null,
    totalSteps: steps.length,
    advanceStep,
    prevStep,
    resetProgress,
    stepWaypoints
  };
}
