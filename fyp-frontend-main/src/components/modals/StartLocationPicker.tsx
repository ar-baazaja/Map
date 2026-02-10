import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coordinate } from '@/types/navigation';

interface StartLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onPick: (coordinate: Coordinate) => void;
}

export function StartLocationPicker({ isOpen, onClose, onPick }: StartLocationPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const img = new Image();
    img.onload = () => setMapImage(img);
    img.src = '/maps/campus_map.png';
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas || !mapImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(10, 14, 20, 0.85)';
      ctx.fillRect(0, 0, w, h);

      const scale = Math.min(w / mapImage.width, h / mapImage.height) * 0.92;
      const drawW = mapImage.width * scale;
      const drawH = mapImage.height * scale;
      const dx = (w - drawW) / 2;
      const dy = (h - drawH) / 2;

      ctx.drawImage(mapImage, dx, dy, drawW, drawH);

      ctx.fillStyle = 'rgba(15, 25, 35, 0.9)';
      ctx.fillRect(16, 16, 260, 64);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 16, 260, 64);

      ctx.fillStyle = '#00E5FF';
      ctx.font = 'bold 16px Space Grotesk, sans-serif';
      ctx.fillText('Pick start point', 28, 42);

      ctx.fillStyle = 'rgba(0, 229, 255, 0.75)';
      ctx.font = '12px IBM Plex Sans, sans-serif';
      ctx.fillText('Tap on the map to set start', 28, 62);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isOpen, mapImage]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !mapImage) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;

    const scale = Math.min(w / mapImage.width, h / mapImage.height) * 0.92;
    const drawW = mapImage.width * scale;
    const drawH = mapImage.height * scale;
    const dx = (w - drawW) / 2;
    const dy = (h - drawH) / 2;

    const inMap = x >= dx && x <= dx + drawW && y >= dy && y <= dy + drawH;
    if (!inMap) return;

    const mapX = ((x - dx) / drawW) * mapImage.width;
    const mapY = ((y - dy) / drawH) * mapImage.height;

    onPick({ x: mapX, y: mapY });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onClick={handleClick}
          />

          <button
            onClick={onClose}
            className="absolute bottom-6 left-6 z-50 px-4 py-2 rounded-lg backdrop-blur-[20px] text-sm font-medium transition-all"
            style={{
              background: 'rgba(15, 25, 35, 0.9)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              color: '#00E5FF',
              boxShadow: '0 4px 20px rgba(0, 229, 255, 0.2)',
            }}
          >
            Cancel
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
