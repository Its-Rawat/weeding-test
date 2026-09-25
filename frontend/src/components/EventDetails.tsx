import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Plus, ExternalLink, Check } from "lucide-react";
import type { AppConfig } from "../types";
import { generateGoogleCalendarUrl } from "../utils/calendarUtils";

const EventDetails: React.FC<{ config: AppConfig }> = ({ config }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Full 6 royal celebrations matching the Udaipur royal itinerary
  const ceremonies = [
    {
      id: 1,
      title: "Ganesh Puja & Mehndi Carnival",
      subtitle: "Intricate Henna artistry & Rajasthani Folk Rhythms",
      dayDate: "Thursday, 26 November 2026",
      time: "3:00 PM onwards",
      venueName: "Courtyard Lawns, The Oberoi Udaivilas",
      venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
      dressCode: "Vibrant Mehndi Greens & Pastel Florals",
      desc: "Welcoming our beloved guests as Chandrika adorns bridal henna, accompanied by live folk singing, traditional bangles artisan, and street chaat counters.",
      illustration: "🌿",
      startIso: "2026-11-26T15:00:00+05:30",
      endIso: "2026-11-26T19:00:00+05:30",
    },
    {
      id: 2,
      title: "Haldi & Phoolon Ki Holi",
      subtitle: "Auspicious turmeric blessing with fragrant flower petals",
      dayDate: "Friday, 27 November 2026",
      time: "10:30 AM",
      venueName: "Poolside Pavilions, The Oberoi Udaivilas",
      venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
      dressCode: "Sunny Yellows, Ochre & Marigold Orange",
      desc: "A lively ceremony of turmeric paste blessings for Chandrika & Xudong, accompanied by dhol drums and a joyous shower of fresh marigold and rose petals.",
      illustration: "🌼",
      startIso: "2026-11-27T10:30:00+05:30",
      endIso: "2026-11-27T13:00:00+05:30",
    },
    {
      id: 3,
      title: "Sangeet & Cocktail Extravaganza",
      subtitle: "Jashn-e-Bahaar: High-energy dance, music & celebratory toasts",
      dayDate: "Friday, 27 November 2026",
      time: "7:30 PM onwards",
      venueName: "Grand Royal Ballroom & Terrace",
      venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
      dressCode: "Glitz, Shimmer & Indo-Western Glamour",
      desc: "Choreographed family dance performances celebrating the couple's love story, followed by signature cocktails, gourmet dining, and DJ music under the stars.",
      illustration: "✨",
      startIso: "2026-11-27T19:30:00+05:30",
      endIso: "2026-11-27T23:59:00+05:30",
    },
    {
      id: 4,
      title: "Baraat & Varmala (The Royal Entry)",
      subtitle: "Grand procession & exchange of sacred floral garlands",
      dayDate: "Saturday, 28 November 2026",
      time: "4:30 PM",
      venueName: "Palace Main Gates & Lake Promenade",
      venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
      dressCode: "Royal Heritage Safas & Banarasi Silks",
      desc: "Xudong arrives with royal fanfare and brass band, followed by Chandrika's breathtaking bridal entry by Lake Pichola and the sacred floral garland exchange.",
      illustration: "👑",
      startIso: "2026-11-28T16:30:00+05:30",
      endIso: "2026-11-28T18:00:00+05:30",
    },
    {
      id: 5,
      title: "Vivah Sanskar (Sacred 7 Phere)",
      subtitle: "Seven Vedic vows uniting two heritage cultures",
      dayDate: "Saturday, 28 November 2026",
      time: "6:30 PM (Auspicious Lagna Muhurat)",
      venueName: "The Lotus Mandap, Floating Deck",
      venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
      dressCode: "Traditional Banarasi Silks & Regal Sherwanis",
      desc: "The sacred nuptials performed around the holy agni under the starry Udaipur skies, invoking eternal blessings for Chandrika & Xudong.",
      illustration: "🔥",
      startIso: "2026-11-28T18:30:00+05:30",
      endIso: "2026-11-28T20:30:00+05:30",
    },
    {
      id: 6,
      title: "Royal Reception & Gala Banquet",
      subtitle: "Imperial feast with celebratory toasts & classical melodies",
      dayDate: "Saturday, 28 November 2026",
      time: "8:30 PM onwards",
      venueName: "Maharani Greens & Lakeview Lawn",
      venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
      dressCode: "Formal Evening Elegance / Black Tie",
      desc: "A multi-course royal banquet celebrating the newlyweds with champagne toasts, cake cutting, live classical sitar & flute, and dancing by the lake.",
      illustration: "🥂",
      startIso: "2026-11-28T20:30:00+05:30",
      endIso: "2026-11-28T23:59:00+05:30",
    },
  ];

  const handleAddToCalendar = (evt: typeof ceremonies[0]) => {
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
    <section id="event" className="py-16 sm:py-24 px-4 bg-[#FBF8F3]">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Title matching video frame 00:07 */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#9e7241] tracking-widest uppercase font-serif font-medium mb-1">
            <span>🌸</span>
            <span>Itinerary &amp; Functions</span>
            <span>🌸</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-stone-900 font-normal">
            The Celebrations
          </h2>
          <p className="font-sans text-xs text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
            Please join us across three days of love, music, and sacred traditions at The Oberoi Udaivilas.
          </p>
          <div className="w-16 h-0.5 bg-[#d4af37]/50 mx-auto mt-3 rounded-full" />
        </div>

        {/* Ceremony Cards Stack matching video frame 00:07 */}
        <div className="space-y-6 sm:space-y-8">
          {ceremonies.map((evt, idx) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-[#d4af37]/40 shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-7 relative overflow-hidden"
            >
              {/* Top Accent Icon & Function Number */}
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3 mb-4">
                <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-[#FAF5EE] border border-[#d4af37]/30 flex items-center justify-center">
                  {evt.illustration}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9e7241] font-bold bg-[#FAF5EE] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  Event 0{idx + 1}
                </span>
              </div>

              {/* Ceremony Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {evt.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5 mb-4">
                "{evt.subtitle}"
              </p>

              {/* Date, Time & Venue Block */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#d4af37]/30 space-y-2 text-xs sm:text-sm text-stone-800 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="font-semibold">{evt.dayDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="font-medium text-stone-700">{evt.time}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-[#d4af37]/20">
                  <MapPin className="w-4 h-4 text-[#9e7241] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{evt.venueName}</span>
                    <span className="text-[11px] text-stone-500 font-light block">{evt.venueAddress}</span>
                  </div>
                </div>
              </div>

              {/* Dress Code Tag */}
              <div className="mb-5 flex items-center gap-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9e7241] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 shrink-0">
                  Attire
                </span>
                <span className="text-stone-700 font-medium italic truncate">{evt.dressCode}</span>
              </div>

              {/* Action Buttons: Add to Calendar & Directions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAddToCalendar(evt)}
                  className="flex-1 py-2.5 px-3 bg-[#FAF5EE] hover:bg-[#F3EBE0] text-stone-800 rounded-xl border border-[#d4af37]/50 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors active:scale-98 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Add to Calendar</span>
                </button>

                <a
                  href="https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors active:scale-98 shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
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
