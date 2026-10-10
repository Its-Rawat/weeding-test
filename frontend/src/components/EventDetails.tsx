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

  // If user enters WITHOUT RSVP code, only show Function 3 (Wedding only).
  // If user enters with RSVP code, show only their allowed ceremonies.
  const displayCeremonies = normalizedAllowed
    ? ceremonies.filter((c) => normalizedAllowed.includes(c.key))
    : ceremonies.filter(
        (c) =>
          c.key === "WEDDING" ||
          c.id === 3 ||
          c.title.toLowerCase().includes("wedding")
      );

  const handleAddToCalendar = (evt: CelebrationEvent) => {
    const calendarEvent = {
      title: `Chandrika & Xudong Wedding: ${evt.title}`,
      description: `${evt.subtitle}\n\nDress Code: ${evt.dressCode}\nVenue: ${evt.venueName}`,
      location: `${evt.venueName}, ${evt.venueAddress}`,
      startTime: new Date(evt.startIso),
      endTime: new Date(evt.endIso),
    };
    window.open(generateGoogleCalendarUrl(calendarEvent), "_blank");
  };

  const isMultiEvent = displayCeremonies.length > 1;

  return (
    <section
      id="event"
      className="relative py-16 sm:py-24 px-4 sm:px-8 bg-[#FAF5EB] dark:bg-darkBg overflow-hidden transition-colors duration-1000"
    >
      {/* Editorial Container (Zero cards, zero container boxes, completely seamless) */}
      <div className="w-full max-w-2xl mx-auto space-y-12 sm:space-y-16 relative z-10">

        {/* Multi-ceremony header (rendered only when guest is invited to multiple events like Mehendi & Haldi) */}
        {isMultiEvent && (
          <header className="text-center space-y-2 pb-4">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-[#9E7D46] dark:text-[#D4AF37]">
              Sacred Itinerary
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#191410] dark:text-[#FAF5EB] tracking-tight">
              The Wedding Celebrations
            </h2>
            {guestName && (
              <p className="text-xs sm:text-sm font-serif italic text-[#8F2837] dark:text-[#E5A8AD] pt-1">
                Specially curated for {guestName}
              </p>
            )}
            <div className="w-16 h-[1px] bg-[#E2D8C9] dark:bg-white/15 mx-auto mt-4" />
          </header>
        )}

        {/* Ceremonies List: Magazine Editorial Layout */}
        {displayCeremonies.map((evt, index) => {
          const isWedding =
            evt.key === "WEDDING" ||
            evt.title.toLowerCase().includes("wedding") ||
            evt.title.toLowerCase().includes("phera");

          return (
            <article
              key={evt.id}
              className={`w-full text-center space-y-8 sm:space-y-10 ${
                index > 0 ? "pt-12 sm:pt-16 border-t border-[#E2D8C9] dark:border-white/10" : ""
              }`}
            >
              {/* 1. Editorial Header */}
              <header className="space-y-3">
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#191410] dark:text-[#FAF5EB] tracking-tight leading-none">
                  {isWedding && !isMultiEvent ? "Our Wedding Ceremony" : evt.title}
                </h3>
                <p className="text-xs sm:text-sm font-sans font-medium tracking-[0.3em] uppercase text-[#8F2837] dark:text-[#FFB4AB]">
                  {isWedding ? "Baraat • Pheras" : evt.subtitle}
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

                {/* Baraat & Pheras Timings (or single timing for Haldi / Mehendi) */}
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
                        Pheras
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
                      {evt.time}
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
        })}

      </div>
    </section>
  );
};

export default EventDetails;
