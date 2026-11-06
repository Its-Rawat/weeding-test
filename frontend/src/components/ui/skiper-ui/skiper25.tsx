import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Skiper 25 Music Toggle Component — React + Framer Motion
 * Adapted from Skiper UI (@skiper-ui/skiper25: Music toggle btn)
 * Features real-time animated equalizer soundbar visualization with tactile spring feedback.
 */

interface SkiperMusicToggleProps {
  isPlaying: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  className?: string;
  variant?: "floating" | "compact" | "pill";
}

export const SkiperMusicToggle: React.FC<SkiperMusicToggleProps> = ({
  isPlaying,
  onToggle,
  className,
  variant = "pill",
}) => {
  const bars = 5;
  const getRandomHeights = () =>
    Array.from({ length: bars }, () => Math.random() * 0.75 + 0.25);

  const [heights, setHeights] = useState<number[]>(Array(bars).fill(0.18));

  // Dynamic waveform equalizer animation driven by playback state
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setHeights(getRandomHeights());
      }, 110);
      return () => clearInterval(interval);
    } else {
      setHeights(Array(bars).fill(0.18));
    }
  }, [isPlaying]);

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.25, type: "spring", bounce: 0.4 }}
      className={cn(
        "group relative inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full cursor-pointer select-none backdrop-blur-xl border transition-all duration-300 shadow-lg",
        isPlaying
          ? "bg-black/60 border-[#D4AF37]/80 text-[#FFE082] shadow-[0_4px_22px_rgba(212,175,55,0.35)]"
          : "bg-black/45 border-white/20 text-white/90 hover:bg-black/65 hover:border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
        className
      )}
      title={isPlaying ? "Pause Wedding Music" : "Play Wedding Music"}
      aria-label={isPlaying ? "Pause Wedding Music" : "Play Wedding Music"}
    >
      {/* Icon */}
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-[#FFE082] animate-pulse shrink-0" />
      ) : (
        <VolumeX className="w-4 h-4 text-white/75 shrink-0" />
      )}

      {/* Skiper 25 Dynamic Animated Equalizer Waveform */}
      <div className="flex h-[16px] items-center gap-[2.5px] px-0.5">
        {heights.map((height, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-[2px] rounded-full transition-colors duration-300",
              isPlaying
                ? "bg-gradient-to-t from-[#D4AF37] to-[#FFE082]"
                : "bg-white/40"
            )}
            animate={{
              height: isPlaying ? Math.max(3, height * 15) : 3,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 12,
            }}
          />
        ))}
      </div>

      {/* Text Label */}
      <span
        className={cn(
          "text-[11px] font-serif font-medium tracking-wide transition-colors",
          isPlaying ? "text-[#FFF2B2]" : "text-white/90"
        )}
      >
        {isPlaying ? "Sound On 🔊" : "Tap for Sound 🔊"}
      </span>
    </motion.button>
  );
};

export default SkiperMusicToggle;
