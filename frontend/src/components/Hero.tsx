import React, { useState, useEffect } from "react";
import { Sparkles, Image as ImageIcon, PenTool } from "lucide-react";
import type { AppConfig } from "../types";
import { EtchingFrameCorners } from "./ui/EtchingCorner";

interface HeroProps {
  config: AppConfig;
  personalizedGuestName?: string | null;
  allowedEvents?: string[] | null;
  onOpenStory?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  config,
  personalizedGuestName,
  allowedEvents,
  onOpenStory,
}) => {
  const [guestName, setGuestName] = useState<string | null>(personalizedGuestName || null);
  const [viewMode, setViewMode] = useState<"illustration" | "portrait">("illustration");

  useEffect(() => {
    if (personalizedGuestName) {
      setGuestName(personalizedGuestName);
    } else {
      const params = new URLSearchParams(window.location.search);
      setGuestName(params.get("to"));
    }
  }, [personalizedGuestName]);

  // If a person is attending 14th Feb Mehendi ceremony then only they should see 14 & 15 February, else only 15th Feb
  const hasMehendi = Boolean(
    allowedEvents && allowedEvents.some((e) => e.toUpperCase().includes("MEH"))
  );

  const dayLabel = hasMehendi ? "SUNDAY & MONDAY" : "MONDAY";
  const dateNumeral = hasMehendi ? "14 & 15" : "15";
  const monthYearLabel = "FEBRUARY 2027";
  const timeString = hasMehendi
    ? "CELEBRATIONS COMMENCE AT 04:00 PM"
    : "SACRED CEREMONY AT 07:00 PM";

  const sharedAddress =
    config.venue.address ||
    "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)";
  const venueName = config.venue.name || "The Club International";

  return (
    <section
      id="invitation"
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center py-10 sm:py-16 pb-20 sm:pb-28 px-4 bg-[#FFFBF0] dark:bg-[#151111] overflow-hidden transition-colors duration-1000"
    >
      {/* Subtle Huey Lightshop Warm Gradient Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#C5A059]/10 via-[#FFFBF0] to-transparent rounded-full blur-3xl -z-10" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        {/* THE ARCHED FORMAL INVITATION CARD (Huey Lightshop Architectural Style) */}
        <div className="relative w-full bg-[#FFFBF0] dark:bg-[#1c1716] rounded-t-[140px] sm:rounded-t-[190px] md:rounded-t-[220px] rounded-b-2xl border border-[#374454]/25 dark:border-[#C5A059]/30 shadow-[0_20px_60px_-15px_rgba(55,68,84,0.12)] p-6 sm:p-10 md:p-12 text-center overflow-hidden transition-all duration-300">
          
          {/* Ornate Corner Filigrees in Bottom Corners */}
          <EtchingFrameCorners color="#374454" size={26} className="opacity-35 dark:opacity-20" />

          {/* Ornate Inner Double Filigree Arch Border */}
          <div className="absolute inset-2.5 sm:inset-3 rounded-t-[130px] sm:rounded-t-[175px] md:rounded-t-[205px] rounded-b-xl border border-[#374454]/15 dark:border-[#C5A059]/20 pointer-events-none" />

          {/* Sacred Ganesha & Monogram Crest */}
          <div className="pt-2 sm:pt-4 mb-4 flex flex-col items-center">
            {/* Monogram Seal */}
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border border-[#374454]/30 dark:border-[#C5A059]/50 bg-[#FFFBF0] dark:bg-[#151111] shadow-xs flex flex-col items-center justify-center p-1 mb-2.5">
              <span className="font-editorial font-bold text-base sm:text-lg text-[#374454] dark:text-[#C5A059] tracking-widest">
                C &amp; X
              </span>
            </div>

            {/* Auspicious Shubh Vivah */}
            <div className="inline-flex items-center gap-2 text-xs text-[#8C1D24] dark:text-[#E0A899] tracking-widest uppercase font-devanagari font-bold">
              <span>🪷</span>
              <span className="text-[11px] tracking-[0.25em]">॥ शुभ विवाह ॥</span>
              <span>🪷</span>
            </div>
          </div>

          {/* Formal Request Copy in EB Garamond */}
          <div className="space-y-1.5 sm:space-y-2 mb-4">
            <p className="font-editorial italic text-[#556272] dark:text-stone-300 text-xs sm:text-sm">
              With the blessings of our parents
            </p>
            <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-[#374454] dark:text-[#C5A059] uppercase">
              The Rawat &amp; Wang Families
            </p>
            <p className="font-editorial text-xs sm:text-sm text-[#556272] dark:text-stone-300 italic max-w-sm mx-auto leading-relaxed pt-1">
              Request the pleasure of your company at the celebration of the marriage of
            </p>
          </div>

          {/* Royal Arched Window: Hand-Drawn Etching Illustration & Portrait Switcher */}
          <div className="my-5 flex flex-col items-center">
            {/* View Mode Toggle Pill (Artistic Illustration vs Photo) */}
            <div className="inline-flex items-center p-1 rounded-full bg-[#FAF5EB] dark:bg-[#251e1c] border border-[#374454]/20 dark:border-[#C5A059]/30 mb-3 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("illustration")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-semibold tracking-wider uppercase transition-all ${
                  viewMode === "illustration"
                    ? "bg-[#374454] text-[#FFFBF0] shadow-xs"
                    : "text-[#556272] hover:text-[#374454] dark:text-stone-300"
                }`}
              >
                <PenTool className="w-3 h-3" />
                <span>Artistic Sketch</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("portrait")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-semibold tracking-wider uppercase transition-all ${
                  viewMode === "portrait"
                    ? "bg-[#374454] text-[#FFFBF0] shadow-xs"
                    : "text-[#556272] hover:text-[#374454] dark:text-stone-300"
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Portrait</span>
              </button>
            </div>

            {/* Arched Palace Window Frame */}
            <div
              onClick={onOpenStory}
              className="relative group cursor-pointer"
              title="Click to view our story & proposal"
            >
              <div className="relative w-44 h-58 sm:w-52 sm:h-68 rounded-t-[100px] rounded-b-xl overflow-hidden border border-[#374454]/30 dark:border-[#C5A059]/50 bg-[#FFFBF0] shadow-[0_12px_32px_rgba(55,68,84,0.14)]">
                <img
                  src={
                    viewMode === "illustration"
                      ? "/illustrations/couple_etching.jpg"
                      : "/couple/formal_portrait.jpg"
                  }
                  alt="Chandrika & Xudong"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

                {/* Floating "View Story" banner at the bottom */}
                <div className="absolute bottom-2.5 inset-x-2 flex items-center justify-center gap-1.5 px-2 py-1 rounded-full bg-black/55 backdrop-blur-md border border-[#C5A059]/60 text-[10px] sm:text-[11px] font-editorial uppercase tracking-widest text-[#FFFBF0] font-bold shadow-md group-hover:bg-[#8C1D24]/85 transition-colors">
                  <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
                  <span>Our Story &amp; Proposal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Couple Title (EB Garamond) */}
          <div className="my-4 sm:my-6">
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-normal text-[#232B35] dark:text-white tracking-tight leading-tight">
              {config.couple.bride.name}
            </h1>
            <span className="font-script text-3xl sm:text-4xl text-[#C5A059] block my-0.5">
              &amp;
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-normal text-[#232B35] dark:text-white tracking-tight leading-tight">
              {config.couple.groom.name}
            </h1>
          </div>

          {guestName && (
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF5EB] dark:bg-[#251e1c] text-[#232B35] dark:text-stone-200 font-editorial italic text-xs border border-[#374454]/20 dark:border-[#C5A059]/30 shadow-2xs">
                Warmly welcoming <strong className="font-semibold text-[#8C1D24] dark:text-[#E0A899]">{guestName}</strong>
              </span>
            </div>
          )}

          {/* EDITORIAL CALENDAR NUMERAL LOCKUP (Huey Lightshop Journal Style) */}
          <div className="my-6 py-4 border-y border-[#374454]/20 dark:border-[#C5A059]/30 max-w-xs mx-auto">
            <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#374454] dark:text-[#C5A059] uppercase mb-1">
              {dayLabel}
            </p>
            <div className="font-editorial text-5xl sm:text-6xl md:text-7xl font-normal text-[#232B35] dark:text-white leading-none my-1 tracking-tight">
              {dateNumeral}
            </div>
            <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#374454] dark:text-[#C5A059] uppercase mt-1">
              {monthYearLabel}
            </p>
            <p className="font-editorial italic text-[#556272] dark:text-stone-300 text-xs mt-2">
              {timeString}
            </p>
          </div>

          {/* Venue & Location */}
          <div className="space-y-1.5 my-4">
            <h3 className="font-editorial font-bold text-base sm:text-lg text-[#232B35] dark:text-white tracking-widest uppercase">
              {venueName}
            </h3>
            <p className="font-editorial italic text-[#556272] dark:text-stone-300 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              {sharedAddress}
            </p>
            <p className="font-editorial italic text-[11px] font-semibold text-[#8C1D24] dark:text-[#E0A899] pt-2">
              {config.text.closing.family || "Warmly Hosted by Aditya Rawat & Family"}
            </p>
          </div>

          {/* Bottom Flourish */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-10 h-0.5 bg-[#374454]/25 dark:bg-[#C5A059]/40 rounded-full" />
            <span className="text-[#C5A059] text-xs">✦</span>
            <div className="w-10 h-0.5 bg-[#374454]/25 dark:bg-[#C5A059]/40 rounded-full" />
          </div>
        </div>

        {/* Luxury "View Our Story & Proposal" Pill */}
        <div className="mt-5 text-center">
          <button
            onClick={onOpenStory}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFFBF0] dark:bg-[#1c1716] hover:bg-[#FAF5EB] border border-[#374454]/25 dark:border-[#C5A059]/40 shadow-xs text-[#374454] dark:text-stone-200 text-xs font-editorial italic tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] group-hover:rotate-12 transition-transform" />
            <span>View Our Story &amp; Proposal in 6 Moments</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF5EB] dark:bg-black/30 border border-[#374454]/20 text-[#8C1D24] dark:text-[#E0A899]">
              ✨ 6 Photos
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
