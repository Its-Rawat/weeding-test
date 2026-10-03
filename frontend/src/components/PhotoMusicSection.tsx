import React, { useState, useEffect } from "react";
import { MusicCard } from "@/components/ui/music-card";
import { WheelCarousel, type WheelCarouselItem } from "@/components/ui/wheel-carousel";
import { Music, Sparkles, Disc3, Radio, ChevronLeft, ChevronRight } from "lucide-react";
import type { AppConfig } from "../types";

interface Track {
  id: string;
  title: string;
  shortLabel: string;
  artist: string;
  poster: string;
  src: string;
  mainColor: string;
  tag: string;
}

const WEDDING_PLAYLIST: Track[] = [
  {
    id: "track-1",
    title: "Kudmayi • Royal Symphony",
    shortLabel: "Kudmayi • Royal Symphony",
    artist: "Shahid Mallya • Traditional Sitar",
    poster: "/couple/formal_portrait.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#D4AF37",
    tag: "Formal Portrait",
  },
  {
    id: "track-2",
    title: "Din Shagna Da • Bridal Walk",
    shortLabel: "Din Shagna Da • Bridal Walk",
    artist: "Jasleen Royal • Shenai Melody",
    poster: "/couple/proposal_story.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#8C1D24",
    tag: "The Proposal",
  },
  {
    id: "track-3",
    title: "Kesariya • Sacred Promise",
    shortLabel: "Kesariya • Sacred Promise",
    artist: "Arijit Singh • Flute & Acoustic",
    poster: "/couple/ring_reveal.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#B38E38",
    tag: "Ring Reveal",
  },
  {
    id: "track-4",
    title: "Mast Magan • Wanderlust",
    shortLabel: "Mast Magan • Wanderlust",
    artist: "Arijit Singh • Rhythmic Tabla",
    poster: "/couple/travel_fun.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#D9822B",
    tag: "Travel Memories",
  },
  {
    id: "track-5",
    title: "Tum Se Hi • Snowy Pines",
    shortLabel: "Tum Se Hi • Snowy Pines",
    artist: "Mohit Chauhan • Serene Chords",
    poster: "/couple/snow_winter.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#3B82F6",
    tag: "Winter Trails",
  },
  {
    id: "track-6",
    title: "Gallan Goodiyaan • Street Joy",
    shortLabel: "Gallan Goodiyaan • Street Joy",
    artist: "Shankar Mahadevan • Dhol Folk",
    poster: "/couple/tuktuk_candid.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#E11D48",
    tag: "TukTuk Candid",
  },
];

const CAROUSEL_ITEMS: WheelCarouselItem[] = WEDDING_PLAYLIST.map((t) => ({
  label: t.shortLabel,
  image: t.poster,
  imageAlt: `${t.title} - ${t.tag}`,
}));

export const PhotoMusicSection: React.FC<{ config?: AppConfig }> = () => {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const currentTrack = WEDDING_PLAYLIST[activeTrackIndex];

  return (
    <section
      id="photo-music"
      className="relative py-16 sm:py-24 px-4 sm:px-6 bg-[#FAF5EB] dark:bg-darkBg text-[#231C18] dark:text-[#FAF5EB] border-t border-[#D4AF37]/30 overflow-hidden transition-colors duration-700"
    >
      {/* 2026 Ambient Golden Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#8C1D24]/10 blur-3xl" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9] dark:bg-darkSurface border border-[#D4AF37]/50 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-[#8C1D24] dark:text-accent animate-pulse" />
            <span className="font-sans text-[10.5px] font-bold tracking-[0.25em] uppercase text-[#8C6B1C] dark:text-accent">
              Melodies &amp; Memories • 2026 Soundscape
            </span>
          </div>

          <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#231C18] dark:text-white font-normal">
            Moments in Melody
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#5A4D43] dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Every snapshot carries a song. Spin or swipe the wheel to discover our favorite wedding melodies paired with our journey.
          </p>

          <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto rounded-full mt-2" />
        </div>

        {/* Compact Level-2026 Stage: Song Player Card + Song Wheel Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: The MusicCard Player */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Outer Golden Aura Ring */}
              <div
                className="absolute -inset-1.5 rounded-3xl opacity-50 blur-lg transition duration-500 group-hover:opacity-100"
                style={{ backgroundColor: currentTrack.mainColor }}
              />

              <MusicCard
                key={currentTrack.id}
                src={currentTrack.src}
                poster={currentTrack.poster}
                title={currentTrack.title}
                artist={currentTrack.artist}
                mainColor={currentTrack.mainColor}
                autoPlay={false}
                className="relative shadow-2xl"
              />
            </div>

            {/* Quick Track Switcher Pills */}
            <div className="mt-4 flex items-center justify-between w-full max-w-[20rem] px-2 text-[#231C18] dark:text-slate-200">
              <button
                type="button"
                onClick={() =>
                  setActiveTrackIndex(
                    (prev) => (prev - 1 + WEDDING_PLAYLIST.length) % WEDDING_PLAYLIST.length
                  )
                }
                className="inline-flex items-center gap-1 text-xs font-serif px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#FFFDF9] dark:bg-darkSurface hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>

              <span className="text-[11px] font-serif italic text-[#8C6B1C] dark:text-accent flex items-center gap-1.5">
                <Disc3 className="w-3.5 h-3.5 animate-spin text-[#8C1D24] dark:text-accent" />
                Track {activeTrackIndex + 1} of {WEDDING_PLAYLIST.length}
              </span>

              <button
                type="button"
                onClick={() =>
                  setActiveTrackIndex((prev) => (prev + 1) % WEDDING_PLAYLIST.length)
                }
                className="inline-flex items-center gap-1 text-xs font-serif px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#FFFDF9] dark:bg-darkSurface hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition cursor-pointer shadow-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Song Wheel Carousel */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="relative rounded-3xl bg-[#FFFDF9]/90 dark:bg-darkSurface/90 border border-[#D4AF37]/40 shadow-xl p-4 sm:p-6 overflow-hidden backdrop-blur-md">
              {/* Header inside Wheel Box */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#D4AF37]/25">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#8C1D24] dark:text-accent" />
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#231C18] dark:text-white">
                    Wedding Melody Wheel
                  </h3>
                </div>
                <span className="text-[10px] sm:text-[11px] font-sans tracking-wider uppercase text-[#8C6B1C] dark:text-accent font-semibold">
                  Spin • Swipe • Select
                </span>
              </div>

              {/* The Wheel Carousel Component */}
              <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center">
                <WheelCarousel
                  items={CAROUSEL_ITEMS}
                  mode="custom"
                  background="transparent"
                  panelColor={
                    isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(212, 175, 55, 0.08)"
                  }
                  textColor={
                    isDark
                      ? "rgba(250, 245, 235, 0.40)"
                      : "rgba(90, 77, 67, 0.45)"
                  }
                  selectedColor={isDark ? "#D4AF37" : "#8C1D24"}
                  markerColor="#D4AF37"
                  markerSize={14}
                  markerGap={16}
                  photoSide="left"
                  photoWidth={34}
                  photoAspect="3/4"
                  photoRadius={16}
                  radius={240}
                  spacing={18}
                  visibleItems={5}
                  apexInset={28}
                  activeIndex={activeTrackIndex}
                  onActiveChange={(_item, index) => setActiveTrackIndex(index)}
                  className="h-full min-h-[340px]"
                  itemClassName="font-serif text-xs sm:text-sm md:text-base font-semibold"
                />
              </div>

              {/* Interactive Helper Hint */}
              <div className="mt-3 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-[#5A4D43] dark:text-slate-400 font-sans">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C1D24] dark:text-accent shrink-0" />
                  Scroll mouse wheel or drag up/down to rotate tracks
                </span>
                <span className="hidden sm:inline font-serif italic text-[11px] text-[#8C6B1C] dark:text-accent">
                  {currentTrack.tag}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoMusicSection;
