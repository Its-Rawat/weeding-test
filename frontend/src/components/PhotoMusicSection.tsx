import React from "react";
import { Sparkles, Heart, Camera } from "lucide-react";
import type { AppConfig } from "../types";
import { Skiper16CardStack, type StackPhoto } from "./ui/skiper-ui/skiper16";

export const PhotoMusicSection: React.FC<{ config?: AppConfig }> = ({ config }) => {
  // Use admin config gallery if provided, otherwise our curated wedding photo story
  const photos: StackPhoto[] = React.useMemo(() => {
    if (config?.gallery && Array.isArray(config.gallery) && config.gallery.length > 0) {
      return config.gallery.map((g, idx) => ({
        id: g.id || `photo-${idx}`,
        title: g.caption || `Memory 0${idx + 1}`,
        tag: `Chapter 0${idx + 1} • Memory`,
        caption: g.subCaption || "A timeless moment cherished in our journey.",
        src: g.src,
      }));
    }
    return [
      {
        id: "photo-1",
        tag: "Chapter 01 • The Beginning",
        title: "The Proposal",
        caption: "Where two separate journeys softly converged into one lifelong path.",
        src: "/couple/proposal_story.jpg",
      },
      {
        id: "photo-2",
        tag: "Chapter 02 • The Promise",
        title: "Ring Reveal & Eternal Yes",
        caption: "A spark of light beneath the starry bridge, sealing tomorrow.",
        src: "/couple/ring_reveal.jpg",
      },
      {
        id: "photo-3",
        tag: "Chapter 03 • Serenity",
        title: "Winter in the Snowy Pines",
        caption: "Warm smiles amidst freezing mountain air and snow-draped evergreens.",
        src: "/couple/snow_winter.jpg",
      },
      {
        id: "photo-4",
        tag: "Chapter 04 • Adventures",
        title: "Wanderlust & Horizons",
        caption: "Exploring vibrant cityscapes, golden sunsets, and distant horizons together.",
        src: "/couple/travel_fun.jpg",
      },
      {
        id: "photo-5",
        tag: "Chapter 05 • Candid Magic",
        title: "Street Joy & Tuk-Tuk Rides",
        caption: "The unscripted laughter and spontaneous joy that brightens every ordinary day.",
        src: "/couple/tuktuk_candid.jpg",
      },
      {
        id: "photo-6",
        tag: "Chapter 06 • Royal Nuptials",
        title: "Chandrika & Xudong",
        caption: "Stepping into forever with open hearts, blessed by family and timeless love.",
        src: "/couple/formal_portrait.jpg",
      },
    ];
  }, [config?.gallery]);

  return (
    <section
      id="photo-music"
      className="relative py-14 sm:py-20 px-4 sm:px-6 bg-[#FAF5EB] dark:bg-darkBg text-[#231C18] dark:text-[#FAF5EB] border-t border-[#D4AF37]/30 overflow-visible overflow-x-clip transition-colors duration-700"
    >
      {/* Ambient Gradient Lighting */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#D4AF37]/20 via-[#F7D8A5]/10 to-transparent blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#8C1D24]/15 via-[#D4AF37]/10 to-transparent blur-[120px]" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] dark:bg-darkSurface border border-[#D4AF37]/50 shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#8C1D24] dark:text-[#FFE082]" />
            <span className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#8C6B1C] dark:text-[#FFE082]">
              Captured Moments
            </span>
          </div>

          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#231C18] dark:text-white font-normal">
            Moments in Love
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#5A4D43] dark:text-stone-300 max-w-md mx-auto leading-relaxed">
            Every photograph holds a heartbeat of our journey together. Scroll down to explore our story in frames.
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full mt-2" />
        </div>

        {/* Skiper UI (skiper16) Card Stack Scroll */}
        <Skiper16CardStack photos={photos} />
      </div>
    </section>
  );
};

export default PhotoMusicSection;
