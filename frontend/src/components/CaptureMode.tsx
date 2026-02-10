import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera as CameraIcon, Image as ImageIcon, CheckCircle } from "lucide-react";

interface CaptureModeProps {
  onBack: () => void;
}

export default function CaptureMode({ onBack }: CaptureModeProps) {
  const [capturedImages, setCapturedImages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = () => {
    if (capturedImages.length < 12) {
      setCapturedImages([...capturedImages, Date.now()]);
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onBack();
    }, 3000);
  };

  const progress = (capturedImages.length / 12) * 100;

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: "#1E1B4B" }}>
      {/* Mock camera feed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-50" />
      
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-4 left-4 z-50 glass-card rounded-full p-2.5 active:neon-glow-teal transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-[#23C4B8]" />
      </motion.button>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between p-4 pt-16 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-[#F4F6FB] mb-1">Environment Capture</h2>
          <p className="text-sm text-[#F4F6FB]/70">Capture {12 - capturedImages.length} more photos</p>
        </motion.div>

        {/* Grid preview */}
        <div className="grid grid-cols-4 gap-2 max-w-xs w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`aspect-square rounded-lg ${
                i < capturedImages.length
                  ? "glass-card neon-glow-teal"
                  : "bg-white/10 border border-white/20"
              } flex items-center justify-center`}
            >
              {i < capturedImages.length && (
                <CheckCircle className="w-5 h-5 text-[#23C4B8]" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Camera controls */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {/* Progress ring */}
          <div className="relative">
            <svg className="w-28 h-28 -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                stroke="#23C4B8"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 301" }}
                animate={{ strokeDasharray: `${(progress / 100) * 301} 301` }}
                transition={{ duration: 0.5 }}
                style={{ filter: "drop-shadow(0 0 8px rgba(35, 196, 184, 0.6))" }}
              />
            </svg>
            
            {/* Camera button */}
            <motion.button
              onClick={handleCapture}
              disabled={capturedImages.length >= 12}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#23C4B8] to-[#1a9d93] flex items-center justify-center neon-glow-teal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CameraIcon className="w-8 h-8 text-white" />
            </motion.button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex-1 glass-card rounded-lg py-3 px-4 flex items-center justify-center gap-2 active:neon-glow-teal transition-all"
            >
              <ImageIcon className="w-4 h-4 text-[#23C4B8]" />
              <span className="text-sm text-[#F4F6FB] font-medium">Import</span>
            </motion.button>

            {capturedImages.length >= 8 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 rounded-lg py-3 px-4 bg-gradient-to-r from-[#23C4B8] to-[#1a9d93] neon-glow-teal disabled:opacity-50"
              >
                <span className="text-sm text-white font-bold">
                  {isProcessing ? "Processing..." : "Generate Map"}
                </span>
              </motion.button>
            )}
          </div>

          {/* Resolution guidance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-lg px-3 py-2"
          >
            <p className="text-xs text-[#F4F6FB]/70 text-center">
              💡 Capture from multiple angles for best results
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}