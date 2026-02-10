import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function HolographicAvatar() {
  return (
    <motion.div
      className="relative w-24 h-24 mx-auto mb-6"
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(35, 196, 184, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Avatar core */}
      <div className="relative w-full h-full rounded-full glass-card neon-glow-teal flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(35, 196, 184, 0.4), transparent)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Location Icon */}
        <MapPin className="relative z-10 w-10 h-10 text-[#23C4B8]" />
      </div>
      
      {/* Pulsing dots */}
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#23C4B8]"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "0 0",
          }}
          animate={{
            x: [0, Math.cos((angle * Math.PI) / 180) * 55],
            y: [0, Math.sin((angle * Math.PI) / 180) * 55],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}