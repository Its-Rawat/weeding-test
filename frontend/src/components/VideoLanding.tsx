import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import type { AppConfig } from "../types";

interface VideoLandingProps {
  config: AppConfig;
  videoSrc?: string;
}

const VideoLanding: React.FC<VideoLandingProps> = ({
  config,
  videoSrc = "/Short_LandingPageVid.mp4?v=firstnames",
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // 1. Permanently keep video 100% muted
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay info:", err);
      });
    }

    // 2. Track background / wedding music state
    const handleMusicState = (e: any) => {
      if (e.detail?.isPlaying !== undefined) {
        setIsPlayingMusic(e.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleMusicState);

    // Initial state query
    window.dispatchEvent(new CustomEvent("query-wedding-music-state"));

    return () => {
      window.removeEventListener("wedding-music-state", handleMusicState);
    };
  }, []);

  // Auto-pause video frames when user scrolls down into invitation
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        if (rect.bottom < window.innerHeight * 0.4) {
          if (!videoRef.current.paused) {
            videoRef.current.pause();
          }
        } else {
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Video ALWAYS stays muted - never unmute the video soundtrack!
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
    // Toggle the admin wedding soundtrack
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
      className="block md:hidden relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-black select-none flex flex-col justify-between"
    >
      {/* 100% FULL-SCREEN CINEMATIC VIDEO (ZERO CLUTTER, PERMANENTLY SILENT) */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onClick={handleToggleSound}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {/* TOP: MUSIC / SOUND TOGGLE (CONTROLS ADMIN-CONFIGURED AUDIO) */}
      <div className="relative z-30 pt-4 sm:pt-6 px-4 sm:px-6 flex items-center justify-end pointer-events-auto">
        <button
          onClick={handleToggleSound}
          className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title={isPlayingMusic ? "Pause Wedding Music" : "Play Wedding Music"}
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-[11px] font-serif text-amber-100 font-medium">
                Sound On 🔊
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
