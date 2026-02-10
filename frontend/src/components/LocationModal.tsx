import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { destinations } from "../lib/api";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSelect: (location: string) => void;
}

export default function LocationModal({ isOpen, onClose, title, onSelect }: LocationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl glass-card overflow-hidden"
            style={{
              backgroundColor: "rgba(30, 27, 75, 0.95)",
              border: "1px solid rgba(35, 196, 184, 0.3)",
              borderBottom: "none",
              height: "60vh",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#23C4B8]/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#23C4B8]">{title}</h2>
                  <p className="mt-1 text-sm text-[#F4F6FB]/60">Select a location</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Location List */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(60vh - 120px)" }}>
              <div className="space-y-2">
                {destinations.map((destination) => (
                  <motion.button
                    key={destination.id}
                    onClick={() => {
                      onSelect(destination.name);
                      onClose();
                    }}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{
                      background: "rgba(15, 25, 35, 0.7)",
                      border: "1px solid rgba(35, 196, 184, 0.3)",
                      boxShadow: "0 0 20px rgba(35, 196, 184, 0.15)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(35, 196, 184, 0.1)" }}>
                        <MapPin className="w-5 h-5 text-[#23C4B8]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{destination.name}</h3>
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
