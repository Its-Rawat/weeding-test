import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Volume2, VolumeX, Sparkles, ArrowDown } from "lucide-react";
import type { AppConfig } from "../types";

interface VideoLandingProps {
  config: AppConfig;
}

const VideoLanding: React.FC<VideoLandingProps> = ({ config }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const handleMusicState = (e: any) => {
      if (e.detail?.isPlaying !== undefined) {
        setIsPlayingMusic(e.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleMusicState);

    // Attempt video play immediately on mount
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay muted fallback:", err);
      });
    }

    return () => {
      window.removeEventListener("wedding-music-state", handleMusicState);
    };
  }, []);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
    // Also trigger background wedding music / Shehnai
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const handleScrollDown = () => {
    const target =
      document.getElementById("invitation") ||
      document.getElementById("countdown") ||
      document.getElementById("event");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const brideName = config?.couple?.bride?.name || "Chandrika";
  const groomName = config?.couple?.groom?.name || "Xudong";

  return (
    <section
      id="video-hero"
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-black flex flex-col justify-between select-none"
    >
      {/* 100% FULL SCREEN CINEMATIC VIDEO */}
      <video
        ref={videoRef}
        src="/wedding_invitation.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onClick={handleToggleSound}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {/* TOP VIGNETTE FOR NAVIGATION LEGIBILITY */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-10" />

      {/* FLOATING SOUND PILL (TAP TO UNMUTE) */}
      <div className="relative z-20 pt-24 sm:pt-28 px-4 flex justify-center pointer-events-auto">
        <button
          onClick={handleToggleSound}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-[#D4AF37]/60 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] text-xs font-serif transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isMuted && !isPlayingMusic ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-amber-100 font-medium">
                आवाज़ चालू करें • Tap for Music &amp; Shehnai
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#8C1D24] animate-pulse" />
              <span className="text-amber-200 font-medium">
                Wedding Shehnai Playing 🪷
              </span>
            </>
          )}
        </button>
      </div>

      {/* BOTTOM VIGNETTE & CALLIGRAPHY / SCROLL CUE */}
      <div className="relative z-20 pb-8 sm:pb-12 px-4 flex flex-col items-center text-center bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-20 pointer-events-auto">
        {/* Sacred Lord Ganesha Shloka */}
        <div className="flex items-center gap-1.5 text-amber-300/90 text-xs sm:text-sm font-devanagari tracking-widest mb-1.5 drop-shadow-md">
          <span>卐</span>
          <span>॥ ॐ श्री गणेशाय नमः ॥</span>
          <span>卐</span>
        </div>

        {/* Grand Royal Couple Title */}
        <h1 className="font-script text-4xl sm:text-6xl text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] leading-tight my-1">
          {brideName} <span className="text-[#FFD54F] font-serif text-2xl sm:text-4xl">&amp;</span> {groomName}
        </h1>

        <p className="font-royal uppercase tracking-[0.25em] text-[#FFD54F] text-[10px] sm:text-xs font-semibold drop-shadow mt-1">
          Saturday, 28th November 2026 • The Oberoi Udaivilas, Udaipur
        </p>

        {/* Bouncing Scroll Down Cue */}
        <button
          onClick={handleScrollDown}
          className="group mt-5 flex flex-col items-center gap-1.5 text-white/90 hover:text-white transition-all cursor-pointer"
          title="Scroll to explore wedding details"
        >
          <span className="font-serif italic text-xs tracking-wider text-amber-200 group-hover:text-white drop-shadow">
            Scroll down to explore wedding • नीचे स्क्रॉल करें
          </span>
          <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-[#D4AF37]/60 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:bg-[#8C1D24]">
            <ChevronDown className="w-5 h-5 text-amber-300 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default VideoLanding;
