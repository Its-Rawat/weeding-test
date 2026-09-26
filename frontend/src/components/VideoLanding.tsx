import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import type { AppConfig } from "../types";

interface VideoLandingProps {
  config: AppConfig;
}

const VideoLanding: React.FC<VideoLandingProps> = ({ config }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
const isMobile = /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  useEffect(() => {
    const handleMusicState = (e: any) => {
      if (e.detail?.isPlaying !== undefined) {
        setIsPlayingMusic(e.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleMusicState);

    // Autoplay video on load
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay info:", err);
      });
    }

    return () => {
      window.removeEventListener("wedding-music-state", handleMusicState);
    };
  }, []);

  const handleToggleMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
    // Dispatches music toggle to MusicPlayer for background Shehnai/music
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

  return (
    <section
      id="video-hero"
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-black select-none flex flex-col justify-between"
    >
      {/* 100% FULL-SCREEN CINEMATIC VIDEO (ZERO CLUTTER, FULLY VISIBLE) */}
      <video
        ref={videoRef}
        src="/Short_LandingPageVid.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onClick={handleToggleMusic}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {/* TOP: ONLY THE MUSIC / VOLUME TAB (SEMI-TRANSPARENT GLASS) */}
      <div className="relative z-30 pt-4 sm:pt-6 px-4 sm:px-6 flex items-center justify-end pointer-events-auto">
        <button
          onClick={handleToggleMusic}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/25 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title={isPlayingMusic ? "Mute Music" : "Play Wedding Music"}
        >
          {isPlayingMusic && !isMuted ? (
            <>
              <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-[11px] font-serif text-amber-100 font-medium">
                Music Playing 🪷
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-white/80" />
              <span className="text-[11px] font-serif text-white/90 font-medium">
                Tap for Sound 🔊
              </span>
            </>
          )}
        </button>
      </div>

      {/* BOTTOM: ULTRA-SUBTLE TRANSLUCENT SCROLL CHEVRON */}
      <div className="relative z-30 pb-6 sm:pb-8 flex flex-col items-center pointer-events-auto">
        <button
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          title="Scroll to explore website"
        >
          <span className="text-[11px] font-serif italic text-white/80 drop-shadow-md group-hover:text-white">
            Scroll to explore
          </span>
          <div className="w-8 h-8 rounded-full bg-black/25 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
            <ChevronDown className="w-4 h-4 text-white/90 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default VideoLanding;
