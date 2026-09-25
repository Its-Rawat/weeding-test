import React from "react";

interface WeddingLoaderProps {
  progress?: number;
  message?: string;
}

export const WeddingLoader: React.FC<WeddingLoaderProps> = ({
  progress = 0,
  message = "Buffering wedding video & royal invitation...",
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF5EB] select-none px-4 transition-opacity duration-500">
      {/* Subtle warm gold aura in background */}
      <div className="pointer-events-none absolute w-80 h-80 rounded-full bg-[#d4af37]/20 blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Ornate Gold Monogram Crest */}
        <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] bg-white shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex flex-col items-center justify-center mb-5 relative">
          <div className="absolute inset-1 rounded-full border border-[#d4af37]/40" />
          <span className="font-royal font-bold text-2xl text-[#8C6B1C] tracking-tight">
            C &amp; X
          </span>
        </div>

        {/* Grand Wedding Names */}
        <h2 className="font-serif text-2xl text-[#231C18] tracking-wide mb-1 font-bold">
          Chandrika &amp; Xudong
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-[#8C1D24] font-devanagari font-bold tracking-widest mb-1">
          <span>卐</span>
          <span>॥ शुभ विवाह ॥</span>
          <span>卐</span>
        </div>
        <p className="text-[10.5px] tracking-[0.3em] uppercase font-sans text-[#8C6B1C] font-semibold mb-6">
          The Royal Wedding • Udaipur
        </p>

        {/* Minimal Luxury Gold Progress Bar */}
        <div className="w-48 h-1 bg-[#d4af37]/25 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-gradient-to-r from-[#8C1D24] via-[#D4AF37] to-[#FFD54F] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-48 text-[11px] font-serif text-[#8C6B1C]">
          <span className="italic">{message}</span>
          <span className="font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default WeddingLoader;
