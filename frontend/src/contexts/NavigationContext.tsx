import React, { createContext, useContext, useState, useCallback } from 'react';
import { Coordinate, Destination, NavigationResponse, getCurrentPosition, getNavigationRoute } from '../lib/api';

interface NavigationContextType {
  isNavigating: boolean;
  currentPosition: Coordinate;
  currentDestination: Destination | null;
  routeWaypoints: Coordinate[];
  distanceToWaypoint: number;
  hasArrived: boolean;
  startNavigation: (destination: Destination, startOverride?: Coordinate) => Promise<void>;
  stopNavigation: () => void;
  updatePosition: (position: Coordinate) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Coordinate>({ x: 0, y: 0 });
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [routeWaypoints, setRouteWaypoints] = useState<Coordinate[]>([]);
  const [distanceToWaypoint, setDistanceToWaypoint] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);

  const updatePosition = useCallback((position: Coordinate) => {
    setCurrentPosition(position);
    
    // Check if arrived at destination
    if (currentDestination && isNavigating) {
      const distance = Math.sqrt(
        Math.pow(position.x - currentDestination.coordinate.x, 2) +
        Math.pow(position.y - currentDestination.coordinate.y, 2)
      );
      
      if (distance < 20) { // Within 20 units = arrived
        setHasArrived(true);
        setIsNavigating(false);
      }
      
      setDistanceToWaypoint(distance);
    }
  }, [currentDestination, isNavigating]);

  const startNavigation = useCallback(async (destination: Destination, startOverride?: Coordinate) => {
    try {
      const startPos = startOverride || currentPosition;
      
      // Get route from backend
      const route: NavigationResponse = await getNavigationRoute(
        startPos.x === 0 && startPos.y === 0 ? 'N00' : 'N58', // Default or current node
        destination.nodeId || 'N64'
      );
      
      setCurrentDestination(destination);
      setRouteWaypoints(route.waypoints);
      setDistanceToWaypoint(route.distance);
      setHasArrived(false);
      setIsNavigating(true);
      
      // Update current position if start override provided
      if (startOverride) {
        setCurrentPosition(startOverride);
      }
    } catch (error) {
      console.error('Failed to start navigation:', error);
      // Fallback to dummy navigation
      setCurrentDestination(destination);
      setRouteWaypoints([startOverride || currentPosition, destination.coordinate]);
      setDistanceToWaypoint(45);
      setHasArrived(false);
      setIsNavigating(true);
    }
  }, [currentPosition]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setCurrentDestination(null);
    setRouteWaypoints([]);
    setDistanceToWaypoint(0);
    setHasArrived(false);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        currentPosition,
        currentDestination,
        routeWaypoints,
        distanceToWaypoint,
        hasArrived,
        startNavigation,
        stopNavigation,
        updatePosition,
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
