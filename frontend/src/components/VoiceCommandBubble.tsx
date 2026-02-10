import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useState } from "react";

interface VoiceCommandBubbleProps {
  onActivate?: () => void;
}

export default function VoiceCommandBubble({ onActivate }: VoiceCommandBubbleProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    onActivate?.();
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
    >
      <motion.button
        onClick={handleClick}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive ? "neon-glow-coral" : ""
        }`}
        style={{
          background: isActive 
            ? "linear-gradient(135deg, rgba(255, 107, 107, 0.8), rgba(255, 107, 107, 0.6))"
            : "rgba(30, 27, 75, 0.65)",
          backdropFilter: "blur(12px)",
          border: `2px solid ${isActive ? "#FF6B6B" : "rgba(35, 196, 184, 0.3)"}`,
        }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? {
          boxShadow: [
            "0 0 20px rgba(255, 107, 107, 0.6)",
            "0 0 40px rgba(255, 107, 107, 0.8)",
            "0 0 20px rgba(255, 107, 107, 0.6)",
          ],
        } : {}}
        transition={isActive ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        } : {}}
      >
        <Mic className={`w-6 h-6 ${isActive ? "text-white" : "text-[#23C4B8]"}`} />
        
        {/* Sound waves animation */}
        {isActive && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-[#FF6B6B]"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{
                  scale: [1, 2, 2.5],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </motion.button>
      
      {/* Contextual prompt */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-16 top-1/2 -translate-y-1/2 glass-card rounded-lg px-3 py-2 whitespace-nowrap"
        >
          <p className="text-xs text-[#F4F6FB]">Listening...</p>
        </motion.div>
      )}
    </motion.div>
  );
}