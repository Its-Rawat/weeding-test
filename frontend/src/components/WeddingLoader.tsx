import React, { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";

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

    // Natural smooth progress simulation
    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = 100 - prev;
        const step = Math.max(1, Math.floor(Math.random() * (diff > 40 ? 12 : 5)));
        return Math.min(100, prev + step);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [externalProgress]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFFDF9] dark:bg-[#131110] transition-colors duration-500 overflow-hidden select-none px-4">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl animate-pulse-soft" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#9e7241]/10 blur-3xl animate-pulse-soft [animation-delay:2s]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Pixel Couple Canvas / Graphic */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Floating animated pixel hearts */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none">
            <span className="inline-block text-rose-500 animate-bounce text-sm [animation-duration:1.2s]">
              ❤️
            </span>
            <span className="inline-block text-amber-400 text-xs animate-pulse [animation-duration:0.8s]">
              ✨
            </span>
            <span className="inline-block text-rose-400 animate-bounce text-base [animation-duration:1.5s] [animation-delay:0.3s]">
              💖
            </span>
          </div>

          {/* Pixel Art SVG of Groom in Blazer and Bride in Wedding Dress */}
          <div className="relative p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-[#d4af37]/30 shadow-[0_15px_35px_rgba(212,175,55,0.15)] backdrop-blur-md">
            <svg
              viewBox="0 0 44 32"
              className="w-36 h-28 sm:w-44 sm:h-32 drop-shadow-md animate-[pixelBob_1.8s_ease-in-out_infinite]"
              style={{ shapeRendering: "crispEdges" }}
            >
              {/* Soft floor shadow */}
              <ellipse cx="22" cy="30" rx="16" ry="2" fill="rgba(212, 175, 55, 0.25)" />

              {/* ===== GROOM (Left) ===== */}
              {/* Hair */}
              <rect x="6" y="3" width="7" height="3" fill="#1c1917" />
              <rect x="5" y="4" width="2" height="3" fill="#1c1917" />
              <rect x="12" y="4" width="2" height="3" fill="#1c1917" />

              {/* Face & Skin */}
              <rect x="7" y="6" width="5" height="4" fill="#fed7aa" />
              <rect x="6" y="7" width="1" height="2" fill="#fed7aa" />
              <rect x="12" y="7" width="1" height="2" fill="#fed7aa" />
              {/* Eyes */}
              <rect x="8" y="7" width="1" height="1" fill="#0f172a" />
              <rect x="10" y="7" width="1" height="1" fill="#0f172a" />
              {/* Gentle smile */}
              <rect x="9" y="9" width="1" height="1" fill="#f43f5e" />

              {/* White Shirt Collar & Gold Bowtie */}
              <rect x="8" y="10" width="3" height="1" fill="#ffffff" />
              <rect x="9" y="11" width="1" height="1" fill="#d4af37" />
              <rect x="8" y="11" width="1" height="1" fill="#b45309" />
              <rect x="10" y="11" width="1" height="1" fill="#b45309" />

              {/* Blazer / Suit Jacket (Sharp Charcoal & Gold Lapels) */}
              <rect x="6" y="12" width="7" height="7" fill="#1e293b" />
              {/* Lapels */}
              <rect x="7" y="12" width="1" height="4" fill="#334155" />
              <rect x="11" y="12" width="1" height="4" fill="#334155" />
              {/* White pocket square */}
              <rect x="11" y="13" width="1" height="1" fill="#ffffff" />
              {/* Gold blazer buttons */}
              <rect x="9" y="14" width="1" height="1" fill="#d4af37" />
              <rect x="9" y="16" width="1" height="1" fill="#d4af37" />

              {/* Groom's Left Arm */}
              <rect x="5" y="13" width="1" height="5" fill="#1e293b" />
              <rect x="5" y="18" width="1" height="1" fill="#fed7aa" />

              {/* Groom's Right Arm (Holding Bride's Hand) */}
              <rect x="13" y="14" width="2" height="2" fill="#1e293b" />
              <rect x="14" y="16" width="2" height="1" fill="#fed7aa" />

              {/* Trousers */}
              <rect x="7" y="19" width="2" height="7" fill="#0f172a" />
              <rect x="10" y="19" width="2" height="7" fill="#0f172a" />

              {/* Polished Black Shoes */}
              <rect x="6" y="26" width="3" height="2" fill="#000000" />
              <rect x="10" y="26" width="3" height="2" fill="#000000" />

              {/* Hand clasp spark */}
              <rect x="15" y="16" width="1" height="1" fill="#d4af37" />

              {/* ===== BRIDE (Right) ===== */}
              {/* Translucent Lace Veil */}
              <rect x="18" y="4" width="1" height="16" fill="#ffffff" opacity="0.6" />
              <rect x="29" y="4" width="1" height="16" fill="#ffffff" opacity="0.6" />
              <rect x="17" y="6" width="1" height="14" fill="#ffffff" opacity="0.4" />
              <rect x="30" y="6" width="1" height="14" fill="#ffffff" opacity="0.4" />

              {/* Gold Tiara / Floral Crown */}
              <rect x="20" y="3" width="8" height="1" fill="#d4af37" />
              <rect x="21" y="2" width="1" height="1" fill="#ffffff" />
              <rect x="24" y="2" width="1" height="1" fill="#ffffff" />
              <rect x="26" y="2" width="1" height="1" fill="#ffffff" />

              {/* Bride's Hair */}
              <rect x="20" y="4" width="8" height="3" fill="#292524" />
              <rect x="19" y="5" width="2" height="6" fill="#292524" />
              <rect x="27" y="5" width="2" height="6" fill="#292524" />

              {/* Face & Blushing Cheeks */}
              <rect x="21" y="7" width="6" height="4" fill="#fed7aa" />
              {/* Eyes */}
              <rect x="22" y="8" width="1" height="1" fill="#0f172a" />
              <rect x="25" y="8" width="1" height="1" fill="#0f172a" />
              {/* Rosy Blush */}
              <rect x="21" y="9" width="1" height="1" fill="#fda4af" />
              <rect x="26" y="9" width="1" height="1" fill="#fda4af" />
              {/* Bride Smile */}
              <rect x="23" y="10" width="2" height="1" fill="#e11d48" />

              {/* Bride's Gown Bodice (Sweetheart Neckline) */}
              <rect x="21" y="11" width="6" height="4" fill="#ffffff" />
              <rect x="22" y="11" width="1" height="1" fill="#fed7aa" />
              <rect x="25" y="11" width="1" height="1" fill="#fed7aa" />

              {/* Bride's Left Arm (Meeting Groom's Hand) */}
              <rect x="16" y="15" width="2" height="2" fill="#fed7aa" />

              {/* Bride's Right Arm & Floral Bouquet */}
              <rect x="27" y="14" width="2" height="2" fill="#fed7aa" />
              {/* Bouquet (Pink roses, green leaves, gold sparkle) */}
              <rect x="21" y="14" width="2" height="2" fill="#f43f5e" />
              <rect x="23" y="14" width="1" height="2" fill="#fb7185" />
              <rect x="20" y="15" width="1" height="1" fill="#22c55e" />
              <rect x="24" y="15" width="1" height="1" fill="#d4af37" />

              {/* Flared Flowing Wedding Dress */}
              <rect x="20" y="15" width="8" height="3" fill="#ffffff" />
              <rect x="19" y="18" width="10" height="4" fill="#ffffff" />
              <rect x="18" y="22" width="12" height="3" fill="#ffffff" />
              <rect x="17" y="25" width="14" height="3" fill="#ffffff" />

              {/* Dress Fold / Champagne Gold Shading */}
              <rect x="23" y="18" width="1" height="9" fill="#fef3c7" />
              <rect x="27" y="21" width="1" height="6" fill="#fef3c7" />
              <rect x="19" y="23" width="1" height="4" fill="#fef3c7" />

              {/* Scalloped Lace Hem */}
              <rect x="16" y="27" width="16" height="1" fill="#ffffff" />
              <rect x="17" y="28" width="14" height="1" fill="#fef3c7" />
            </svg>
          </div>
        </div>

        {/* Couple Title */}
        <h2 className="font-script text-3xl sm:text-4xl text-[#26211e] dark:text-[#fdfbf7] mb-1">
          Chandrika <span className="text-[#d4af37] font-serif text-2xl sm:text-3xl">&amp;</span> Xudong
        </h2>

        {/* Subtitle */}
        <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase font-sans text-[#9e7241] dark:text-[#d4af37] mb-4">
          The Wedding Celebration
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full max-w-xs px-2 mb-3">
          <div className="h-2 w-full bg-slate-200/80 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-[#d4af37]/30 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#9e7241] via-[#d4af37] to-[#f6e05e] rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(212,175,55,0.6)]"
              style={{ width: `${Math.min(100, Math.max(8, internalProgress))}%` }}
            />
          </div>
        </div>

        {/* Progress Text & Status */}
        <div className="flex items-center justify-between w-full max-w-xs px-3 text-[11px] text-slate-500 dark:text-slate-400 font-sans">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#d4af37] animate-spin-slow" />
            <span>Loading invitation...</span>
          </span>
          <span className="font-mono text-[#9e7241] dark:text-[#d4af37] font-semibold">
            {Math.round(internalProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeddingLoader;
