import React, { useState } from "react";
import { MusicCard } from "@/components/ui/music-card";
import { Music, Sparkles, Heart, Disc3, Camera, Radio } from "lucide-react";
import type { AppConfig } from "../types";

interface Track {
  id: string;
  title: string;
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
    artist: "Shahid Mallya • Traditional Sitar",
    poster: "/couple/formal_portrait.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#D4AF37",
    tag: "Formal Portrait",
  },
  {
    id: "track-2",
    title: "Din Shagna Da • Bridal Walk",
    artist: "Jasleen Royal • Shenai Melody",
    poster: "/couple/proposal_story.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#8C1D24",
    tag: "The Proposal",
  },
  {
    id: "track-3",
    title: "Kesariya • Sacred Promise",
    artist: "Arijit Singh • Flute & Acoustic",
    poster: "/couple/ring_reveal.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#B38E38",
    tag: "Ring Reveal",
  },
  {
    id: "track-4",
    title: "Mast Magan • Wanderlust",
    artist: "Arijit Singh • Rhythmic Tabla",
    poster: "/couple/travel_fun.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#D9822B",
    tag: "Travel Memories",
  },
  {
    id: "track-5",
    title: "Tum Se Hi • Snowy Pines",
    artist: "Mohit Chauhan • Serene Chords",
    poster: "/couple/snow_winter.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#3B82F6",
    tag: "Winter Trails",
  },
  {
    id: "track-6",
    title: "Gallan Goodiyaan • Street Joy",
    artist: "Shankar Mahadevan • Dhol Folk",
    poster: "/couple/tuktuk_candid.jpg",
    src: "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    mainColor: "#E11D48",
    tag: "TukTuk Candid",
  },
];

export const PhotoMusicSection: React.FC<{ config?: AppConfig }> = () => {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const currentTrack = WEDDING_PLAYLIST[activeTrackIndex];

  return (
    <section
      id="photo-music"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF5EB] dark:bg-darkBg text-[#231C18] dark:text-[#FAF5EB] border-t border-[#D4AF37]/30 overflow-hidden transition-colors duration-1000"
    >
      {/* 2026 Background Ambient Radial Light Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#8C1D24]/10 blur-3xl" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9] dark:bg-darkSurface border border-[#D4AF37]/50 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-[#8C1D24] dark:text-accent animate-pulse" />
            <span className="font-sans text-[10.5px] font-bold tracking-[0.3em] uppercase text-[#8C6B1C] dark:text-accent">
              Melodies &amp; Memories • 2026 Soundscape
            </span>
          </div>

          <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#231C18] dark:text-white font-normal">
            Moments in Melody
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#5A4D43] dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Every snapshot carries a song. Tap any track to play our favorite wedding tunes accompanied by candid glimpses of our journey.
          </p>

          <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto rounded-full mt-3" />
        </div>

        {/* Level 2026 UI: Interactive Stage (MusicCard + Visual Track Showcase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: The 2026 Music Card Component (Prominent Showcase) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Outer Golden Aura Ring on Hover */}
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
                className="relative"
              />
            </div>

            <div className="mt-4 text-center">
              <span className="text-[11px] font-serif italic text-[#8C6B1C] dark:text-accent flex items-center justify-center gap-1.5">
                <Disc3 className="w-3.5 h-3.5 animate-spin text-[#8C1D24] dark:text-accent" />
                Track {activeTrackIndex + 1} of {WEDDING_PLAYLIST.length} • {currentTrack.tag}
              </span>
            </div>
          </div>

          {/* Right Column: Track & Photo Selectors (Interactive 2026 Playlist) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#8C1D24] dark:text-accent" />
                <h3 className="font-serif text-lg font-bold text-[#231C18] dark:text-white">
                  Chandrika &amp; Xudong's Wedding Playlist
                </h3>
              </div>
              <span className="text-[11px] font-sans text-[#8C6B1C] uppercase tracking-wider font-semibold">
                6 Memories
              </span>
            </div>

            {/* Track Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {WEDDING_PLAYLIST.map((track, idx) => {
                const isActive = idx === activeTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => setActiveTrackIndex(idx)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none ${
                      isActive
                        ? "bg-[#FFFDF9] dark:bg-darkSurface border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md scale-102"
                        : "bg-[#FFFDF9]/60 dark:bg-darkSurface/60 border-[#D4AF37]/30 hover:border-[#D4AF37]/70 hover:bg-[#FFFDF9] dark:hover:bg-darkSurface opacity-85 hover:opacity-100"
                    }`}
                  >
                    {/* Micro Thumbnail */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-inner">
                      <img
                        src={track.poster}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#8C1D24]/30 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white fill-white animate-ping" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block mb-0.5 bg-[#FAF5EB] dark:bg-darkBg border border-[#D4AF37]/30 text-[#8C6B1C]">
                        {track.tag}
                      </span>
                      <h4
                        className={`text-xs font-serif font-bold truncate ${
                          isActive
                            ? "text-[#8C1D24] dark:text-white"
                            : "text-[#231C18] dark:text-slate-200"
                        }`}
                      >
                        {track.title}
                      </h4>
                      <p className="text-[11px] font-sans text-[#5A4D43] dark:text-slate-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Romantic Quote Banner */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FFFDF9] dark:bg-darkSurface border border-[#D4AF37]/40 shadow-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#8C1D24] dark:text-accent shrink-0" />
              <p className="font-serif italic text-xs sm:text-sm text-[#5A4D43] dark:text-slate-300 leading-snug">
                "Where words fail, our wedding melodies speak. Put on your headphones and immerse in our celebration."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoMusicSection;
