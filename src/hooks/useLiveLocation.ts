import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LiveLocationData, GeolocationErrorState } from '../types/navigation';
import { Coordinates } from '../types/routeshield';

interface UseLiveLocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  initialCoords?: Coordinates;
}

export function useLiveLocation(options: UseLiveLocationOptions = {}) {
  const { t } = useTranslation();
  const {
    enableHighAccuracy = true,
    maximumAge = 3000,
    timeout = 10000,
    initialCoords
  } = options;

  const [location, setLocation] = useState<LiveLocationData | null>(() => {
    if (initialCoords) {
      return {
        latitude: initialCoords[0],
        longitude: initialCoords[1],
        accuracy: 15,
        heading: null,
        speed: null,
        timestamp: Date.now()
      };
    }
    return null;
  });

  const [error, setError] = useState<GeolocationErrorState | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  // Stop watching location and clean up
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  // Start watching location with high accuracy
  const startTracking = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError({
        code: 'NOT_SUPPORTED',
        message: t('errors.unsupported', 'Your browser does not support live location tracking.')
      });
      return;
    }

    // Clear any existing watcher first
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setError(null);
    setIsTracking(true);

    try {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, heading, speed } = position.coords;

          // Check if accuracy is low (> 100 meters)
          if (accuracy > 100) {
            setError({
              code: 'LOW_ACCURACY',
              message: t('errors.lowAccuracy', 'Your location accuracy is low. Wait for a clearer GPS signal.')
            });
          } else {
            setError(null);
          }

          setLocation({
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            heading: typeof heading === 'number' && !isNaN(heading) ? heading : null,
            speed: typeof speed === 'number' && !isNaN(speed) ? speed : null,
            timestamp: position.timestamp || Date.now()
          });
        },
        (geoErr) => {
          let code: GeolocationErrorState['code'] = 'POSITION_UNAVAILABLE';
          let message = t('errors.positionUnavailable', 'Unable to determine your location. Check GPS and internet connection.');

          switch (geoErr.code) {
            case geoErr.PERMISSION_DENIED:
              code = 'PERMISSION_DENIED';
              message = t('errors.permissionDenied', 'Location permission is required for live navigation. You can still explore routes manually.');
              break;
            case geoErr.TIMEOUT:
              code = 'TIMEOUT';
              message = t('errors.timeout', 'Location request timed out. Please try again.');
              break;
            case geoErr.POSITION_UNAVAILABLE:
            default:
              code = 'POSITION_UNAVAILABLE';
              message = t('errors.positionUnavailable', 'Unable to determine your location. Check GPS and internet connection.');
              break;
          }

          setError({ code, message });
        },
        {
          enableHighAccuracy,
          maximumAge,
          timeout
        }
      );

      watchIdRef.current = id;
    } catch {
      setError({
        code: 'NOT_SUPPORTED',
        message: t('errors.unsupported', 'Your browser does not support live location tracking.')
      });
    }
  }, [enableHighAccuracy, maximumAge, timeout, t]);

  // Manually update location (used for simulated motion or recalculations)
  const setSimulatedLocation = useCallback((coords: Coordinates, heading: number | null = null, speed: number | null = 6.94) => {
    setLocation({
      latitude: coords[0],
      longitude: coords[1],
      accuracy: 12,
      heading,
      speed,
      timestamp: Date.now()
    });
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return {
    location,
    error,
    isTracking,
    startTracking,
    stopTracking,
    setSimulatedLocation,
    clearError: () => setError(null)
  };
}
