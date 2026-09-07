// TypeScript Definitions for RouteShield Pune Road Safety Platform

export type Coordinates = [number, number]; // [latitude, longitude]

export type HazardType =
  | 'waterlogging'
  | 'accident'
  | 'construction'
  | 'closure'
  | 'manhole'
  | 'tree_fall'
  | 'electrical';

export type HazardSeverity = 'Low' | 'Moderate' | 'Medium' | 'High' | 'Critical';

export type HazardStatus = 'unverified' | 'verified' | 'resolved';

export interface Hazard {
  id: string;
  type: HazardType;
  title: string;
  locationName: string;
  coordinates: Coordinates;
  severity: HazardSeverity;
  severityLabel: string;
  status: HazardStatus;
  verificationCount: number;
  disputeCount: number;
  description: string;
  imageUrl: string;
  affectedModes: string[];
  recommendedAction: string;
  lifecycle: 'Reported' | 'Verified' | 'Prioritised' | 'In Progress' | 'Resolved';
  reportedBy: string;
  reportedTime: string;
  timestamp: string;
  radiusMeters?: number;
}

export type TravelMode = 'Car' | 'Two-Wheeler' | 'Walk' | 'Bicycle' | 'Wheelchair';

export type AccessibilityProfile = 'Standard' | 'Senior Citizen' | 'Wheelchair User' | 'Parent with Child';

export interface AvoidRules {
  waterlogging: boolean;
  accidents: boolean;
  construction: boolean;
  roadClosures: boolean;
  stairs: boolean;
}

export type TurnType =
  | 'straight'
  | 'left'
  | 'right'
  | 'slight-left'
  | 'slight-right'
  | 'roundabout'
  | 'u-turn'
  | 'arrive';

export interface RouteStep {
  id: number;
  instruction: string;
  roadName: string;
  distanceMeters: number;
  durationSeconds: number;
  type: TurnType;
  caution?: string;
  coordinates?: Coordinates;
}

export type SafetyRecommendation =
  | 'GO'
  | 'GO WITH CAUTION'
  | 'USE ALTERNATE ROUTE'
  | 'DELAY TRAVEL'
  | 'AVOID TRAVEL';

export interface RouteHazardImpact {
  hazard: Hazard;
  distanceMeters: number;
  penalty: number;
}

export interface RouteData {
  origin: {
    name: string;
    coordinates: Coordinates;
  };
  destination: {
    name: string;
    coordinates: Coordinates;
  };
  defaultRouteCoordinates: Coordinates[]; // Risky/Standard route
  safeRouteCoordinates: Coordinates[];    // Recommended safe alternate route
  distanceKm: number;
  durationMins: number;
  delayMins: number;
  riskScore: number;                      // 0 to 100
  recommendation: SafetyRecommendation;
  explanation: string;
  steps: RouteStep[];
  nearbyHazards: RouteHazardImpact[];
  safetyAdvantage: string;
  isOrsLive?: boolean;
}

export interface PlaceSuggestion {
  name: string;
  coordinates: Coordinates;
  type: string;
}
