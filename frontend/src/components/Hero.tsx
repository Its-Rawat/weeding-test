import React, { useState, useEffect } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import type { AppConfig } from "../types";

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
}) => {
  const [guestName, setGuestName] = useState<string | null>(personalizedGuestName || null);

  useEffect(() => {
    if (personalizedGuestName) {
      setGuestName(personalizedGuestName);
    } else {
      const params = new URLSearchParams(window.location.search);
      setGuestName(params.get("to"));
    }
  }, [personalizedGuestName]);

  const handleScrollToCelebrations = () => {
    const cd = document.getElementById("countdown");
    if (cd) {
      cd.scrollIntoView({ behavior: "smooth" });
    } else {
      document.getElementById("event")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Only guests with special RSVP code containing Mehendi (14th Feb) see 14 & 15 Feb.
  // Default visitors with NO code see 15th Feb.
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
      className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden text-center text-white select-none"
    >
      {/* 1. Full-Bleed Background Couple Image on the Resort Bridge */}
      <div className="absolute inset-0 z-0">
        <img
          src="/couple/resort_bridge_night.jpg"
          alt="Chandrika & Xudong"
          className="w-full h-full object-cover object-[center_35%] scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Vignette & Dark Overlay inspired by Boutique Weddings */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/85" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/70 pointer-events-none" />
      </div>

      {/* 2. Top Monogram & Eyebrow */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-3 pt-2 sm:pt-4">
        {/* Monogram Crest */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#E5C378]/70 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-lg mb-1">
          <span className="font-serif font-light text-sm sm:text-base text-[#E5C378] tracking-widest">
            C &amp; X
          </span>
        </div>

        {/* Boutique Weddings Tagline with Em-Dashes */}
        <p className="text-[11px] sm:text-xs font-sans tracking-[0.35em] text-[#E5C378] uppercase font-semibold">
          — The Wedding Celebration of —
        </p>
      </div>

      {/* 3. Central Editorial Typography Overlay */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-5 my-auto py-6">
        {/* Grand Couple Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.18em] uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-tight">
          {config.couple.bride.name}
          <span className="font-script lowercase text-3xl sm:text-5xl md:text-6xl text-[#E5C378] mx-2 sm:mx-3 tracking-normal inline-block">
            &amp;
          </span>
          {config.couple.groom.name}
        </h1>

        {/* Subtitle with Boutique Weddings Em-Dashes */}
        <p className="font-serif italic text-base sm:text-xl text-[#FAF5EB]/90 tracking-wide max-w-lg mx-auto">
          — joyfully invite you to celebrate our union —
        </p>

        {/* Auspicious Parent Blessings */}
        <div className="space-y-1 pt-1">
          <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#FAF5EB]/75">
            With the blessings of our parents
          </p>
          <p className="font-serif text-xs sm:text-sm text-[#E5C378] tracking-widest uppercase font-medium">
            The Rawat &amp; Wang Families
          </p>
        </div>

        {/* Personalized Guest Badge (if guestName is present) */}
        {guestName && (
          <div className="mt-1 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#E5C378]/40 shadow-lg">
            <Sparkles className="w-3 h-3 text-[#E5C378]" />
            <span className="font-serif italic text-xs sm:text-sm text-white">
              Warmly welcoming <strong className="font-semibold text-[#E5C378]">{guestName}</strong>
            </span>
          </div>
        )}

        {/* Date & Time Lockup (Boutique Weddings Clean Architectural Card) */}
        <div className="my-3 py-4 sm:py-5 px-6 sm:px-12 border-y border-white/25 max-w-md mx-auto backdrop-blur-[4px] bg-black/25 rounded-2xl space-y-1 shadow-2xl">
          <p className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.4em] text-[#E5C378] uppercase">
            {dayLabel}
          </p>
          <div className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-[0.1em] leading-none my-1">
            {dateNumeral} <span className="text-xl sm:text-3xl text-[#FAF5EB]/90">{monthYearLabel}</span>
          </div>
          <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-white/80 pt-1">
            {timeString}
          </p>
        </div>

        {/* Venue & Location */}
        <div className="space-y-1">
          <h3 className="font-serif font-light text-base sm:text-xl text-white tracking-[0.2em] uppercase">
            {venueName}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#FAF5EB]/80 max-w-md mx-auto tracking-wide font-light">
            {sharedAddress}
          </p>
        </div>
      </div>

      {/* 4. Boutique Weddings Style Action Button & Animated Mouse Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-5 pb-2 sm:pb-4">
        <button
          onClick={handleScrollToCelebrations}
          className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-[#E5C378]/70 backdrop-blur-md text-white text-xs font-sans font-medium uppercase tracking-[0.25em] transition-all duration-300 shadow-xl cursor-pointer"
        >
          <span>Explore Celebrations</span>
          <ChevronDown className="w-4 h-4 text-[#E5C378] group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Boutique Weddings Animated Mouse Scroll Indicator */}
        <div
          onClick={handleScrollToCelebrations}
          className="flex flex-col items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          title="Scroll to explore"
        >
          <div className="w-5 h-8 sm:w-6 sm:h-9 border-2 border-white/70 rounded-full flex justify-center pt-1.5 shadow-sm">
            <div className="w-1 h-2 bg-[#E5C378] rounded-full animate-bounce" />
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-white/70">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
