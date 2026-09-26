import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Plus, ExternalLink, Check } from "lucide-react";
import type { AppConfig } from "../types";
import { generateGoogleCalendarUrl } from "../utils/calendarUtils";

const EventDetails: React.FC<{ config: AppConfig }> = ({ config }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Core royal celebrations matching the Gurgaon 14 & 15 February 2027 itinerary
  const ceremonies = [
    {
      id: 1,
      title: "Mehendi Ceremony",
      subtitle: "Adorning hands with henna, music & sweet celebration",
      dayDate: "Saturday, 14 February 2027",
      time: "04:00 PM onwards",
      venueName: "Royal Courtyard, The Club International",
      venueAddress: "Sector 109, Palam Vihar, Gurgaon, Haryana 122017",
      dressCode: "Vibrant Mehndi Greens & Pastel Florals",
      desc: "Welcoming our beloved guests as Chandrika adorns bridal henna, accompanied by live folk rhythms, traditional bangles artisan, and gourmet chaat stations.",
      illustration: "🌿",
      startIso: "2027-02-14T16:00:00+05:30",
      endIso: "2027-02-14T20:00:00+05:30",
    },
    {
      id: 2,
      title: "Haldi Ceremony",
      subtitle: "A splash of sunshine, laughter & turmeric blessings",
      dayDate: "Sunday, 15 February 2027",
      time: "10:00 AM onwards",
      venueName: "Poolside Pavilion, The Club International",
      venueAddress: "Sector 109, Palam Vihar, Gurgaon, Haryana 122017",
      dressCode: "Sunny Yellows, Ochre & Marigold Orange",
      desc: "An auspicious ceremony of turmeric paste blessings for Chandrika & Xudong, accompanied by celebratory dhol beats and a shower of fresh marigold and rose petals.",
      illustration: "🌼",
      startIso: "2027-02-15T10:00:00+05:30",
      endIso: "2027-02-15T13:00:00+05:30",
    },
    {
      id: 3,
      title: "Wedding Ceremony (Baraat & Sacred Pheras)",
      subtitle: "The sacred vows of love under the holy mandap",
      dayDate: "Sunday, 15 February 2027",
      time: "Baraat: 07:00 PM • Pheras: 08:30 PM",
      venueName: "The Grand Mandap, The Club International",
      venueAddress: "Sector 109, Palam Vihar, Gurgaon, Haryana 122017",
      dressCode: "Traditional Banarasi Silks & Regal Sherwanis",
      desc: "Xudong arrives with joyful baraat procession, followed by Chandrika's grand bridal entrance and the sacred seven pheras around the holy agni.",
      illustration: "🔥",
      startIso: "2027-02-15T19:00:00+05:30",
      endIso: "2027-02-15T22:00:00+05:30",
    },
    {
      id: 4,
      title: "Royal Reception & Dinner Banquet",
      subtitle: "Feast, celebratory toasts, dancing & joyous memories",
      dayDate: "Sunday, 15 February 2027",
      time: "09:30 PM onwards",
      venueName: "Grand Ballroom & Lawns, The Club International",
      venueAddress: "Sector 109, Palam Vihar, Gurgaon, Haryana 122017",
      dressCode: "Royal Festive Elegance / Formal Evening",
      desc: "An imperial celebratory banquet in honor of the newlyweds Chandrika & Xudong with music, gourmet feast, and blessings.",
      illustration: "🥂",
      startIso: "2027-02-15T21:30:00+05:30",
      endIso: "2027-02-15T23:59:00+05:30",
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
    <section id="event" className="py-16 sm:py-24 px-4 bg-[#FAF5EB] border-t border-[#D4AF37]/20">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#8C6B1C] tracking-widest uppercase font-serif font-medium mb-1">
            <span>🪷</span>
            <span>Itinerary &amp; Royal Functions</span>
            <span>🪷</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#231C18] font-normal">
            The Celebrations
          </h2>
          <p className="font-sans text-xs text-[#5A4D43] max-w-md mx-auto mt-2 leading-relaxed">
            Please join us across three days of love, music, and sacred traditions at The Oberoi Udaivilas.
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto mt-3 rounded-full" />
        </div>

        {/* Ceremony Cards Stack */}
        <div className="space-y-6 sm:space-y-8">
          {ceremonies.map((evt, idx) => (
            <div
              key={evt.id}
              className="bg-[#FFFDF9] rounded-3xl border border-[#D4AF37]/50 shadow-[0_8px_30px_rgba(140,107,28,0.08)] hover:shadow-lg transition-all duration-300 p-5 sm:p-7 relative overflow-hidden"
            >
              {/* Top Accent Icon & Function Number */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3 mb-4">
                <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-[#FAF5EB] border border-[#D4AF37]/40 flex items-center justify-center">
                  {evt.illustration}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C1D24] font-bold bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#D4AF37]/40">
                  Function 0{idx + 1}
                </span>
              </div>

              {/* Ceremony Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#231C18] tracking-tight">
                {evt.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8C6B1C] font-serif italic mt-0.5 mb-4">
                "{evt.subtitle}"
              </p>

              {/* Date, Time & Venue Block */}
              <div className="bg-[#FAF5EB] rounded-2xl p-4 border border-[#D4AF37]/35 space-y-2 text-xs sm:text-sm text-[#231C18] mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8C1D24] shrink-0" />
                  <span className="font-semibold text-[#231C18]">{evt.dayDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C6B1C] shrink-0" />
                  <span className="font-medium text-[#5A4D43]">{evt.time}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-[#D4AF37]/25">
                  <MapPin className="w-4 h-4 text-[#8C1D24] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#231C18]">{evt.venueName}</span>
                    <span className="text-[11px] text-[#5A4D43] font-light block">{evt.venueAddress}</span>
                  </div>
                </div>
              </div>

              {/* Dress Code Tag */}
              <div className="mb-5 flex items-center gap-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6B1C] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded border border-[#D4AF37]/30 shrink-0">
                  Attire
                </span>
                <span className="text-[#5A4D43] font-medium italic truncate">{evt.dressCode}</span>
              </div>

              {/* Action Buttons: Add to Calendar & Directions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAddToCalendar(evt)}
                  className="flex-1 py-2.5 px-3 bg-[#FAF5EB] hover:bg-[#F3E7D5] text-[#231C18] rounded-xl border border-[#D4AF37]/60 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors active:scale-98 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8C6B1C]" />
                  <span>Add to Calendar</span>
                </button>

                <a
                  href="https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
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
