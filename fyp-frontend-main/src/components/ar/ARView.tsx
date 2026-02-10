import React, { useEffect, useRef, useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { MiniMap } from '@/components/ar/MiniMap';
import { Coordinate } from '@/types/navigation';

export function ARView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentPosition } = useLocalization();
  const { currentDestination, isNavigating, hasArrived, routeWaypoints } = useNavigation();
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (error) {
        console.error('Camera access denied:', error);
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw camera feed if active
      if (cameraActive && video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Apply navigation path mask if navigating
        if (isNavigating && routeWaypoints.length > 1) {
          drawNavigationPath(ctx, canvas, routeWaypoints);
        }
      } else {
        // Fallback to gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a2332');
        gradient.addColorStop(0.5, '#0f1923');
        gradient.addColorStop(1, '#0a0e14');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw "Arrived" message if at destination
      if (hasArrived) {
        drawArrivedMessage(ctx, canvas);
      }

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }, [cameraActive, currentPosition, currentDestination, isNavigating, hasArrived, routeWaypoints]);

  const drawArrivedMessage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw glowing background
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 30;

    ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
    ctx.fillRect(centerX - 150, centerY - 50, 300, 100);

    // Draw text
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00E5FF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Arrived', centerX, centerY);

    ctx.shadowBlur = 0;
  };

  const drawNavigationPath = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, waypoints: Coordinate[]) => {
    // Create a dark overlay outside the path corridor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw path corridor
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 80;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    waypoints.forEach((point, index) => {
      const x = (point.x / 1000) * canvas.width;
      const y = (point.y / 1000) * canvas.height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw path outline
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.restore();
  };

  return (
    <div className="relative w-full h-full">
      {/* Hidden video element for camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />
      
      {/* Canvas for AR overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />

      {isNavigating && currentDestination && (
        <div className="absolute top-20 right-6 z-30">
          <MiniMap />
        </div>
      )}
    </div>
  );
}
