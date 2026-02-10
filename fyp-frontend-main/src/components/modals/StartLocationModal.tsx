import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseCurrent: () => void;
  onPickOnMap: () => void;
}

export function StartLocationModal({ isOpen, onClose, onUseCurrent, onPickOnMap }: StartLocationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl backdrop-blur-[20px] overflow-hidden"
            style={{
              backgroundColor: 'rgba(15, 25, 35, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderBottom: 'none',
              height: '36vh',
            } as React.CSSProperties}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="p-6 border-b border-[#00E5FF]/20">
              <h2
                className="text-2xl font-bold text-[#00E5FF]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Start location
              </h2>
              <p
                className="mt-2 text-sm text-[#00E5FF]/60"
                style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
              >
                Choose where your route should begin.
              </p>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={onUseCurrent}
                className="w-full p-4 rounded-xl text-left transition-all"
                style={{
                  background: 'rgba(15, 25, 35, 0.7)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)',
                }}
              >
                <div className="text-white font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Use current location
                </div>
                <div className="text-xs text-[#00E5FF]/60" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  Route will start from the location the app is tracking.
                </div>
              </button>

              <button
                onClick={onPickOnMap}
                className="w-full p-4 rounded-xl text-left transition-all"
                style={{
                  background: 'rgba(15, 25, 35, 0.7)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)',
                }}
              >
                <div className="text-white font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Pick start on map
                </div>
                <div className="text-xs text-[#00E5FF]/60" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  Tap on the campus map to set a custom start.
                </div>
              </button>

              <button
                onClick={onClose}
                className="w-full p-3 rounded-xl text-center transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
