import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Gauge, ArrowDown, Navigation } from "lucide-react";
import LocationModal from "./LocationModal";
import { useNavigation } from "../contexts/NavigationContext";
import { destinations } from "../lib/api";

interface ARNavigationProps {
  onBack: () => void;
}

export default function ARNavigation({ onBack }: ARNavigationProps) {
  const [hasCamera, setHasCamera] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [selectedStart, setSelectedStart] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { 
    isNavigating, 
    currentPosition, 
    currentDestination, 
    routeWaypoints, 
    distanceToWaypoint, 
    hasArrived, 
    startNavigation, 
    stopNavigation, 
    updatePosition 
  } = useNavigation();

  useEffect(() => {
    // Request camera access
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use back camera on mobile
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setHasCamera(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasCamera(false);
      }
    };

    startCamera();

    // Cleanup
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isNavigating && routeWaypoints.length > 0) {
      // Simulate position updates along route
      const interval = setInterval(() => {
        // Simple simulation: move towards next waypoint
        const nextIndex = Math.min(routeWaypoints.length - 1, Math.floor(Math.random() * routeWaypoints.length));
        const nextWaypoint = routeWaypoints[nextIndex];
        
        // Add some noise to simulate real positioning
        const noisyPosition = {
          x: nextWaypoint.x + (Math.random() - 0.5) * 10,
          y: nextWaypoint.y + (Math.random() - 0.5) * 10
        };
        
        updatePosition(noisyPosition);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isNavigating, routeWaypoints, updatePosition]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: "#1E1B4B" }}>
      {/* Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Fallback if no camera */}
      {!hasCamera && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-60" />
      )}

      {/* AR Grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(35, 196, 184, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(35, 196, 184, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-4 left-4 z-50 glass-card rounded-full p-2.5 active:neon-glow-teal transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-[#23C4B8]" />
      </motion.button>

      {/* Top info panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 left-16 z-40"
      >
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#23C4B8]" />
              <div>
                <p className="text-[#F4F6FB]/70 text-[10px]">Destination</p>
                <p className="font-bold text-[#F4F6FB]">{currentDestination?.name || "Select destination"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#23C4B8]" />
              <div>
                <p className="text-[#F4F6FB]/70 text-[10px]">Accuracy</p>
                <p className="font-bold text-[#23C4B8]">{Math.round(distanceToWaypoint)}m</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Center bottom arrow - main navigation indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30">
        {/* Distance marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-full px-5 py-2 neon-glow-teal mb-4"
        >
          <p className="text-2xl font-bold text-[#23C4B8]">{Math.round(distanceToWaypoint)}m</p>
        </motion.div>

        {/* Animated arrow pointing direction */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#23C4B8] to-[#1a9d93] flex items-center justify-center neon-glow-teal">
            <ArrowDown className="w-8 h-8 text-white" />
          </div>
          
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#23C4B8]"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.8, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>

        {/* Direction text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 glass-card rounded-lg px-4 py-2"
        >
          <p className="text-sm font-bold text-[#F4F6FB] truncate">
            {hasArrived ? "You have arrived!" : "Follow the AR path to your destination"}
          </p>
        </motion.div>
      </div>

      {/* Floating Start Point button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowStartModal(true)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 glass-card rounded-full px-6 py-3 flex items-center gap-2 neon-glow-teal"
      >
        <Navigation className="w-4 h-4 text-white" />
        <span className="text-sm font-medium text-white">Start Point</span>
      </motion.button>

      {/* Destinations button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setShowDestinationModal(true)}
        className="absolute top-4 right-4 z-40 glass-card rounded-lg px-4 py-2 neon-glow-teal"
      >
        <MapPin className="w-4 h-4 text-white mr-2" />
        <span className="text-sm font-medium text-white">Destinations</span>
      </motion.button>

      {/* Voice guidance indicator */}
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-24 left-4 glass-card rounded-lg p-2.5 neon-glow-coral"
        >
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#FF6B6B] rounded-full"
                animate={{
                  height: ["6px", "18px", "6px"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Start Location Modal */}
      <LocationModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        title="Choose Start Point"
        onSelect={(locationName) => {
          setSelectedStart(locationName);
          const startDest = destinations.find(d => d.name === locationName);
          if (startDest && selectedDestination) {
            const dest = destinations.find(d => d.name === selectedDestination);
            if (dest) {
              startNavigation(dest, startDest.coordinate);
            }
          }
        }}
      />

      {/* Destination Modal */}
      <LocationModal
        isOpen={showDestinationModal}
        onClose={() => setShowDestinationModal(false)}
        title="Choose Destination"
        onSelect={(locationName) => {
          setSelectedDestination(locationName);
          const dest = destinations.find(d => d.name === locationName);
          if (dest && selectedStart) {
            const startDest = destinations.find(d => d.name === selectedStart);
            if (startDest) {
              startNavigation(dest, startDest.coordinate);
            }
          }
        }}
      />
    </div>
  );
}