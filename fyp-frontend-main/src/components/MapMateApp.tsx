import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ARView } from '@/components/ar/ARView';
import { MapView } from '@/components/MapView';
import { DirectionArrow } from '@/components/ar/DirectionArrow';
import { DistanceLabel } from '@/components/ar/DistanceLabel';
import { TrackingIndicator } from '@/components/ar/TrackingIndicator';
import { CaptureButton } from '@/components/ar/CaptureButton';
import { CameraCapture } from '@/components/CameraCapture';
import { DebugOverlay } from '@/components/ar/DebugOverlay';
import { DestinationList } from '@/components/modals/DestinationList';
import { AboutScreen } from '@/components/modals/AboutScreen';
import { StartLocationList } from '@/components/modals/StartLocationList';
import { DestinationsButton } from '@/components/controls/DestinationsButton';
import { InfoButton } from '@/components/controls/InfoButton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { Coordinate, Destination } from '@/types/navigation';

// Inner component that can use the context
function MapMateAppContent() {
  const { currentPosition, localizationMode, captureAndLocalize, updatePosition, setLocalizationMode } = useLocalization();
  const { isNavigating, currentDestination, distanceToWaypoint, hasArrived, startNavigation, stopNavigation } = useNavigation();
  const [isDestinationListOpen, setIsDestinationListOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isStartLocationListOpen, setIsStartLocationListOpen] = useState(false);

  const handleCameraCapture = (imageData: string) => {
    console.log('Camera capture triggered');
    // Send image to backend for localization
    captureAndLocalize(imageData);
    setIsCameraOpen(false);
  };

  // Debug logging
  React.useEffect(() => {
    console.log('MapMateAppContent mounted');
    console.log('Environment:', import.meta.env);
  }, []);

  const handleStartLocationSelected = (startDestination: Destination) => {
    updatePosition(startDestination.coordinate);
    setLocalizationMode('Simulated');
    if (selectedDestination) {
      startNavigation(selectedDestination, startDestination.coordinate);
    }
  };

  const handleDestinationSelected = (destination: Destination) => {
    setSelectedDestination(destination);
    if (currentPosition.x !== 0 || currentPosition.y !== 0) {
      // If we already have a position, start navigation directly
      startNavigation(destination);
    }
  };

  React.useEffect(() => {
    if (isNavigating) {
      setShowMap(false);
    }
  }, [isNavigating]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A0E14]">
      {/* Camera always on; AR view as base layer */}
      <ARView />
      
      {/* Side map as secondary reference (shown when navigating) */}
      {isNavigating && (
        <div className="absolute top-0 right-0 w-1/3 h-full z-20">
          <MapView />
        </div>
      )}

      
      {/* Destinations button at top right */}
      {!isNavigating && (
        <div
          className="absolute top-0 right-0 z-30 px-3"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        >
          <DestinationsButton onClick={() => setIsDestinationListOpen(true)} />
        </div>
      )}

      {/* Floating Start Point button at bottom center */}
      {!isNavigating && (
        <button
          onClick={() => setIsStartLocationListOpen(true)}
          className="absolute z-30 px-4 py-3 rounded-full backdrop-blur-[20px] flex items-center gap-2 transition-all"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom) + 16px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 25, 35, 0.9)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            color: '#00E5FF',
            boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-medium">Start Point</span>
        </button>
      )}
      
      {/* Updated Capture Button */}
      <button
        onClick={() => setIsCameraOpen(true)}
        className="absolute z-30 w-14 h-14 sm:w-16 sm:h-16 rounded-full backdrop-blur-[20px] flex items-center justify-center transition-all"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + 16px)',
          right: '16px',
          background: 'rgba(15, 25, 35, 0.9)',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
        }}
      >
        <svg
          className="w-6 h-6 text-[#00E5FF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M23 19a2 2 0 0 1-2h-3a2 2 0 0 1-2 0 0V5a2 2 0 0 1 2h-3a2 2 0 0 1 2 0v14a2 2 0 0 1-2h-3a2 2 0 0 1-2z" />
        </svg>
      </button>

      {/* Destination List Modal */}
      <DestinationList
        isOpen={isDestinationListOpen}
        onClose={() => setIsDestinationListOpen(false)}
        onSelectDestination={(destination) => {
          console.log('Selected destination:', destination);
          handleDestinationSelected(destination);
        }}
      />

      <StartLocationList
        isOpen={isStartLocationListOpen}
        onClose={() => setIsStartLocationListOpen(false)}
        onSelectStartLocation={handleStartLocationSelected}
      />

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <CameraCapture
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <AboutScreen
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />
      )}

      {/* Distance Label */}
      <DistanceLabel />

      {/* Direction Arrow */}
      <DirectionArrow />

      {/* Debug Overlay */}
      <DebugOverlay />
    </div>
  );
}

export function MapMateApp() {
  return (
    <LocalizationProvider>
      <NavigationProvider>
        <MapMateAppContent />
      </NavigationProvider>
    </LocalizationProvider>
  );
}
