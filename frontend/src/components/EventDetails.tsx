import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Plus, Copy, Check } from "lucide-react";
import type { AppConfig, CelebrationEvent } from "../types";
import { DEFAULT_CEREMONIES } from "../utils/configParser";
import { generateGoogleCalendarUrl } from "../utils/calendarUtils";
import { EtchingFrameCorners } from "./ui/EtchingCorner";

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

const getCeremonyIllustration = (key: string): string => {
  switch (key) {
    case "MEHENDI":
      return "/illustrations/mehendi_etching.jpg";
    case "HALDI":
      return "/illustrations/haldi_etching.jpg";
    case "WEDDING":
    default:
      return "/illustrations/wedding_etching.jpg";
  }
};

const EventDetails: React.FC<EventDetailsProps> = ({ config, allowedEvents, guestName }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // DB-driven celebrations with fallback
  const ceremonies: CelebrationEvent[] =
    config.celebrations && config.celebrations.length > 0
      ? config.celebrations
      : DEFAULT_CEREMONIES;

  const normalizedAllowed =
    allowedEvents && allowedEvents.length > 0
      ? allowedEvents.map(normalizeEvent)
      : null;

  const displayCeremonies = normalizedAllowed
    ? ceremonies.filter((c) => normalizedAllowed.includes(c.key))
    : ceremonies;

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

  const handleCopyVenue = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="event"
      className="relative py-20 sm:py-32 px-4 bg-[#FFFBF0] dark:bg-[#151111] border-t border-[#374454]/15 dark:border-[#C5A059]/20 overflow-hidden transition-colors duration-1000"
    >
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Section Title (Huey Lightshop Editorial Aesthetic) */}
        <div className="text-center mb-14 sm:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-[#8C1D24] dark:text-[#C5A059] tracking-[0.25em] uppercase font-sans font-semibold">
            <span>🪷</span>
            <span>Itinerary &amp; Sacred Traditions</span>
            <span>🪷</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl text-[#232B35] dark:text-white font-normal tracking-tight">
            The Celebrations
          </h2>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
            <span className="text-[#C5A059] text-xs">✦</span>
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
          </div>

          {guestName && normalizedAllowed ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5EB] dark:bg-[#251e1c] border border-[#374454]/20 text-xs sm:text-sm font-editorial font-medium text-[#8C1D24] dark:text-[#E0A899] shadow-2xs mt-2">
              <span>✨ Sacred Itinerary specially curated for <strong className="font-semibold">{guestName}</strong></span>
            </div>
          ) : (
            <p className="font-editorial italic text-sm sm:text-base text-[#556272] dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              Please join us across two joyous days of love, music, and sacred Indian ceremonies.
            </p>
          )}
        </div>

        {/* Ceremony Cards Stack with Hand-Drawn Etching Artwork */}
        <div className="space-y-10 sm:space-y-14">
          {displayCeremonies.map((evt) => {
            const illustrationSrc = getCeremonyIllustration(evt.key);

            return (
              <div
                key={evt.id}
                className="relative bg-[#FFFBF0] dark:bg-[#1c1716] rounded-2xl border border-[#374454]/20 dark:border-[#C5A059]/30 shadow-[0_12px_45px_-10px_rgba(55,68,84,0.09)] transition-all duration-300 overflow-hidden"
              >
                <EtchingFrameCorners color="#374454" size={26} className="opacity-35 dark:opacity-20" />

                {/* Architectural Etching Art Banner */}
                <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden border-b border-[#374454]/20 dark:border-[#C5A059]/30 bg-[#FFFBF0] group">
                  <img
                    src={illustrationSrc}
                    alt={evt.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60" />

                  {/* Date Badge on Image */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBF0]/95 dark:bg-[#151111]/90 backdrop-blur-md border border-[#374454]/30 text-xs font-editorial italic text-[#374454] dark:text-stone-200 font-semibold shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#8C1D24]" />
                      {evt.dayDate}
                    </span>
                  </div>

                  {/* Title overlay in image banner */}
                  <div className="absolute bottom-4 left-4 right-4 text-[#FFFBF0] z-10">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-0.5">
                      Ceremony
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal drop-shadow-md">
                      {evt.title}
                    </h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-8 space-y-5">
                  <p className="text-sm sm:text-base text-[#556272] dark:text-stone-300 font-editorial italic leading-relaxed">
                    "{evt.subtitle}"
                  </p>

                  {/* Time & Venue Information Box */}
                  <div className="bg-[#FAF5EB] dark:bg-[#251e1c] rounded-xl p-4 sm:p-5 border border-[#374454]/15 dark:border-[#C5A059]/20 space-y-3 text-xs sm:text-sm text-[#232B35] dark:text-stone-200">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#8C1D24] shrink-0" />
                      <span className="font-medium">{evt.time}</span>
                    </div>

                    <div className="flex items-start gap-2.5 pt-2 border-t border-[#374454]/10 dark:border-white/10">
                      <MapPin className="w-4 h-4 text-[#8C1D24] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#232B35] dark:text-white">{evt.venueName}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyVenue(evt.id, `${evt.venueName}, ${evt.venueAddress}`)}
                            className="text-[10px] uppercase font-bold text-[#374454] dark:text-[#C5A059] flex items-center gap-1 hover:underline ml-2"
                            title="Copy address"
                          >
                            {copiedId === evt.id ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === evt.id ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                        <span className="text-[11px] text-[#556272] dark:text-stone-400 block mt-0.5 font-editorial italic">
                          {evt.venueAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dress Code Tag */}
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#374454] dark:text-[#C5A059] bg-[#FAF5EB] dark:bg-black/30 px-3 py-1 rounded border border-[#374454]/20 shrink-0">
                      Attire
                    </span>
                    <span className="text-[#556272] dark:text-stone-300 font-editorial italic truncate">
                      {evt.dressCode}
                    </span>
                  </div>

                  {/* Narrative ceremony description */}
                  {evt.desc && (
                    <p className="text-xs sm:text-sm text-[#556272] dark:text-stone-400 font-editorial italic leading-relaxed pt-1 border-t border-[#374454]/10 dark:border-white/5">
                      {evt.desc}
                    </p>
                  )}

                  {/* Action Buttons: Add to Calendar & Map Directions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleAddToCalendar(evt)}
                      className="flex-1 py-3 px-4 bg-[#FAF5EB] hover:bg-[#F3E7D5] dark:bg-black/30 text-[#374454] dark:text-stone-200 rounded-xl border border-[#374454]/30 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8C1D24]" />
                      <span>Add to Calendar</span>
                    </button>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(evt.venueName + " " + evt.venueAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-6 bg-[#374454] hover:bg-[#232B35] text-[#FFFBF0] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Directions</span>
                    </a>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default EventDetails;
