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
    <section id="invitation" className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center py-8 sm:py-14 px-4 bg-gradient-to-b from-[#FAF5EB] via-[#FFFDF9] to-[#FAF5EB] overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#F7D8A5]/20 to-transparent rounded-full blur-3xl -z-10" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* THE ARCHED FORMAL INVITATION CARD matching video frame 00:04 - 00:06 */}
        <div className="relative w-full bg-[#FFFDF9] rounded-t-[140px] sm:rounded-t-[190px] md:rounded-t-[220px] rounded-b-3xl border-2 border-[#D4AF37]/70 shadow-[0_20px_60px_-15px_rgba(140,107,28,0.15)] p-6 sm:p-10 md:p-12 text-center overflow-hidden transition-all duration-300">
          
          {/* Ornate Inner Double Filigree Arch Border */}
          <div className="absolute inset-2.5 sm:inset-3 rounded-t-[130px] sm:rounded-t-[175px] md:rounded-t-[205px] rounded-b-2xl border border-[#D4AF37]/35 pointer-events-none" />

          {/* Sacred Ganesha & Monogram Crest at the top of the Arch */}
          <div className="pt-2 sm:pt-4 mb-4 flex flex-col items-center">
            
            {/* Top Monogram Crest */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#FAF5EB] to-[#FFFDF9] shadow-sm flex flex-col items-center justify-center p-1 mb-2.5">
              <span className="font-royal font-bold text-base sm:text-lg text-[#8C6B1C] tracking-tight">
                C &amp; X
              </span>
            </div>

            {/* Auspicious Shubh Vivah accent */}
            <div className="inline-flex items-center gap-2 text-xs text-[#8C1D24] tracking-widest uppercase font-devanagari font-bold">
              <span>🪷</span>
              <span className="text-[11px] tracking-[0.2em]">॥ शुभ विवाह ॥</span>
              <span>🪷</span>
            </div>
          </div>

          {/* Formal Request Copy */}
          <div className="space-y-1.5 sm:space-y-2 mb-6">
            <p className="font-serif italic text-[#5A4D43] text-xs sm:text-sm">
              With the blessings of our parents
            </p>
            <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#8C6B1C] uppercase">
              The Verma &amp; Wang Families
            </p>
            <p className="font-serif text-xs sm:text-sm text-[#5A4D43] italic max-w-sm mx-auto leading-relaxed pt-1">
              Request the pleasure of your company at the celebration of the marriage of
            </p>
          </div>

          {/* Grand Couple Title */}
          <div className="my-4 sm:my-6">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#231C18] tracking-tight leading-tight">
              {config.couple.bride.name}
            </h1>
            <span className="font-script text-3xl sm:text-4xl text-[#D4AF37] block my-0.5">
              &amp;
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#231C18] tracking-tight leading-tight">
              {config.couple.groom.name}
            </h1>
          </div>

          {guestName && (
            <div className="mb-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#231C18] font-serif italic text-xs border border-[#D4AF37]/40 shadow-xs">
                Warmly welcoming <strong className="font-semibold text-[#8C1D24]">{guestName}</strong>
              </span>
            </div>
          )}

          {/* EDITORIAL CALENDAR NUMERAL LOCKUP matching video frame 00:05 */}
          <div className="my-6 py-4 border-y border-[#D4AF37]/50 max-w-xs mx-auto">
            <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#8C6B1C] uppercase mb-1">
              {dayName}
            </p>
            <div className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#231C18] leading-none my-1 tracking-tight">
              {dayNumber}
            </div>
            <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#8C6B1C] uppercase mt-1">
              {monthName} {yearNumber}
            </p>
            <p className="font-serif italic text-[#5A4D43] text-xs mt-2">
              {timeString}
            </p>
          </div>

          {/* Venue & Location */}
          <div className="space-y-1.5 my-4">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#231C18] tracking-wide uppercase">
              {config.venue.name || "The Oberoi Udaivilas"}
            </h3>
            <p className="font-serif italic text-[#8C6B1C] text-xs sm:text-sm">
              {config.hero.city || "Lake Pichola, Udaipur, Rajasthan, India"}
            </p>
            <p className="font-serif italic text-[11px] font-semibold text-[#8C1D24] pt-2">
              Warmly Hosted by Aditya Rawat &amp; Family
            </p>
          </div>

          {/* Bottom Flourish */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-10 h-0.5 bg-[#D4AF37]/50 rounded-full" />
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <div className="w-10 h-0.5 bg-[#D4AF37]/50 rounded-full" />
          </div>

        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-6 text-center animate-bounce">
          <button
            onClick={handleScrollToCelebrations}
            className="group inline-flex flex-col items-center text-[#5A4D43] hover:text-[#231C18] transition-colors cursor-pointer"
            title="Scroll to explore celebrations"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C6B1C] mb-1">
              Scroll to explore celebrations
            </span>
            <div className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </button>
        </div>

      </div>

    </section>
  );
};

export default Hero;
