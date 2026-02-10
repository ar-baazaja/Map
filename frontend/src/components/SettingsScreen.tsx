import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Bell, Palette, Info } from "lucide-react";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden p-4" style={{ background: "#1E1B4B" }}>
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(35, 196, 184, 0.2), transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="glass-card rounded-full p-2.5 active:neon-glow-teal transition-all mb-6"
      >
        <ArrowLeft className="w-5 h-5 text-[#23C4B8]" />
      </motion.button>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[#F4F6FB] mb-6"
        >
          Settings
        </motion.h1>

        <div className="space-y-3">
          {/* Voice Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#23C4B8] to-[#1a9d93] flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#F4F6FB]">Voice Guidance</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F4F6FB]/80">Enable voice commands</span>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F4F6FB]/80">Voice volume</span>
                  <span className="text-sm text-[#23C4B8] font-medium">80%</span>
                </div>
                <Slider defaultValue={[80]} max={100} step={1} className="w-full" />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#23C4B8] to-[#1a9d93] flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#F4F6FB]">Notifications</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F4F6FB]/80">Arrival notifications</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F4F6FB]/80">Turn-by-turn alerts</span>
                <Switch defaultChecked />
              </div>
            </div>
          </motion.div>

          {/* Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#23C4B8] to-[#1a9d93] flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#F4F6FB]">Display</h2>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F4F6FB]/80">AR arrow brightness</span>
                  <span className="text-sm text-[#23C4B8] font-medium">90%</span>
                </div>
                <Slider defaultValue={[90]} max={100} step={1} className="w-full" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F4F6FB]/80">Show distance markers</span>
                <Switch defaultChecked />
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#23C4B8] to-[#1a9d93] flex items-center justify-center">
                <Info className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#F4F6FB]">About</h2>
            </div>
            
            <div className="space-y-1 text-sm text-[#F4F6FB]/70">
              <p>MapMate v1.0.0</p>
              <p>AI-Powered AR Indoor Navigation</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}