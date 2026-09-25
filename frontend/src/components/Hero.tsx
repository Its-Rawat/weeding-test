import React, { useState, useEffect } from "react";
import { ChevronDown, Sparkles, Calendar, MapPin, Heart } from "lucide-react";
import type { AppConfig } from "../types";

const Hero: React.FC<{ config: AppConfig }> = ({ config }) => {
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGuestName(params.get("to"));
  }, []);

  const handleScrollToCelebrations = () => {
    document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" }) ||
    document.getElementById("event")?.scrollIntoView({ behavior: "smooth" });
  };

  // Extract day name, day number, month and year
  const eventDate = config.events.akad.startDateTime;
  const dayName = config.events.akad.day || "Saturday";
  const dayNumber = String(eventDate.getDate()).padStart(2, "0");
  const monthName = eventDate.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const yearNumber = eventDate.getFullYear();
  const timeString = "AT FOUR-THIRTY IN THE AFTERNOON";

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center py-8 sm:py-14 px-4 bg-gradient-to-b from-[#F7F2EC] via-[#FDFBF7] to-[#F7F2EC] overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#d4af37]/15 via-[#f8c2c9]/10 to-transparent rounded-full blur-3xl -z-10" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* THE ARCHED FORMAL INVITATION CARD matching video frame 00:04 - 00:06 */}
        <div className="relative w-full bg-[#FFFDF9] rounded-t-[140px] sm:rounded-t-[190px] md:rounded-t-[220px] rounded-b-3xl border-2 border-[#d4af37]/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] p-6 sm:p-10 md:p-12 text-center overflow-hidden transition-all duration-300">
          
          {/* Ornate Inner Double Filigree Arch Border */}
          <div className="absolute inset-2.5 sm:inset-3 rounded-t-[130px] sm:rounded-t-[175px] md:rounded-t-[205px] rounded-b-2xl border border-[#d4af37]/30 pointer-events-none" />

          {/* Delicate Botanical Floral Watercolor Garland at the top of the Arch */}
          <div className="pt-2 sm:pt-4 mb-4 flex flex-col items-center">
            
            {/* Top Monogram Crest */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#d4af37] bg-gradient-to-b from-[#FAF5EE] to-[#FFFDF9] shadow-sm flex flex-col items-center justify-center p-1 mb-3">
              <span className="font-serif font-bold text-base sm:text-lg text-[#8C6B1C] tracking-tight">
                C &amp; X
              </span>
            </div>

            {/* Floral garland icon accent */}
            <div className="inline-flex items-center gap-2 text-xs text-[#9e7241] tracking-widest uppercase font-serif">
              <span>🌸</span>
              <span className="text-[10px] tracking-[0.25em]">Royal Nuptials</span>
              <span>🌸</span>
            </div>
          </div>

          {/* Formal Request Copy */}
          <div className="space-y-1.5 sm:space-y-2 mb-6">
            <p className="font-serif italic text-stone-600 text-xs sm:text-sm">
              With the blessings of our parents
            </p>
            <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#9e7241] uppercase">
              The Verma &amp; Wang Families
            </p>
            <p className="font-serif text-xs sm:text-sm text-stone-600 italic max-w-sm mx-auto leading-relaxed pt-1">
              Request the pleasure of your company at the celebration of the marriage of
            </p>
          </div>

          {/* Grand Couple Title */}
          <div className="my-4 sm:my-6">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
              {config.couple.bride.name}
            </h1>
            <span className="font-script text-3xl sm:text-4xl text-[#d4af37] block my-0.5">
              &amp;
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
              {config.couple.groom.name}
            </h1>
          </div>

          {guestName && (
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/10 text-stone-800 font-serif italic text-xs border border-[#d4af37]/30">
                Warmly welcoming {guestName}
              </span>
            </div>
          )}

          {/* EDITORIAL CALENDAR NUMERAL LOCKUP matching video frame 00:05 */}
          <div className="my-6 py-4 border-y border-[#d4af37]/40 max-w-xs mx-auto">
            <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.35em] text-stone-600 uppercase mb-1">
              {dayName}
            </p>
            <div className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-stone-900 leading-none my-1 tracking-tight">
              {dayNumber}
            </div>
            <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.35em] text-stone-600 uppercase mt-1">
              {monthName} {yearNumber}
            </p>
            <p className="font-serif italic text-stone-500 text-xs mt-2">
              {timeString}
            </p>
          </div>

          {/* Venue & Location */}
          <div className="space-y-1.5 my-4">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 tracking-wide uppercase">
              {config.venue.name || "The Oberoi Udaivilas"}
            </h3>
            <p className="font-serif italic text-stone-600 text-xs sm:text-sm">
              {config.hero.city || "Udaipur, Rajasthan, India"}
            </p>
            <p className="font-sans text-[10px] tracking-[0.2em] font-semibold text-[#9e7241] uppercase pt-2">
              Reception &amp; Celebrations to follow
            </p>
          </div>

          {/* Bottom Flourish */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-10 h-0.5 bg-[#d4af37]/40 rounded-full" />
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <div className="w-10 h-0.5 bg-[#d4af37]/40 rounded-full" />
          </div>

        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-6 text-center animate-bounce">
          <button
            onClick={handleScrollToCelebrations}
            className="group inline-flex flex-col items-center text-stone-600 hover:text-stone-900 transition-colors"
            title="Scroll to explore celebrations"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9e7241] mb-1">
              Scroll to explore celebrations
            </span>
            <div className="w-9 h-9 rounded-full bg-white border border-[#d4af37]/40 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronDown className="w-4 h-4 text-[#d4af37]" />
            </div>
          </button>
        </div>

      </div>

    </section>
  );
};

export default Hero;
