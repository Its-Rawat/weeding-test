import React from "react";
import type { AppConfig, CelebrationEvent } from "../types";
import { DEFAULT_CEREMONIES } from "../utils/configParser";
import { generateGoogleCalendarUrl } from "../utils/calendarUtils";

interface EventDetailsProps {
  config: AppConfig;
  allowedEvents?: string[] | null;
  guestName?: string | null;
}

const normalizeEvent = (e: string): string => {
  const upper = e.trim().toUpperCase();
  if (upper.includes("MEH")) return "MEHENDI";
  if (upper.includes("HALD")) return "HALDI";
  if (upper.includes("WED") || upper.includes("PHERA") || upper.includes("BARAAT")) return "WEDDING";
  return upper;
};

const cleanEventTitle = (title: string, isWedding: boolean, isMultiEvent: boolean) => {
  if (isWedding) {
    if (!isMultiEvent) return "Our Wedding Ceremony";
    return "Wedding Ceremony";
  }
  return title.replace(/\s*\(.*(Phera|Sacred).*\)/gi, "").trim();
};

const cleanEventSubtitle = (subtitle: string, isWedding: boolean) => {
  if (isWedding) {
    return "Baraat • Wedding Nuptials";
  }
  return subtitle.replace(/sacred pheras/gi, "wedding ceremony").replace(/pheras/gi, "ceremony").trim();
};

const getEventBadge = (key: string, index: number) => {
  const upper = key.toUpperCase();
  if (upper.includes("MEH")) return "🌿 Ceremony 01 • Mehendi";
  if (upper.includes("HALD")) return "🌼 Ceremony 02 • Haldi";
  if (upper.includes("WED")) return "👑 Ceremony 03 • Wedding Ceremony";
  return `✨ Celebration 0${index + 1}`;
};

const EventDetails: React.FC<EventDetailsProps> = ({ config, allowedEvents, guestName }) => {
  // DB-driven celebrations with fallback
  const ceremonies: CelebrationEvent[] =
    config.celebrations && config.celebrations.length > 0
      ? config.celebrations
      : DEFAULT_CEREMONIES;

  const normalizedAllowed =
    allowedEvents && allowedEvents.length > 0
      ? allowedEvents.map(normalizeEvent)
      : null;

  // If user enters with a personalized RSVP token with restricted allowedEvents, show only their allowed ceremonies.
  // On root endpoint / general invitation (https://chandrikawedsxudong.com/), show all ceremonies (Mehendi, Haldi, Wedding) in the compact tabs!
  const displayCeremonies =
    normalizedAllowed && normalizedAllowed.length > 0
      ? ceremonies.filter((c) => normalizedAllowed.includes(c.key))
      : ceremonies;

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<"tabs" | "list">("tabs");
  const touchStartXRef = React.useRef(0);

  const handleAddToCalendar = (evt: CelebrationEvent) => {
    const isWedding =
      evt.key === "WEDDING" ||
      evt.title.toLowerCase().includes("wedding");
    const title = isWedding ? "Wedding Ceremony" : evt.title.replace(/\s*\(.*(Phera|Sacred).*\)/gi, "").trim();
    const calendarEvent = {
      title: `Chandrika & Xudong Wedding: ${title}`,
      description: `${evt.subtitle.replace(/sacred pheras/gi, "wedding ceremony").replace(/pheras/gi, "ceremony")}\n\nDress Code: ${evt.dressCode}\nVenue: ${evt.venueName}`,
      location: `${evt.venueName}, ${evt.venueAddress}`,
      startTime: new Date(evt.startIso),
      endTime: new Date(evt.endIso),
    };
    window.open(generateGoogleCalendarUrl(calendarEvent), "_blank");
  };

  const isMultiEvent = displayCeremonies.length > 1;

  // Touch swipe support for switching ceremonies seamlessly on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;
    if (deltaX > 45 && activeTabIndex < displayCeremonies.length - 1) {
      setActiveTabIndex((prev) => prev + 1);
    } else if (deltaX < -45 && activeTabIndex > 0) {
      setActiveTabIndex((prev) => prev - 1);
    }
  };

  // Helper to render a ceremony article
  const renderCeremony = (evt: CelebrationEvent, index: number, isSingleView: boolean) => {
    const isWedding =
      evt.key === "WEDDING" ||
      evt.title.toLowerCase().includes("wedding");

    const eventTitle = cleanEventTitle(evt.title, isWedding, isMultiEvent);
    const eventSubtitle = cleanEventSubtitle(evt.subtitle, isWedding);
    const badgeText = getEventBadge(evt.key, index);

    return (
      <article
        key={evt.id}
        className={`w-full text-center space-y-8 sm:space-y-10 transition-opacity duration-300 ${
          isSingleView ? "animate-reveal" : ""
        }`}
      >
        {/* 1. Editorial Header & Chapter Badge */}
        <header className="space-y-3">
          {isMultiEvent && (
            <div className="flex justify-center pb-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] uppercase bg-[#FAF5EB] dark:bg-[#1A1414] text-[#8C1D24] dark:text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs">
                <span>{badgeText}</span>
              </span>
            </div>
          )}

          <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#191410] dark:text-[#FAF5EB] tracking-tight leading-none">
            {eventTitle}
          </h3>
          <p className="text-xs sm:text-sm font-sans font-medium tracking-[0.3em] uppercase text-[#8F2837] dark:text-[#FFB4AB]">
            {eventSubtitle}
          </p>
        </header>

        {/* 2. Date & Time Axis (Anchored by hairline borders only, no card container) */}
        <section className="py-8 border-y border-[#E2D8C9] dark:border-white/15 space-y-6">
          {/* Date */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#9E7D46] dark:text-[#D4AF37]">
              Date
            </span>
            <p className="text-xl sm:text-2xl font-serif font-medium text-[#191410] dark:text-[#FAF5EB] mt-1">
              {evt.dayDate}
            </p>
          </div>

          {/* Baraat & Wedding Timings (or single timing for Haldi / Mehendi) */}
          {isWedding ? (
            <div className="flex items-center justify-center gap-8 sm:gap-16 pt-2">
              <div className="text-center">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#9E7D46] dark:text-[#D4AF37]">
                  Baraat
                </span>
                <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#191410] dark:text-[#FAF5EB] mt-0.5">
                  07:00 <span className="text-xs font-sans font-normal text-stone-500 dark:text-stone-400">PM</span>
                </p>
              </div>

              <div className="h-8 w-[1px] bg-[#E2D8C9] dark:bg-white/15"></div>

              <div className="text-center">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#8F2837] dark:text-[#FFB4AB]">
                  Wedding Ceremony
                </span>
                <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#8F2837] dark:text-[#FFB4AB] mt-0.5">
                  08:30 <span className="text-xs font-sans font-normal text-stone-500 dark:text-stone-400">PM</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-2 text-center">
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#9E7D46] dark:text-[#D4AF37]">
                Ceremony Timing
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#191410] dark:text-[#FAF5EB] mt-0.5">
                {evt.time.replace(/Pheras:/gi, "Ceremony:").replace(/Pheras/gi, "Ceremony")}
              </p>
            </div>
          )}
        </section>

        {/* 3. Venue & Destination */}
        <section className="space-y-2 max-w-md mx-auto">
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#9E7D46] dark:text-[#D4AF37]">
            Destination
          </span>
          <h4 className="text-xl sm:text-2xl font-serif font-semibold text-[#191410] dark:text-[#FAF5EB] leading-snug">
            {evt.venueName}
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
            {evt.venueAddress}
          </p>

          {evt.dressCode && (
            <div className="pt-3">
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#9E7D46] dark:text-[#D4AF37] block">
                Attire
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-[#5A4D43] dark:text-[#E0D5C7] mt-0.5">
                {evt.dressCode}
              </p>
            </div>
          )}
        </section>

        {/* 4. Understated Action Bar (Minimalist Links - Zero button boxes) */}
        <footer className="pt-4 flex items-center justify-center gap-6 text-xs sm:text-sm tracking-wider uppercase font-semibold">
          <button
            onClick={() => handleAddToCalendar(evt)}
            className="text-[#191410] dark:text-[#FAF5EB] py-1 border-b border-[#191410] dark:border-[#FAF5EB] hover:text-[#8F2837] hover:border-[#8F2837] dark:hover:text-[#FFB4AB] dark:hover:border-[#FFB4AB] transition-all cursor-pointer bg-transparent"
          >
            + Add to Calendar
          </button>
          <span className="text-stone-300 dark:text-stone-600 font-light">&bull;</span>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(evt.venueName + " " + evt.venueAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8F2837] dark:text-[#FFB4AB] py-1 border-b border-[#8F2837] dark:border-[#FFB4AB] hover:opacity-80 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Map</span>
            <span className="text-[11px]">↗</span>
          </a>
        </footer>
      </article>
    );
  };

  const activeCeremony = displayCeremonies[activeTabIndex] || displayCeremonies[0];

  return (
    <section
      id="event"
      className="relative py-14 sm:py-20 px-4 sm:px-8 bg-[#FAF5EB] dark:bg-darkBg overflow-hidden transition-colors duration-1000"
    >
      {/* Editorial Container (Zero cards, zero container boxes, completely seamless) */}
      <div className="w-full max-w-2xl mx-auto space-y-8 sm:space-y-12 relative z-10">

        {/* Multi-ceremony header */}
        {isMultiEvent && (
          <header className="text-center space-y-2 pb-2">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-[#9E7D46] dark:text-[#D4AF37]">
              Sacred Itinerary
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#191410] dark:text-[#FAF5EB] tracking-tight">
              The Wedding Celebrations
            </h2>
            {guestName && (
              <p className="text-xs sm:text-sm font-serif italic text-[#8F2837] dark:text-[#E5A8AD] pt-0.5">
                Specially curated for {guestName}
              </p>
            )}
            <div className="w-16 h-[1px] bg-[#E2D8C9] dark:bg-white/15 mx-auto mt-3" />
          </header>
        )}

        {/* COMPACT VIEW MODE (TABS): Shows all ceremonies in 1 screen / few scrolls */}
        {isMultiEvent && viewMode === "tabs" && (
          <div className="space-y-8" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {/* Interactive Luxury Segmented Tab Switcher */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 rounded-full bg-[#EFE7D8]/80 dark:bg-white/5 border border-[#D4AF37]/40 shadow-xs max-w-md mx-auto">
              {displayCeremonies.map((evt, idx) => {
                const isActive = idx === activeTabIndex;
                const label = evt.key === "MEHENDI" ? "Mehendi" : evt.key === "HALDI" ? "Haldi" : "Wedding";
                const icon = evt.key === "MEHENDI" ? "🌿" : evt.key === "HALDI" ? "🌼" : "👑";
                const dateShort = evt.key === "MEHENDI" ? "14 Feb" : "15 Feb";

                return (
                  <button
                    key={evt.id}
                    onClick={() => setActiveTabIndex(idx)}
                    className={`flex-1 min-w-0 py-1.5 sm:py-2 px-2 sm:px-3.5 rounded-full text-xs sm:text-sm font-sans transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] text-white shadow-md font-bold scale-[1.02] border border-[#FFD54F]/70"
                        : "text-[#5A4D43] dark:text-stone-300 font-medium hover:text-[#8C1D24] dark:hover:text-[#D4AF37] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{icon}</span>
                    <span className="truncate">{label}</span>
                    <span className="text-[10px] opacity-75 font-normal hidden sm:inline">({dateShort})</span>
                  </button>
                );
              })}
            </div>

            {/* Render the Currently Selected Ceremony */}
            <div key={activeCeremony.id} className="w-full">
              {renderCeremony(activeCeremony, activeTabIndex, true)}
            </div>

            {/* Compact Bottom Navigation: Prev / Next + Dots + Mobile Swipe Hint */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between border-t border-[#E2D8C9] dark:border-white/10 max-w-md mx-auto pt-4 text-xs uppercase font-sans tracking-wider">
                <button
                  onClick={() => setActiveTabIndex((p) => Math.max(0, p - 1))}
                  disabled={activeTabIndex === 0}
                  className="px-3 py-1.5 rounded-full text-[#8C1D24] dark:text-[#D4AF37] disabled:opacity-25 disabled:pointer-events-none hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Dot Indicators */}
                <div className="flex items-center gap-2">
                  {displayCeremonies.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTabIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === activeTabIndex
                          ? "w-6 bg-[#8C1D24] dark:bg-[#D4AF37]"
                          : "w-2 bg-[#D4AF37]/40 dark:bg-white/20 hover:bg-[#D4AF37]/70"
                      }`}
                      aria-label={`Go to ceremony ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveTabIndex((p) => Math.min(displayCeremonies.length - 1, p + 1))}
                  disabled={activeTabIndex === displayCeremonies.length - 1}
                  className="px-3 py-1.5 rounded-full text-[#8C1D24] dark:text-[#D4AF37] disabled:opacity-25 disabled:pointer-events-none hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span>→</span>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setViewMode("list")}
                  className="text-[11px] font-sans font-medium text-stone-500 hover:text-[#8C1D24] dark:text-stone-400 dark:hover:text-[#D4AF37] underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Prefer continuous scrolling? View all celebrations together ↓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FULL LIST VIEW MODE: Either single event OR user toggled to view all together */}
        {(!isMultiEvent || viewMode === "list") && (
          <div className="space-y-12 sm:space-y-16">
            {isMultiEvent && (
              <div className="text-center pb-2">
                <button
                  onClick={() => setViewMode("tabs")}
                  className="text-xs font-sans font-semibold text-[#8C1D24] dark:text-[#D4AF37] px-4 py-1.5 rounded-full border border-[#D4AF37]/50 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-all"
                >
                  ↑ Switch to compact 1-screen tab view
                </button>
              </div>
            )}

            {displayCeremonies.map((evt, index) => (
              <React.Fragment key={evt.id}>
                {index > 0 && (
                  <div
                    className="py-10 sm:py-16 flex items-center justify-center gap-3 sm:gap-6 select-none"
                    aria-hidden="true"
                  >
                    <div className="h-[1px] flex-1 max-w-[120px] sm:max-w-xs bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-[#D4AF37]/80 dark:via-[#D4AF37]/30 dark:to-[#D4AF37]/60" />
                    <div className="flex items-center gap-2 sm:gap-3 text-[#8C1D24] dark:text-[#D4AF37] px-2 sm:px-4">
                      <span className="text-[10px] sm:text-xs opacity-70">✦</span>
                      <span className="font-serif italic text-xs sm:text-sm tracking-[0.25em] text-[#8C6B1C] dark:text-[#D4AF37] font-medium uppercase">
                        ❧ &bull; ❧
                      </span>
                      <span className="text-[10px] sm:text-xs opacity-70">✦</span>
                    </div>
                    <div className="h-[1px] flex-1 max-w-[120px] sm:max-w-xs bg-gradient-to-l from-transparent via-[#D4AF37]/40 to-[#D4AF37]/80 dark:via-[#D4AF37]/30 dark:to-[#D4AF37]/60" />
                  </div>
                )}
                {renderCeremony(evt, index, false)}
              </React.Fragment>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default EventDetails;
