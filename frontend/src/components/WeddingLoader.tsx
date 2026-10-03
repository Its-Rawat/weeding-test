import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeddingLoaderProps {
  progress?: number;
  message?: string;
}

// 4 morphing SVG paths with matching Bézier segment structures for buttery smooth SVG morphing
// Phase 1: Calligraphic 'C' (Chandrika)
const PATH_C =
  "M 74,26 C 58,16 38,18 28,30 C 18,42 18,58 28,70 C 38,82 58,84 74,74 C 68,68 58,74 44,70 C 32,64 30,52 44,46";
// Phase 2: Sacred Knot / Union Symbol '♡ / ✕'
const PATH_KNOT =
  "M 50,32 C 40,16 22,22 22,38 C 22,54 38,68 50,82 C 62,68 78,54 78,38 C 78,22 60,16 50,32 C 44,44 56,44 50,56";
// Phase 3: Calligraphic 'X' (Xudong)
const PATH_X =
  "M 26,26 C 42,42 46,46 50,50 C 54,54 58,58 74,74 C 80,68 68,56 74,26 C 58,42 42,58 26,74 C 32,80 44,68 50,50";
// Phase 4: Intertwined Monogram 'C ✕ X'
const PATH_CXX =
  "M 50,50 C 34,28 18,36 24,56 C 30,76 46,68 50,50 C 54,32 70,24 76,44 C 82,64 66,72 50,50 C 38,42 62,42 50,50";

const MORPH_STAGES = [
  { path: PATH_C, title: "C", subtitle: "Chandrika" },
  { path: PATH_KNOT, title: "✕", subtitle: "Sacred Bond" },
  { path: PATH_X, title: "X", subtitle: "Xudong" },
  { path: PATH_CXX, title: "C ✕ X", subtitle: "Together Forever" },
];

export const WeddingLoader: React.FC<WeddingLoaderProps> = ({
  progress = 0,
  message,
}) => {
  const [stageIndex, setStageIndex] = useState(0);

  // Cycle through the CxX morphing stages every 1.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % MORPH_STAGES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const currentStage = MORPH_STAGES[stageIndex];

  // Dynamic luxury status message based on progress
  const dynamicMessage =
    message ||
    (progress < 30
      ? "Unfolding Royal Invitations..."
      : progress < 65
      ? "Tuning Wedding Soundscape & Melodies..."
      : progress < 90
      ? "Polishing Sacred Mandap & Moments..."
      : "Welcome to Chandrika & Xudong's Celebration!");

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF5EB] dark:bg-[#120F0D] select-none px-4 transition-colors duration-700 overflow-hidden">
      {/* Warm golden candlelight ambient glow */}
      <div className="pointer-events-none absolute -top-16 w-96 h-96 rounded-full bg-[#D4AF37]/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-16 w-96 h-96 rounded-full bg-[#8C1D24]/15 blur-3xl animate-pulse" />

      {/* Floating Gold Sparkle Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37] blur-[1px] animate-ping"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${15 + i * 14}%`,
              left: `${20 + ((i * 23) % 65)}%`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Ornate Gold Monogram Crest with Morphing CxX Logo */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-6">
          {/* Outer Rotating Ornate Mandala Ring */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/50 animate-[spin_24s_linear_infinite]"
            style={{
              boxShadow: "0 0 25px rgba(212, 175, 55, 0.2)",
            }}
          />

          {/* Inner Counter-Rotating Golden Ring */}
          <div className="absolute inset-2 rounded-full border border-dotted border-[#D4AF37]/40 animate-[spin_18s_linear_infinite_reverse]" />

          {/* Inner Solid Luxury Badge Frame */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white dark:bg-[#1C1613] border-2 border-[#D4AF37] shadow-[0_10px_35px_rgba(212,175,55,0.28)] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient inner soft ring */}
            <div className="absolute inset-1 rounded-full border border-[#D4AF37]/30" />

            {/* Morphing SVG Logo Canvas */}
            <svg
              viewBox="0 0 100 100"
              className="w-14 h-14 sm:w-16 sm:h-16 relative z-10 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
            >
              <defs>
                <linearGradient
                  id="goldMorphGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8C6B1C" />
                </linearGradient>
              </defs>

              {/* The Morphing SVG Path */}
              <motion.path
                key="morph-path"
                d={currentStage.path}
                animate={{ d: currentStage.path }}
                transition={{
                  duration: 1.1,
                  ease: [0.25, 1, 0.5, 1], // Smooth cubic ease matching GreenSock MorphSVG
                }}
                fill="none"
                stroke="url(#goldMorphGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Micro Monogram Text Badge */}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStage.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15 }}
                transition={{ duration: 0.35 }}
                className="absolute bottom-1 font-royal font-bold text-[9px] tracking-widest text-[#8C6B1C] dark:text-[#D4AF37] uppercase"
              >
                {currentStage.title}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Grand Wedding Names with Gold Shimmer */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#231C18] dark:text-white tracking-wide mb-1 font-bold">
          Chandrika &amp; Xudong
        </h2>

        {/* Sacred Devanagari Blessing */}
        <div className="flex items-center gap-1.5 text-xs text-[#8C1D24] dark:text-[#E57373] font-devanagari font-bold tracking-widest mb-1">
          <span>卐</span>
          <span>॥ शुभ विवाह ॥</span>
          <span>卐</span>
        </div>

        <p className="text-[10px] sm:text-[10.5px] tracking-[0.28em] uppercase font-sans text-[#8C6B1C] dark:text-[#D4AF37] font-semibold mb-5">
          The Club International, Gurugram
        </p>

        {/* Minimal Luxury Gold & Crimson Progress Bar with Shimmer Beam */}
        <div className="relative w-52 sm:w-56 h-1.5 bg-[#D4AF37]/25 dark:bg-[#D4AF37]/15 rounded-full overflow-hidden mb-2.5 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8C1D24] via-[#D4AF37] to-[#FFE082] rounded-full relative"
            style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          >
            {/* Shimmer Light Flare Beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.6s_infinite]" />
          </motion.div>
        </div>

        {/* Progress Message and Percentage */}
        <div className="flex items-center justify-between w-52 sm:w-56 text-[11px] font-serif text-[#8C6B1C] dark:text-[#D4AF37]">
          <span className="italic truncate max-w-[150px]">
            {dynamicMessage}
          </span>
          <span className="font-bold font-mono">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeddingLoader;
