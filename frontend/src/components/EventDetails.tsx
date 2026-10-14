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
  const [slideDirection, setSlideDirection] = React.useState<"right" | "left">("right");
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const touchStartXRef = React.useRef(0);
  const touchStartYRef = React.useRef(0);

  const goToTab = (newIndex: number) => {
    if (newIndex === activeTabIndex || newIndex < 0 || newIndex >= displayCeremonies.length) return;
    setSlideDirection(newIndex > activeTabIndex ? "right" : "left");
    setActiveTabIndex(newIndex);
  };

  const handleAddToCalendar = (evt: CelebrationEvent) => {
    const isWedding =
      evt.key === "WEDDING" ||
      evt.title.toLowerCase().includes("wedding");
    const title = isWedding ? "Wedding Ceremony" : evt.title.replace(/\s*\(.*(Phera|Sacred).*\)/gi, "").trim();
    const calendarEvent = {
      title: `Chandrika & Xudong Wedding: ${title}`,
      description: `${evt.subtitle.replace(/sacred pheras/gi, "wedding ceremony").replace(/pheras/gi, "ceremony")}\nVenue: ${evt.venueName}`,
      location: `${evt.venueName}, ${evt.venueAddress}`,
      startTime: new Date(evt.startIso),
      endTime: new Date(evt.endIso),
    };
    window.open(generateGoogleCalendarUrl(calendarEvent), "_blank");
  };

  const isMultiEvent = displayCeremonies.length > 1;

  // Modern physical touch swipe support with live drag feedback
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    // If gesture is mostly vertical, let normal page scrolling take precedence
    if (Math.abs(diffY) > Math.abs(diffX) * 1.2 && Math.abs(diffX) < 15) {
      return;
    }

    // Apply elastic resistance at boundary ends
    let offset = diffX;
    if (
      (activeTabIndex === 0 && diffX > 0) ||
      (activeTabIndex === displayCeremonies.length - 1 && diffX < 0)
    ) {
      offset = diffX * 0.35;
    }
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 35;
    if (dragOffset < -threshold && activeTabIndex < displayCeremonies.length - 1) {
      goToTab(activeTabIndex + 1);
    } else if (dragOffset > threshold && activeTabIndex > 0) {
      goToTab(activeTabIndex - 1);
    }
    setDragOffset(0);
  };

  // Helper to render a ceremony article
  const renderCeremony = (evt: CelebrationEvent, index: number, isSingleView: boolean) => {
    const isWedding =
      evt.key === "WEDDING" ||
      evt.title.toLowerCase().includes("wedding");
    const isMehendi = evt.key === "MEHENDI" || evt.title.toLowerCase().includes("mehendi");
    const isHaldi = evt.key === "HALDI" || evt.title.toLowerCase().includes("haldi");

    const eventTitle = cleanEventTitle(evt.title, isWedding, isMultiEvent);
    const eventSubtitle = cleanEventSubtitle(evt.subtitle, isWedding);
    const badgeText = getEventBadge(evt.key, index);

    // Dynamic Admin-Configurable Timings with fallbacks
    const baraatTime = config.ceremonyTimings?.baraat || evt.baraatTime || "07:00 PM";
    const weddingTime = config.ceremonyTimings?.wedding || evt.weddingTime || "08:30 PM";
    const haldiTime = config.ceremonyTimings?.haldi || (isHaldi ? evt.time : "10:00 AM onwards");
    const mehendiTime = config.ceremonyTimings?.mehendi || (isMehendi ? evt.time : "04:00 PM onwards");

    return (
      <article
        key={evt.id}
        className="w-full text-center space-y-8 sm:space-y-10"
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

        {/* 2. Date & Time Axis (Dynamic Admin-Configurable Timings) */}
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
                  {baraatTime}
                </p>
              </div>

              <div className="h-8 w-[1px] bg-[#E2D8C9] dark:bg-white/15"></div>

              <div className="text-center">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#8F2837] dark:text-[#FFB4AB]">
                  Wedding Ceremony
                </span>
                <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#8F2837] dark:text-[#FFB4AB] mt-0.5">
                  {weddingTime}
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-2 text-center">
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#9E7D46] dark:text-[#D4AF37]">
                Ceremony Timing
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#191410] dark:text-[#FAF5EB] mt-0.5">
                {isHaldi ? haldiTime : isMehendi ? mehendiTime : evt.time}
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
        </section>

        {/* 4. Understated Action Bar */}
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
      className="relative py-14 sm:py-20 px-4 sm:px-8 bg-[#FAF5EB] dark:bg-darkBg overflow-hidden transition-colors duration-1000 select-none"
    >
      {/* Editorial Container (Zero cards, zero container boxes, completely seamless) */}
      <div className="w-full max-w-2xl mx-auto space-y-8 sm:space-y-12 relative z-10">

        {/* Multi-ceremony header (Sacred Itinerary removed) */}
        {isMultiEvent && (
          <header className="text-center space-y-2 pb-2">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-[#9E7D46] dark:text-[#D4AF37]">
              Celebrations
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

        {/* COMPACT VIEW MODE (MODERN FLUID TABS & PHYSICAL SWIPE) */}
        {isMultiEvent && (
          <div
            className="space-y-8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Interactive Luxury Segmented Tab Switcher with Golden Crimson Aura */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 rounded-full bg-[#EFE7D8]/80 dark:bg-white/5 border border-[#D4AF37]/40 shadow-xs max-w-md mx-auto">
              {displayCeremonies.map((evt, idx) => {
                const isActive = idx === activeTabIndex;
                const label = evt.key === "MEHENDI" ? "Mehendi" : evt.key === "HALDI" ? "Haldi" : "Wedding";
                const icon = evt.key === "MEHENDI" ? "🌿" : evt.key === "HALDI" ? "🌼" : "👑";
                const dateShort = evt.key === "MEHENDI" ? "14 Feb" : "15 Feb";

                return (
                  <button
                    key={evt.id}
                    onClick={() => goToTab(idx)}
                    className={`flex-1 min-w-0 py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-full text-xs sm:text-sm font-sans transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer relative group ${
                      isActive
                        ? "bg-gradient-to-r from-[#8C1D24] via-[#A8232B] to-[#B71C1C] text-white shadow-[0_4px_16px_rgba(140,29,36,0.3)] font-bold scale-[1.02] border border-[#FFD54F]/70"
                        : "text-[#5A4D43] dark:text-stone-300 font-medium hover:text-[#8C1D24] dark:hover:text-[#D4AF37] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                    }`}
                  >
                    <span className="text-sm transition-transform duration-300 group-hover:scale-110">{icon}</span>
                    <span className="truncate">{label}</span>
                    <span className="text-[10px] opacity-75 font-normal hidden sm:inline">({dateShort})</span>
                  </button>
                );
              })}
            </div>

            {/* Modern Animated Ceremony Slide (Hardware-accelerated fluid motion) */}
            <div className="overflow-hidden w-full relative min-h-[360px]">
              <div
                key={activeCeremony.id}
                className={`w-full will-change-transform ${
                  slideDirection === "right" ? "ceremony-slide-right" : "ceremony-slide-left"
                }`}
                style={
                  isDragging
                    ? {
                        transform: `translate3d(${dragOffset}px, 0, 0) scale(${1 - Math.min(0.04, Math.abs(dragOffset) * 0.0003)})`,
                        transition: "none",
                      }
                    : undefined
                }
              >
                {renderCeremony(activeCeremony, activeTabIndex, true)}
              </div>
            </div>

            {/* Compact Bottom Navigation: Prev / Next + Liquid Dot Indicators */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between border-t border-[#E2D8C9] dark:border-white/10 max-w-md mx-auto pt-4 text-xs uppercase font-sans tracking-wider">
                <button
                  onClick={() => goToTab(activeTabIndex - 1)}
                  disabled={activeTabIndex === 0}
                  className="px-3.5 py-1.5 rounded-full text-[#8C1D24] dark:text-[#D4AF37] disabled:opacity-20 disabled:pointer-events-none hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer font-bold active:scale-95"
                >
                  <span className="text-sm">←</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Liquid Expanding Dot Indicators */}
                <div className="flex items-center gap-2">
                  {displayCeremonies.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToTab(i)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        i === activeTabIndex
                          ? "w-7 bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] dark:from-[#D4AF37] dark:to-[#FFE082] shadow-xs"
                          : "w-2 bg-[#D4AF37]/40 dark:bg-white/20 hover:bg-[#D4AF37]/70"
                      }`}
                      aria-label={`Go to ceremony ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => goToTab(activeTabIndex + 1)}
                  disabled={activeTabIndex === displayCeremonies.length - 1}
                  className="px-3.5 py-1.5 rounded-full text-[#8C1D24] dark:text-[#D4AF37] disabled:opacity-20 disabled:pointer-events-none hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer font-bold active:scale-95"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SINGLE EVENT VIEW MODE: When guest token only allows 1 specific ceremony */}
        {!isMultiEvent && (
          <div className="space-y-12 sm:space-y-16">
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
