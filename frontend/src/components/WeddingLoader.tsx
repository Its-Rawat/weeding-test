import React, { useEffect, useState } from "react";

interface WeddingLoaderProps {
  progress?: number;
  onFinished?: () => void;
}

export const WeddingLoader: React.FC<WeddingLoaderProps> = ({ progress: externalProgress }) => {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (externalProgress !== undefined) {
      setInternalProgress(externalProgress);
      return;
    }

    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [externalProgress]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF7F2] select-none px-4 transition-opacity duration-300">
      {/* Subtle warm glow in background */}
      <div className="pointer-events-none absolute w-80 h-80 rounded-full bg-[#d4af37]/15 blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Ornate Gold Monogram Crest */}
        <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] bg-white shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex flex-col items-center justify-center mb-5 relative">
          <div className="absolute inset-1 rounded-full border border-[#d4af37]/40" />
          <span className="font-serif font-bold text-2xl text-[#8C6B1C] tracking-tight">
            C &amp; X
          </span>
        </div>

        {/* Grand Wedding Names */}
        <h2 className="font-serif text-2xl text-stone-900 tracking-wide mb-1">
          Chandrika &amp; Xudong
        </h2>
        <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9e7241] font-semibold mb-6">
          The Royal Wedding • Udaipur
        </p>

        {/* Minimal Luxury Gold Progress Bar */}
        <div className="w-40 h-0.5 bg-[#d4af37]/20 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-[#9e7241] via-[#d4af37] to-[#E5C775] transition-all duration-100 ease-out"
            style={{ width: `${Math.min(100, Math.max(15, internalProgress))}%` }}
          />
        </div>

        <span className="text-[10px] font-serif italic text-stone-500 tracking-wider">
          Opening your royal invitation...
        </span>
      </div>
    </div>
  );
};

export default WeddingLoader;
