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

  // Optimize mobile data: Only instantiate and load HD video element on desktop/tablet screens (>= 768px)
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      setIsDesktop(typeof window !== "undefined" && window.innerWidth >= 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section
      id="invitation"
      className="relative w-full h-screen h-[100svh] min-h-screen min-h-[100svh] flex flex-col justify-between items-center px-4 sm:px-8 pt-6 sm:pt-10 md:pt-14 pb-20 sm:pb-24 md:pb-12 overflow-hidden text-center select-none scroll-mt-0"
    >
      {/* 1. Full-Bleed Couple Media on the Resort Bridge:
          - Desktop / Laptop (>= 768px): Crisp HD Looping Video (gemini_generated_video_b0b01e67.mp4)
          - Mobile devices (< 768px): Vertical photo (randomly final1 or final2), saving 4.4MB on cellular data
      */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Desktop & Laptop Screens (PC, Laptop, iPad Landscape): High-Definition Video */}
        {isDesktop && (
          <div className="hidden md:block absolute inset-0 w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={selectedHeroImage}
              className="w-full h-full object-cover object-center"
            >
              <source src="/gemini_generated_video_b0b01e67.mp4" type="video/mp4" />
            </video>
          </div>
        )}

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
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-2 pt-4 sm:pt-8 md:pt-10 animate-reveal">
        {/* Line 1: We're getting married */}
        <p className="font-sans text-[10.5px] sm:text-xs md:text-sm font-semibold tracking-[0.35em] sm:tracking-[0.45em] text-[#FDE68A] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs text-[#F472B6]">🌸</span>
          <span>We&apos;re getting married</span>
          <span className="text-xs text-[#FBBF24]">✨</span>
        </p>

        {/* Line 2: Chandrika & Xudong (Grand Focal Headline) */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-[#FFFBF0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-tight flex items-center justify-center">
          <span className="bg-gradient-to-r from-white via-[#FFF5F7] to-[#FCE7F3] bg-clip-text text-transparent">Chandrika</span>
          <span className="font-script lowercase text-3xl sm:text-5xl md:text-6xl text-[#F472B6] mx-2 sm:mx-3 font-normal drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]">
            &amp;
          </span>
          <span className="bg-gradient-to-r from-[#FCE7F3] via-[#FFFBEB] to-white bg-clip-text text-transparent">Xudong</span>
        </h1>

        {/* Line 3: Auspicious Wedding Dates */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <span className="text-[10px] text-[#FDE047]/70">✨</span>
          <p className="font-sans text-xs sm:text-sm md:text-base tracking-[0.25em] sm:tracking-[0.3em] text-[#FDE68A] font-medium uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {formattedDate}
          </p>
          <span className="text-[10px] text-[#FDE047]/70">✨</span>
        </div>
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
