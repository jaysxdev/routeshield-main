// Types for Live Location GPS Tracking and Turn-by-Turn Navigation

export interface LiveLocationData {
  latitude: number;
  longitude: number;
  accuracy: number; // radius in meters
  heading: number | null; // 0 to 360 degrees clockwise from North
  speed: number | null; // meters per second
  timestamp: number;
}

export type GeolocationErrorCode =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'LOW_ACCURACY'
  | 'NOT_SUPPORTED';

export interface GeolocationErrorState {
  code: GeolocationErrorCode;
  message: string;
}

export interface NavigationProgressState {
  currentStepIndex: number;
  distanceToNextTurnMeters: number;
  remainingDistanceMeters: number;
  remainingDurationSeconds: number;
  isOffRoute: boolean;
  distanceToRouteMeters: number;
  isArrived: boolean;
  currentSpeedKmh: number | null;
}
