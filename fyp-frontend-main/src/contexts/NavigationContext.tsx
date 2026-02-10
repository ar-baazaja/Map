import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Coordinate, Destination, NavigationState } from '@/types/navigation';
import { calculateDistance } from '@/utils/navigation';
import { useLocalization } from './LocalizationContext';

interface NavigationContextType extends NavigationState {
  startNavigation: (destination: Destination, startOverride?: Coordinate) => void;
  stopNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const { currentPosition, startSimulation, stopSimulation, getDirectionsFromMIDAS } = useLocalization();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    currentDestination: null,
    currentWaypointIndex: 0,
    routeWaypoints: [],
    routeInstructions: [],
    distanceToWaypoint: 0,
    hasArrived: false,
  });

  const startNavigation = useCallback(async (destination: Destination, startOverride?: Coordinate) => {
    const start = startOverride ?? currentPosition;
    setNavigationState({
      isNavigating: true,
      currentDestination: destination,
      currentWaypointIndex: 0,
      routeWaypoints: [],
      routeInstructions: [],
      distanceToWaypoint: 0,
      hasArrived: false,
    });

    // Try to get directions from MIDAS backend
    try {
      const directions = await getDirectionsFromMIDAS(start, destination.coordinate, destination.nodeId);
      
      if (directions && Array.isArray(directions.path_coords) && directions.path_coords.length > 0) {
        const coords = directions.path_coords
          .filter((p: any) => typeof p?.x === 'number' && typeof p?.y === 'number')
          .map((p: any) => ({ x: p.x, y: p.y }));

        setNavigationState(prev => ({
          ...prev,
          routeWaypoints: coords,
          routeInstructions: Array.isArray(directions.instructions) ? directions.instructions : [],
        }));
      }
    } catch (error) {
      console.error('Failed to get MIDAS directions, using fallback:', error);
    }
  }, [currentPosition, getDirectionsFromMIDAS]);

  const stopNavigation = useCallback(() => {
    setNavigationState({
      isNavigating: false,
      currentDestination: null,
      currentWaypointIndex: 0,
      routeWaypoints: [],
      routeInstructions: [],
      distanceToWaypoint: 0,
      hasArrived: false,
    });
    stopSimulation();
  }, [stopSimulation]);

  // Update navigation state based on REAL position (no simulation)
  useEffect(() => {
    if (!navigationState.isNavigating || !navigationState.currentDestination) {
      return;
    }

    const { currentDestination, currentWaypointIndex, routeWaypoints } = navigationState;
    const waypoints = routeWaypoints.length > 0 ? routeWaypoints : currentDestination.waypoints;

    if (waypoints.length === 0) {
      return;
    }

    if (currentWaypointIndex >= waypoints.length) {
      // Arrived at destination
      setNavigationState(prev => ({
        ...prev,
        hasArrived: true,
        distanceToWaypoint: 0,
      }));
      return;
    }

    const currentWaypoint = waypoints[currentWaypointIndex];
    const distance = calculateDistance(currentPosition, currentWaypoint);

    setNavigationState(prev => ({
      ...prev,
      distanceToWaypoint: distance,
    }));

    // Check if reached current waypoint (within 3 units)
    if (distance < 3) {
      const nextIndex = currentWaypointIndex + 1;
      if (nextIndex >= waypoints.length) {
        // Reached final destination
        setNavigationState(prev => ({
          ...prev,
          hasArrived: true,
          currentWaypointIndex: nextIndex,
        }));
      } else {
        // Move to next waypoint
        setNavigationState(prev => ({
          ...prev,
          currentWaypointIndex: nextIndex,
        }));
      }
    }
  }, [currentPosition, navigationState.isNavigating, navigationState.currentDestination, navigationState.currentWaypointIndex]);

  return (
    <NavigationContext.Provider
      value={{
        ...navigationState,
        startNavigation,
        stopNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
