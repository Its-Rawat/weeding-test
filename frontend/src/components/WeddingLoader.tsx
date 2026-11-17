import React from "react";

interface WeddingLoaderProps {
  progress?: number;
  message?: string;
  isExiting?: boolean;
}

export const WeddingLoader: React.FC<WeddingLoaderProps> = ({
  progress = 0,
  isExiting = false,
}) => {
  const clampedProgress = Math.min(100, Math.max(5, Math.round(progress)));

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#120B16] via-[#1B0F20] to-[#261022] text-white select-none overflow-hidden px-4 transition-all duration-700 ease-out ${
        isExiting
          ? "opacity-0 pointer-events-none scale-105 blur-[2px]"
          : "opacity-100 scale-100 blur-0"
      }`}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {/* 1. AMBIENT CELEBRATORY SUNSET GLOW ORBS (Pink, Yellow, White) */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full bg-[#F59E0B]/20 blur-[140px] animate-pulse" />
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#EC4899]/20 blur-[150px] animate-pulse"
        style={{ animationDelay: "1.2s" }}
      />

      {/* 2. SUBTLE CELEBRATION STARLIGHT DUST */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${(i * 19) % 94}%`,
              left: `${(i * 27) % 95}%`,
              width: `${(i % 3) + 1.2}px`,
              height: `${(i % 3) + 1.2}px`,
              opacity: 0.25 + ((i % 5) * 0.15),
              animationDuration: `${1.8 + (i % 3)}s`,
              animationDelay: `${(i * 0.25) % 2.5}s`,
            }}
          />
        ))}
      </div>

      {/* 3. CENTERPIECE: SINGLE MAJESTIC ROYAL LALTEN LAMP WITH PROGRESS INSIDE */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        <div
          className="relative mb-6 flex flex-col items-center will-change-transform"
          style={{ animation: "laltenHover 3.6s ease-in-out infinite" }}
        >
          {/* Outer Breathing Radial Lamp Aura */}
          <div className="pointer-events-none absolute -inset-12 rounded-full bg-gradient-to-b from-[#FDE047]/35 via-[#EC4899]/30 to-transparent blur-3xl animate-pulse" />

          {/* Lantern Suspension Golden Ring */}
          <div className="w-6 h-6 rounded-full border-2 border-[#FDE047] shadow-[0_0_14px_rgba(253,224,71,0.7)] mb-0.5 relative z-10">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#FDE047]" />
          </div>

          {/* Lantern Ornate Dome Canopy */}
          <div className="w-20 h-4 rounded-t-full bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#D97706] border-t border-[#FEF08A] shadow-md relative z-10 flex items-center justify-center">
            <div className="w-3 h-1.5 rounded-full bg-[#FEF08A] shadow-[0_0_6px_#FEF08A]" />
          </div>

          {/* Lantern Translucent Glass Body with Inner Glowing Liquid Radiance & Percentage */}
          <div
            className="relative w-24 h-32 rounded-[24px/36px] bg-gradient-to-b from-black/40 via-[#261022]/60 to-[#120B16]/80 p-1 border-2 border-[#FDE047]/90 shadow-[0_0_35px_rgba(245,158,11,0.5),inset_0_0_25px_rgba(253,224,71,0.35)] backdrop-blur-md flex flex-col items-center justify-between overflow-hidden z-10"
          >
            {/* Delicate Golden Filigree Ribs */}
            <div className="absolute inset-0 border-x border-[#FDE047]/40 rounded-[24px/36px] pointer-events-none" />
            <div className="absolute inset-y-0 w-[45%] border-x border-white/25 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/20 pointer-events-none" />

            {/* Rising Inner Liquid Golden Light Fill */}
            <div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#E11D48]/85 via-[#F59E0B]/85 to-[#FEF08A]/90 transition-all duration-500 ease-out shadow-[0_0_24px_rgba(253,224,71,0.85)]"
              style={{ height: `${clampedProgress}%` }}
            >
              {/* Luminous Liquid Surface Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-white/80 shadow-[0_0_8px_#FFFFFF] blur-[0.5px]" />
              {/* Ambient shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            {/* Inner Sacred Diya Flame (Akhand Jyoti) at top */}
            <div className="relative z-20 pt-2 flex flex-col items-center">
              {/* Flickering flame halo */}
              <div
                className="w-4 h-6 rounded-full bg-[#FEF08A] blur-[1px] animate-ping opacity-80"
                style={{ animationDuration: "1.4s" }}
              />
              {/* Pure White Core Flame */}
              <div className="absolute top-2 w-2.5 h-4 rounded-full bg-white shadow-[0_0_12px_#FFFFFF,0_0_20px_#FDE047]" />
            </div>

            {/* Glowing Percentage Number Inside the Heart of the Lalten */}
            <div className="relative z-20 flex flex-col items-center justify-center my-auto">
              <div className="flex items-baseline justify-center">
                <span className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9),0_0_16px_rgba(254,240,138,0.9)]">
                  {clampedProgress}
                </span>
                <span className="font-sans text-xs font-semibold text-[#FEF08A] ml-0.5 opacity-90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  %
                </span>
              </div>
              <span className="font-royal text-[8.5px] font-bold tracking-[0.25em] text-white/90 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                C &amp; X
              </span>
            </div>

            {/* Little Diya Pedestal Inside Base */}
            <div className="relative z-20 pb-1.5 flex flex-col items-center">
              <div className="w-6 h-1 rounded-full bg-[#B45309] shadow-xs" />
            </div>
          </div>

          {/* Lantern Ornate Base */}
          <div className="w-20 h-3 rounded-b-md bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#D97706] border-b border-[#FEF08A] shadow-md relative z-10 flex items-center justify-center">
            <div className="w-4 h-1 rounded-full bg-[#FEF08A]" />
          </div>

          {/* Dangling Golden Silk Tassels with Sway */}
          <div
            className="flex items-center gap-3.5 pt-1 will-change-transform"
            style={{ animation: "tasselSway 2.4s ease-in-out infinite alternate" }}
          >
            <div className="w-0.5 h-4 bg-gradient-to-b from-[#FDE047] to-[#F59E0B] rounded-full shadow-[0_0_6px_rgba(253,224,71,0.6)]" />
            <div className="w-0.5 h-6 bg-gradient-to-b from-[#FDE047] to-[#EC4899] rounded-full shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
            <div className="w-0.5 h-4 bg-gradient-to-b from-[#FDE047] to-[#F59E0B] rounded-full shadow-[0_0_6px_rgba(253,224,71,0.6)]" />
          </div>
        </div>

        {/* 4. COUPLE NAMES IN ITALIANA WITH SUNSET SHIMMER */}
        <h1 className="font-serif text-3xl sm:text-4xl tracking-wide font-light mb-1.5 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FEF08A] to-white drop-shadow-md">
          Chandrika &amp; Xudong
        </h1>

        <p className="font-serif italic text-xs sm:text-sm tracking-[0.25em] text-[#FDE68A]/90">
          Welcomes You
        </p>

        {/* 5. JOYFUL MASCOT RUNNING IN PLACE (Always 100% visible, zero empty path) */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative flex flex-col items-center">
            {/* Subtle warm golden ambient pedestal glow */}
            <div className="absolute -bottom-1 w-24 h-3 bg-gradient-to-r from-transparent via-[#FDE047]/30 to-transparent blur-xs rounded-full" />

            {/* Running Dog */}
            <div
              className="relative will-change-transform flex items-center justify-center"
              style={{ animation: "dogGallopBob 0.6s ease-in-out infinite alternate" }}
            >
              <img
                src="/illustrations/omfg_dog_running.gif"
                alt="Running Mascot"
                className="w-20 sm:w-24 h-auto drop-shadow-[0_4px_16px_rgba(253,224,71,0.45)] select-none"
                style={{ imageRendering: "pixelated" }}
                draggable={false}
              />
            </div>

            {/* Elegant Royal Golden Flourish */}
            <div className="flex items-center gap-2 mt-2 opacity-60">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#FDE047]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#FEF08A] shadow-[0_0_6px_#FEF08A]" />
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#FDE047]" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes dogGallopBob {
          0% {
            transform: translateY(0px) scale(1);
          }
          100% {
            transform: translateY(-3px) scale(1.02);
          }
        }

        @keyframes laltenHover {
          0%, 100% {
            transform: translateY(0px) rotate(-1.5deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }

        @keyframes tasselSway {
          0% {
            transform: rotate(-6deg) translateX(-2px);
          }
          100% {
            transform: rotate(6deg) translateX(2px);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .animate-shimmer {
          animation: shimmer 2.2s infinite;
        }
      `}</style>
    </div>
  );
};

export default WeddingLoader;
