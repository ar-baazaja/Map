import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Navigation, Settings } from "lucide-react";
import HolographicAvatar from "./HolographicAvatar";
import GlassCard from "./GlassCard";
import VoiceCommandBubble from "./VoiceCommandBubble";
import CaptureMode from "./CaptureMode";
import ARNavigation from "./ARNavigation";
import SettingsScreen from "./SettingsScreen";

type Screen = "home" | "capture" | "navigation" | "settings";

function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "capture":
        return <CaptureMode onBack={() => setCurrentScreen("home")} />;
      case "navigation":
        return <ARNavigation onBack={() => setCurrentScreen("home")} />;
      case "settings":
        return <SettingsScreen onBack={() => setCurrentScreen("home")} />;
      default:
        return (
          <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(35, 196, 184, 0.15), transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10 w-full max-w-sm">
              {/* Header with Avatar */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <HolographicAvatar />
                <h1 className="text-4xl font-bold text-[#F4F6FB] mb-2 tracking-tight">
                  MapMate
                </h1>
                <p className="text-sm text-[#F4F6FB]/70">
                  AI-Powered AR Indoor Navigation
                </p>
              </motion.div>

              {/* Navigation Cards */}
              <div className="space-y-4 mb-8">
                <GlassCard
                  icon={Camera}
                  title="Environment Capture"
                  description="Scan your surroundings to create a 3D map"
                  onClick={() => setCurrentScreen("capture")}
                  delay={0.2}
                />
                <GlassCard
                  icon={Navigation}
                  title="AR Navigation"
                  description="Navigate with real-time AR pathfinding"
                  onClick={() => setCurrentScreen("navigation")}
                  delay={0.4}
                />
                <GlassCard
                  icon={Settings}
                  title="Settings"
                  description="Customize your navigation experience"
                  onClick={() => setCurrentScreen("settings")}
                  delay={0.6}
                />
              </div>
            </div>

            {/* Voice Command Bubble */}
            <VoiceCommandBubble />
          </div>
        );
    }
  };

  return (
    <div 
      className="w-screen h-screen"
      style={{ background: "#1E1B4B" }}
    >
      {renderScreen()}
    </div>
  );
}

export default Home;