import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '@/contexts/LocalizationContext';

export function TrackingIndicator() {
  const { localizationMode, isCapturing, captureConfidence } = useLocalization();

  const getStatusColor = () => {
    if (isCapturing) return '#FFB800';
    if (captureConfidence !== null && captureConfidence < 0.6) return '#FFB800';
    if (localizationMode === 'Backend CV') return '#00E5FF';
    return '#00FF88';
  };

  const statusColor = getStatusColor();

  return (
    <motion.div
      className="flex-1 flex justify-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="px-3 py-1.5 rounded-full backdrop-blur-[20px] flex items-center gap-2 max-w-[50vw]"
        style={{
          background: 'rgba(15, 25, 35, 0.9)',
          border: `1px solid ${statusColor}40`,
          boxShadow: `0 0 20px ${statusColor}40`,
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: statusColor }}
          animate={{
            boxShadow: [
              `0 0 8px ${statusColor}`,
              `0 0 16px ${statusColor}`,
              `0 0 8px ${statusColor}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span
          className="text-xs font-medium truncate"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            color: statusColor,
          }}
        >
          {isCapturing ? 'Capturing...' : localizationMode}
        </span>
        {captureConfidence !== null && (
          <span
            className="text-[10px] ml-1"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: captureConfidence >= 0.6 ? '#00FF88' : '#FFB800',
            }}
          >
            {(captureConfidence * 100).toFixed(0)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
