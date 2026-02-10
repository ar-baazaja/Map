import { Destination } from '@/types/navigation';

// GIKI Campus local coordinates (matching backend coordinate system)
// These coordinates should align with your giki_graph.json nodes
export const destinations: Destination[] = [
  {
    id: 'fcse',
    name: 'Faculty of Computer Science & Engineering',
    building: 'FCSE',
    nodeId: 'N58',
    coordinate: { x: 894, y: 872 },
    waypoints: [{ x: 894, y: 872 }],
  },
  {
    id: 'library',
    name: 'Central Library',
    building: 'Library',
    nodeId: 'N64',
    coordinate: { x: 915, y: 637 },
    waypoints: [{ x: 915, y: 637 }],
  },
  {
    id: 'mechanical',
    name: 'Faculty of Mechanical Engineering',
    building: 'Mechanical',
    nodeId: 'N67',
    coordinate: { x: 1019, y: 847 },
    waypoints: [{ x: 1019, y: 847 }],
  },
  {
    id: 'admin',
    name: 'Admin Block',
    building: 'Admin',
    nodeId: 'N55',
    coordinate: { x: 926, y: 1010 },
    waypoints: [{ x: 926, y: 1010 }],
  },
  {
    id: 'acb',
    name: 'Academic Block',
    building: 'ACB',
    nodeId: 'N62',
    coordinate: { x: 859, y: 740 },
    waypoints: [{ x: 859, y: 740 }],
  },
];

export const defaultStartPosition = { x: 980, y: 1000 }; // Campus entrance/starting point (N56)
