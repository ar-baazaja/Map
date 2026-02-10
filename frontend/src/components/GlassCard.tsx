import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GlassCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

export default function GlassCard({ icon: Icon, title, description, onClick, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 active:neon-glow-teal"
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#23C4B8] to-[#1a9d93] flex items-center justify-center flex-shrink-0"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#F4F6FB] mb-1">
            {title}
          </h3>
          <p className="text-xs text-[#F4F6FB]/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}