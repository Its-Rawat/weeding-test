import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Plus, ExternalLink, Check } from "lucide-react";
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
    <section id="event" className="py-16 sm:py-24 px-4 bg-[#F8F9FA] dark:bg-[#12151A] border-t border-[#D4AF37]/20 dark:border-white/10 transition-colors">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#967836] dark:text-[#D4AF37] tracking-widest uppercase font-serif font-medium mb-1">
            <span>🪷</span>
            <span>Itinerary &amp; Royal Functions</span>
            <span>🪷</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#1E242B] dark:text-white font-normal">
            The Celebrations
          </h2>
          {guestName && normalizedAllowed ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#1A1F26] border border-[#D4AF37]/60 text-xs sm:text-sm font-serif font-medium text-[#8C1D24] dark:text-[#FFE082] shadow-xs mt-3">
              <span>✨ Sacred Itinerary specially curated for <strong className="font-bold">{guestName}</strong></span>
            </div>
          ) : (
            <p className="font-sans text-xs text-[#4B5563] dark:text-stone-300 max-w-md mx-auto mt-2 leading-relaxed">
              Please join us across two joyous days of love, music, and sacred traditions.
            </p>
          )}
          <div className="w-16 h-0.5 bg-[#D4AF37]/40 rounded-full mx-auto mt-3" />
        </div>

        {/* Ceremony Cards Stack */}
        <div className="space-y-6 sm:space-y-8">
          {displayCeremonies.map((evt, idx) => (
            <div
              key={evt.id}
              className="bg-[#FFFFFF] dark:bg-[#1A1F26] rounded-3xl border border-[#D4AF37]/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-lg transition-all duration-300 p-5 sm:p-7 relative overflow-hidden"
            >
              {/* Top Accent Icon & Function Number */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 dark:border-white/10 pb-3 mb-4">
                <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-[#F8F9FA] dark:bg-[#12151A] border border-[#D4AF37]/30 dark:border-white/10 flex items-center justify-center">
                  {evt.illustration}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C1D24] dark:text-[#FFE082] font-bold bg-[#F8F9FA] dark:bg-[#12151A] px-3 py-1 rounded-full border border-[#D4AF37]/35 dark:border-white/10">
                  Function 0{idx + 1}
                </span>
              </div>

              {/* Ceremony Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E242B] dark:text-white tracking-tight">
                {evt.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#967836] dark:text-[#D4AF37] font-serif italic mt-0.5 mb-4">
                "{evt.subtitle}"
              </p>

              {/* Date, Time & Venue Block */}
              <div className="bg-[#F8F9FA] dark:bg-[#14181F] rounded-2xl p-4 border border-[#D4AF37]/30 dark:border-white/10 space-y-2 text-xs sm:text-sm text-[#1E242B] dark:text-stone-200 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8C1D24] shrink-0" />
                  <span className="font-semibold text-[#1E242B] dark:text-white">{evt.dayDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#967836] dark:text-[#D4AF37] shrink-0" />
                  <span className="font-medium text-[#4B5563] dark:text-stone-300">{evt.time}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-[#D4AF37]/20 dark:border-white/10">
                  <MapPin className="w-4 h-4 text-[#8C1D24] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#1E242B] dark:text-white">{evt.venueName}</span>
                    <span className="text-[11px] text-[#4B5563] dark:text-stone-400 font-light block">{evt.venueAddress}</span>
                  </div>
                </div>
              </div>

              {/* Dress Code Tag */}
              <div className="mb-5 flex items-center gap-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#967836] dark:text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded border border-[#D4AF37]/30 shrink-0">
                  Attire
                </span>
                <span className="text-[#4B5563] dark:text-stone-300 font-medium italic truncate">{evt.dressCode}</span>
              </div>

              {/* Action Buttons: Add to Calendar & Directions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAddToCalendar(evt)}
                  className="flex-1 py-2.5 px-3 bg-[#F8F9FA] hover:bg-[#EDEFF2] dark:bg-[#12151A] dark:hover:bg-[#1F2530] text-[#1E242B] dark:text-white rounded-xl border border-[#D4AF37]/50 dark:border-white/15 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors active:scale-98 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#967836] dark:text-[#D4AF37]" />
                  <span>Add to Calendar</span>
                </button>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(evt.venueName + " " + evt.venueAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#9A1616] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FFE082]" />
                  <span>Map</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventDetails;
