import React, { useEffect, useMemo, useRef } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { Coordinate } from '@/types/navigation';

export function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentPosition } = useLocalization();
  const { isNavigating, currentDestination, routeWaypoints } = useNavigation();

  const waypoints: Coordinate[] = useMemo(() => {
    if (routeWaypoints.length > 0) return routeWaypoints;
    if (currentDestination) return currentDestination.waypoints;
    return [];
  }, [routeWaypoints, currentDestination]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mapImage = new Image();
    mapImage.onload = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const scale = Math.max(w / mapImage.width, h / mapImage.height);
      const drawW = mapImage.width * scale;
      const drawH = mapImage.height * scale;
      const dx = (w - drawW) / 2;
      const dy = (h - drawH) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 12);
      ctx.clip();

      ctx.drawImage(mapImage, dx, dy, drawW, drawH);

      const toCanvas = (p: Coordinate) => {
        return {
          x: dx + (p.x / mapImage.width) * drawW,
          y: dy + (p.y / mapImage.height) * drawH,
        };
      };

      if (isNavigating && waypoints.length > 1) {
        ctx.beginPath();
        const first = toCanvas(waypoints[0]);
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < waypoints.length; i++) {
          const p = toCanvas(waypoints[i]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.95)';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      if (isNavigating && currentDestination) {
        const dest = toCanvas(currentDestination.coordinate);
        ctx.beginPath();
        ctx.arc(dest.x, dest.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF6B6B';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (currentPosition) {
        const cur = toCanvas(currentPosition);
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#00E5FF';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    };

    mapImage.src = '/maps/campus_map.png';
  }, [currentPosition, currentDestination, isNavigating, waypoints]);

  return (
    <canvas
      ref={canvasRef}
      width={170}
      height={170}
      className="backdrop-blur-[20px]"
      style={{
        background: 'rgba(15, 25, 35, 0.85)',
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
      }}
    />
  );
}
