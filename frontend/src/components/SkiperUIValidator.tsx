import React, { useState, useEffect } from "react";
import { Sparkles, X, Check, Volume2 } from "lucide-react";
import { Link000, Link001, Link002, Link003, Link004, Link005 } from "./ui/skiper-ui/skiper40";
import SkiperMusicToggle from "./ui/skiper-ui/skiper25";

export const SkiperUIValidator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUat, setIsUat] = useState(false);
  const [demoMusicPlaying, setDemoMusicPlaying] = useState(false);

  useEffect(() => {
    // Only mount and show in UAT environments (localhost or 127.0.0.1 or ?uat=true)
    if (typeof window !== "undefined") {
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.search.includes("uat");
      setIsUat(isLocal);
    }
  }, []);

  if (!isUat) return null;

  return (
    <aside
      aria-label="Skiper UI UAT Validation Inspector"
      className="fixed bottom-20 right-3 sm:right-6 z-50 select-none font-sans"
    >
      {/* Floating Pill Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1F1718]/90 text-[#E5C378] border border-[#D4AF37]/60 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs font-semibold"
          title="Open Skiper UI UAT Validation Panel"
        >
          <Sparkles className="w-4 h-4 text-[#FFD54F] animate-spin-slow" />
          <span>Skiper UI (UAT)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Expanded Interactive Validation Card */}
      {isOpen && (
        <div className="w-[320px] sm:w-[390px] rounded-2xl bg-[#FFFDF9]/98 dark:bg-[#1C1717]/98 border border-[#D4AF37]/70 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl p-4 sm:p-5 text-[#231C18] dark:text-[#FAF5EB] animate-scale-in max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#8C1D24] text-white">
                <Sparkles className="w-4 h-4 text-[#FFE082]" />
              </span>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide">
                  Skiper UI Validation
                </h4>
                <p className="text-[10px] text-[#8C6B1C] dark:text-[#D4AF37] font-semibold uppercase tracking-widest">
                  @skiper-ui • skiper40 + skiper25
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Music Toggle (skiper25) */}
          <div className="mt-3.5 pb-3 border-b border-[#D4AF37]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8C1D24] dark:text-[#FFE082] uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>skiper25: Music Equalizer Button</span>
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                Active on Video
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 mb-2.5">
              Live interactive equalizer button with animated jumping soundbars:
            </p>
            <div className="flex items-center justify-center p-3 rounded-xl bg-black/80 border border-white/10">
              <SkiperMusicToggle
                isPlaying={demoMusicPlaying}
                onToggle={() => setDemoMusicPlaying((p) => !p)}
              />
            </div>
          </div>

          {/* Section 2: Animated Links (skiper40) */}
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-[#8C1D24] dark:text-[#FFE082] uppercase tracking-wider block mb-1">
              skiper40: Animated Micro-Links
            </span>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 mb-2">
              Hover to test directional underlines and diagonal sliding arrows:
            </p>

            <div className="space-y-2.5 p-3 rounded-xl bg-[#FAF5EB] dark:bg-white/5 border border-[#D4AF37]/30 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-500">Link001 (Left-to-Right + Arrow):</span>
                <Link001 href="#event" className="text-[#8C1D24] dark:text-[#FFB4AB] font-semibold">
                  Ceremony Schedule
                </Link001>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-500">Link002 (Right-to-Left + Arrow):</span>
                <Link002 href="#event" className="text-[#8C6B1C] dark:text-[#D4AF37] font-semibold">
                  Destination Venue
                </Link002>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-500">Link003 (Center Reveal):</span>
                <Link003 href="#rsvp" className="text-[#191410] dark:text-[#FAF5EB] font-semibold">
                  + Add to Calendar
                </Link003>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-500">Link005 (Luxury Pill):</span>
                <Link005 href="#rsvp" className="text-[#8C1D24] dark:text-[#FFD54F] text-[11px]">
                  Confirm RSVP
                </Link005>
              </div>
            </div>
          </div>

          {/* Active Placements in Wedding Site */}
          <div className="mt-3.5 space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
            <p className="font-semibold text-[#8C1D24] dark:text-[#E5C378] text-xs">
              📍 Components Upgraded in UAT:
            </p>
            <ul className="space-y-0.5 pl-1 list-disc list-inside">
              <li>
                <strong>Video Landing:</strong> Skiper 25 Music Equalizer with instant 1st-click toggle
              </li>
              <li>
                <strong>Celebrations Card:</strong> "+ Add to Calendar" &amp; "View Map"
              </li>
              <li>
                <strong>Countdown Section:</strong> "Ceremony Schedule" &amp; "Confirm RSVP"
              </li>
              <li>
                <strong>Footer:</strong> Host Contact Link with sliding diagonal arrow
              </li>
            </ul>
          </div>

          {/* Footer controls */}
          <div className="mt-4 pt-3 border-t border-[#D4AF37]/25 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Active in UAT Preview
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8C1D24] dark:text-[#D4AF37] hover:underline cursor-pointer font-semibold"
            >
              Minimize
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SkiperUIValidator;
