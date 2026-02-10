const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export interface Coordinate {
  x: number;
  y: number;
}

export interface Destination {
  id: string;
  name: string;
  building: string;
  nodeId?: string;
  coordinate: Coordinate;
  waypoints: Coordinate[];
}

export interface NavigationResponse {
  waypoints: Coordinate[];
  instructions: string[];
  distance: number;
}

// Get current position from backend
export async function getCurrentPosition(): Promise<Coordinate> {
  const response = await fetch(`${API_BASE}/localize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: null }) // Placeholder - would need real image
  });
  
  if (!response.ok) throw new Error('Failed to get position');
  const data = await response.json();
  return { x: data.x, y: data.y };
}

// Get navigation route from backend
export async function getNavigationRoute(
  startNode: string,
  destinationNode: string
): Promise<NavigationResponse> {
  const response = await fetch(`${API_BASE}/navigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start_node: startNode, destination_node: destinationNode })
  });
  
  if (!response.ok) throw new Error('Failed to get route');
  return response.json();
}

// Get available destinations
export const destinations: Destination[] = [
  { id: 'fcse', name: 'Faculty of Computer Science & Engineering', building: 'FCSE', nodeId: 'N58', coordinate: { x: 894, y: 872 }, waypoints: [{ x: 894, y: 872 }] },
  { id: 'library', name: 'Central Library', building: 'Library', nodeId: 'N64', coordinate: { x: 915, y: 637 }, waypoints: [{ x: 915, y: 637 }] },
  { id: 'cafeteria', name: 'Cafeteria', building: 'Cafeteria', nodeId: 'N72', coordinate: { x: 756, y: 834 }, waypoints: [{ x: 756, y: 834 }] },
  { id: 'parking_a', name: 'Parking Lot A', building: 'Parking', nodeId: 'N01', coordinate: { x: 123, y: 456 }, waypoints: [{ x: 123, y: 456 }] },
  { id: 'parking_b', name: 'Parking Lot B', building: 'Parking', nodeId: 'N02', coordinate: { x: 234, y: 567 }, waypoints: [{ x: 234, y: 567 }] },
  { id: 'entrance', name: 'Main Entrance', building: 'Entrance', nodeId: 'N00', coordinate: { x: 0, y: 0 }, waypoints: [{ x: 0, y: 0 }] },
];
