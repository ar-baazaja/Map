import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { Destination } from '@/types/navigation';

interface StartLocationListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStartLocation: (destination: Destination) => void;
}

export function StartLocationList({ isOpen, onClose, onSelectStartLocation }: StartLocationListProps) {
  const handleSelectStartLocation = (destination: Destination) => {
    onSelectStartLocation(destination);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl backdrop-blur-[20px] overflow-hidden"
            style={{
              backgroundColor: 'rgba(15, 25, 35, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderBottom: 'none',
              height: '60vh',
            } as React.CSSProperties}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#00E5FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="text-2xl font-bold text-[#00E5FF]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Choose Start Point
                  </h2>
                  <p
                    className="mt-1 text-sm text-[#00E5FF]/60"
                    style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                  >
                    Select where your route should begin
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Destination List */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(60vh - 120px)' }}>
              <div className="space-y-2">
                {destinations.map((destination) => (
                  <motion.button
                    key={destination.id}
                    onClick={() => handleSelectStartLocation(destination)}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: 'rgba(15, 25, 35, 0.7)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)',
                    } as React.CSSProperties}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }}>
                        <MapPin className="w-5 h-5 text-[#00E5FF]" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-semibold text-white"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          {destination.name}
                        </h3>
                        <p
                          className="text-xs text-[#00E5FF]/60 mt-1"
                          style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                        >
                          {destination.building}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
