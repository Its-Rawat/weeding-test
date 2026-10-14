import React from "react";
import type { AppConfig } from "../types";

interface HeroProps {
  config: AppConfig;
  personalizedGuestName?: string | null;
  allowedEvents?: string[] | null;
  onOpenStory?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  allowedEvents,
}) => {
  // On root endpoint / general invitation (https://chandrikawedsxudong.com/), or for guests invited to Mehendi,
  // show 14 & 15 February 2027.
  // Only show 15 February 2027 if a personalized token is present and explicitly excludes Mehendi.
  const isExplicitlyWeddingOnly = Boolean(
    allowedEvents && allowedEvents.length > 0 && !allowedEvents.some((e) => e.toUpperCase().includes("MEH"))
  );
  const show14And15 = !isExplicitlyWeddingOnly;
  const formattedDate = show14And15 ? "14 & 15 February 2027" : "15 February 2027";

  // Randomly select between final1 and final2 on each page load/reload
  const [selectedHeroImage] = React.useState(() => {
    return Math.random() < 0.5 ? "/couple/final1.jpg" : "/couple/final2.jpg";
  });

  return (
    <section
      id="invitation"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-4 sm:px-8 py-6 sm:py-10 md:py-14 overflow-hidden text-center select-none scroll-mt-0"
    >
      {/* 1. Full-Bleed Couple Media on the Resort Bridge:
          - Desktop / Laptop (>= 768px): Crisp HD Looping Video (gemini_generated_video_b0b01e67.mp4)
          - Mobile devices (< 768px): Vertical photo (randomly final1 or final2)
      */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Desktop & Laptop Screens (PC, Laptop, iPad Landscape): High-Definition Video */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={selectedHeroImage}
            className="w-full h-full object-cover object-center"
          >
            <source src="/gemini_generated_video_b0b01e67.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Mobile Screens (Phone portrait): Vertical HD photo (randomly final1 or final2) */}
        <div className="block md:hidden absolute inset-0 w-full h-full">
          <img
            src={selectedHeroImage}
            alt="Chandrika & Xudong"
            className="w-full h-full object-cover object-[center_35%]"
          />
        </div>

        {/* Luxury Vignette Scrim:
            - Darkened top night sky so top text is crystal-clear
            - Soft transparent center so Bride & Groom faces and bodies are fully visible and illuminated
            - Darkened bottom deck for the closing quote */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/15 to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* 2. TOP SECTION (In the dark night sky above Bride & Groom's heads) */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-2.5 pt-4 sm:pt-8 md:pt-10 animate-reveal">
        {/* Line 1: We're getting married */}
        <p className="font-sans text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.35em] sm:tracking-[0.45em] text-[#E5C378] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          We&apos;re getting married
        </p>

        {/* Line 2: Chandrika & Xudong | [Date] */}
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.06em] sm:tracking-[0.08em] text-[#FFFBF0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-tight flex flex-wrap items-center justify-center">
          <span>Chandrika</span>
          <span className="font-script lowercase text-2xl sm:text-4xl md:text-5xl text-[#E5C378] mx-1.5 sm:mx-2.5 font-normal">
            &amp;
          </span>
          <span>Xudong</span>
          <span className="mx-2 sm:mx-3 text-[#E5C378]/70 font-sans font-light text-lg sm:text-3xl">
            |
          </span>
          <span className="font-sans text-xs sm:text-sm md:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-[#E5C378] font-light uppercase align-middle whitespace-nowrap">
            {formattedDate}
          </span>
        </h1>
      </div>

      {/* 3. CENTER SPACER: Intentionally empty so Bride & Groom's smiling faces, engagement ring, and bodies are 100% visible */}
      <div className="flex-1 pointer-events-none" />

      {/* 4. BOTTOM SECTION (Along the wooden bridge deck below their bodies) */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center pb-4 sm:pt-4 sm:pb-8 md:pb-10 px-4 animate-reveal">
        <p className="font-serif italic text-base sm:text-xl md:text-2xl lg:text-3xl font-light text-[#FAF5EB] tracking-wide leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] max-w-xl mx-auto">
          &ldquo;A beautiful beginning, made even more special with you.&rdquo;
        </p>
      </div>
    </section>
  );
};

export default Hero;
