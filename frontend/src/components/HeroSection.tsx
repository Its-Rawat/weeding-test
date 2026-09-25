import React from "react";
import { ChevronDown, Heart } from "lucide-react";

interface HeroSectionProps {
  coupleNames?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  coupleNames = "Aditya & Ananya",
}) => {
  const handleScroll = () => {
    document.getElementById("destination")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[100dvh] flex flex-col items-center justify-center py-12 sm:py-20 px-4 bg-[#FAF6EE] text-center overflow-hidden">
      {/* Decorative botanical spray in corners */}
      <div className="pointer-events-none absolute top-0 left-0 w-36 sm:w-56 h-36 sm:h-56 opacity-40">
        <div className="text-4xl sm:text-6xl p-4">🌿🌸</div>
      </div>
      <div className="pointer-events-none absolute top-0 right-0 w-36 sm:w-56 h-36 sm:h-56 opacity-40 text-right">
        <div className="text-4xl sm:text-6xl p-4">🌸🌿</div>
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* THE DECKLED FORMAL INVITATION CARD */}
        <div className="w-full bg-[#FFFDF9] rounded-t-[140px] sm:rounded-t-[200px] rounded-b-3xl border border-[#C5A059]/40 shadow-[0_20px_50px_rgba(74,47,20,0.08)] p-8 sm:p-14 text-center relative overflow-hidden transition-all duration-300">
          
          {/* Inner Filigree Arch */}
          <div className="absolute inset-3 rounded-t-[130px] sm:rounded-t-[188px] rounded-b-2xl border border-[#7D9D8B]/30 pointer-events-none" />

          {/* Top Monogram Seal */}
          <div className="pt-2 mb-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-[#8C7355] bg-[#FAF6EE] shadow-xs flex flex-col items-center justify-center p-1 mb-2">
              <span className="font-serif font-bold text-base text-[#722F37] tracking-tight">
                A &amp; A
              </span>
            </div>
            <span className="font-serif italic text-xs text-[#5C6B50] tracking-[0.25em] uppercase">
              Cap d'Antibes • Côte d'Azur
            </span>
          </div>

          {/* Request Copy */}
          <div className="space-y-1 mb-8">
            <p className="font-serif italic text-[#6B6155] text-xs sm:text-sm">
              With joyous hearts,
            </p>
            <p className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#5C6B50] uppercase">
              Together with their families
            </p>
          </div>

          {/* Grand Couple Headline */}
          <div className="my-6">
            <h1 className="font-serif text-4xl sm:text-6xl text-[#2A2F2B] font-normal tracking-tight leading-tight">
              {coupleNames}
            </h1>
          </div>

          {/* Invitation text */}
          <div className="space-y-1.5 my-6 max-w-md mx-auto">
            <p className="font-serif italic text-sm sm:text-base text-[#4A4238] leading-relaxed">
              request the pleasure of your company
            </p>
            <p className="font-serif italic text-sm sm:text-base text-[#4A4238] leading-relaxed">
              as they celebrate their wedding
            </p>
          </div>

          {/* Editorial Calendar Lockup */}
          <div className="my-8 py-5 border-y border-[#C5A059]/40 max-w-xs mx-auto">
            <p className="font-sans text-[11px] font-bold tracking-[0.35em] text-[#5C6B50] uppercase mb-1">
              SATURDAY
            </p>
            <div className="font-serif text-5xl sm:text-6xl font-bold text-[#2A2F2B] leading-none my-1 tracking-tight">
              26
            </div>
            <p className="font-sans text-[11px] font-bold tracking-[0.35em] text-[#5C6B50] uppercase mt-1">
              SEPTEMBER 2026
            </p>
            <p className="font-serif italic text-xs text-[#6B6155] mt-2">
              AT FIVE-THIRTY IN THE EVENING
            </p>
          </div>

          {/* Destination Teaser */}
          <div className="space-y-1">
            <p className="font-serif font-semibold text-sm sm:text-base text-[#2A2F2B] tracking-wide uppercase">
              Plage Keller • Cap d'Antibes
            </p>
            <p className="font-sans text-[11px] text-[#7D9D8B] uppercase tracking-[0.25em]">
              France
            </p>
          </div>

        </div>

        {/* Scroll Indicator */}
        <button
          onClick={handleScroll}
          className="mt-8 group flex flex-col items-center gap-1.5 text-[#5C6B50] transition-transform duration-300 hover:scale-105"
        >
          <span className="font-serif italic text-xs tracking-widest uppercase opacity-70 group-hover:opacity-100">
            Explore Destination &amp; Itinerary
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#C5A059]" />
        </button>

      </div>
    </section>
  );
};

export default HeroSection;
