import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Skiper 25 Compact Music Equalizer Button — React + Framer Motion
 * Adapted from Skiper UI (@skiper-ui/skiper25: Music toggle btn)
 * Compact micro-interaction audio toggle with animated jumping waveform bars.
 * Text-free, sleek, non-intrusive on cinematic video background.
 */

interface SkiperMusicToggleProps {
  isPlaying: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  className?: string;
}

export const SkiperMusicToggle: React.FC<SkiperMusicToggleProps> = ({
  isPlaying,
  onToggle,
  className,
}) => {
  const bars = 4;
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
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-1.5 h-8 px-2.5 sm:h-9 sm:px-3 rounded-full cursor-pointer select-none backdrop-blur-xl border transition-all duration-300 shadow-md",
        isPlaying
          ? "bg-black/65 border-[#D4AF37]/90 text-[#FFE082] shadow-[0_2px_16px_rgba(212,175,55,0.4)]"
          : "bg-black/45 border-white/25 text-white/85 hover:bg-black/65 hover:border-white/45 shadow-[0_2px_12px_rgba(0,0,0,0.5)]",
        className
      )}
      title={isPlaying ? "Mute Wedding Music" : "Play Wedding Music"}
      aria-label={isPlaying ? "Mute Wedding Music" : "Play Wedding Music"}
    >
      {/* Volume Icon */}
      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE082] animate-pulse shrink-0" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/75 shrink-0" />
      )}

      {/* Skiper 25 Mini Dynamic Equalizer Waveform (4 bars) */}
      <div className="flex h-[14px] items-center gap-[2px] px-0.5">
        {heights.map((height, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-[2px] rounded-full transition-colors duration-200",
              isPlaying
                ? "bg-gradient-to-t from-[#D4AF37] to-[#FFE082]"
                : "bg-white/40"
            )}
            animate={{
              height: isPlaying ? Math.max(3, height * 13) : 3,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 14,
            }}
          />
        ))}
      </div>
    </motion.button>
  );
};

export default SkiperMusicToggle;
