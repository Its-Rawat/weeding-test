import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import SkiperMusicToggle from "./ui/skiper-ui/skiper25";
import type { AppConfig } from "../types";

interface VideoLandingProps {
  config: AppConfig;
  videoSrc?: string;
}

const VideoLanding: React.FC<VideoLandingProps> = ({
  videoSrc = "/Short_LandingPageVid_15Feb.mp4?v=weddingonly",
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Guaranteed Autoplay for Mobile Phones (iOS Safari, Android Chrome, Samsung Internet, Low Power Mode)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set DOM properties directly: iOS Safari ignores React JSX muted on initial mount
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("x5-playsinline", "");

    const playVideo = () => {
      if (video && video.paused) {
        const promise = video.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              setVideoLoaded(true);
            })
            .catch((err) => {
              console.log("Autoplay waiting for first touch gesture:", err?.message);
            });
        }
      }
    };

    playVideo();

    // Fallback for strict Low Power Mode / Battery Saver:
    // If phone initially blocked autoplay, the first touch or scroll anywhere on the screen starts it immediately
    const handleFirstGesture = () => {
      playVideo();
    };

    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("click", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("scroll", handleFirstGesture, { once: true, passive: true });

    // Track background wedding music state
    const handleMusicState = (e: any) => {
      if (e.detail?.isPlaying !== undefined) {
        setIsPlayingMusic(e.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleMusicState);
    window.dispatchEvent(new CustomEvent("query-wedding-music-state"));

    return () => {
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("wedding-music-state", handleMusicState);
    };
  }, [videoSrc]);

  // 2. Smooth Glide / 1-Scroll transition: when user scrolls or swipes down on video, smoothly glide to page 2
  useEffect(() => {
    let isTransitioning = false;

    const triggerScrollDown = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      const target = document.getElementById("invitation");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(() => {
        isTransitioning = false;
      }, 700);
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY < 50 && e.deltaY > 5) {
        e.preventDefault();
        triggerScrollDown();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const invitationEl = document.getElementById("invitation");
      const invTop = invitationEl ? invitationEl.offsetTop : window.innerHeight;
      if (window.scrollY < invTop * 0.4 && e.changedTouches.length > 0) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        // User swiped up by more than 20px -> smoothly glide to page 2
        if (diff > 20) {
          triggerScrollDown();
        }
      }
    };

    const videoSection = document.getElementById("video-hero");
    if (videoSection) {
      videoSection.addEventListener("wheel", handleWheel, { passive: false });
      videoSection.addEventListener("touchstart", handleTouchStart, { passive: true });
      videoSection.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    // Auto-pause video frames when user scrolls down past video to save phone GPU/battery
    const handleScroll = () => {
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        if (rect.bottom < window.innerHeight * 0.3) {
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

    return () => {
      if (videoSection) {
        videoSection.removeEventListener("wheel", handleWheel);
        videoSection.removeEventListener("touchstart", handleTouchStart);
        videoSection.removeEventListener("touchend", handleTouchEnd);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Video ALWAYS stays muted - never unmute the video soundtrack!
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
    // Optimistic immediate toggle so button reflects state on the very first click!
    setIsPlayingMusic((prev) => !prev);
    // Toggle the admin wedding soundtrack
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const handleScrollDown = () => {
    const target = document.getElementById("invitation");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="video-hero"
      className="relative w-full h-screen h-[100svh] min-h-screen min-h-[100svh] overflow-hidden bg-black select-none flex flex-col justify-between scroll-mt-0"
    >
      {/* INSTANT VISUAL POSTER BACKDROP:
          Guarantees the first frame is visible at 0ms on any mobile network, completely eliminating black screen */}
      <img
        src="/Short_LandingPageVid_poster.jpg"
        alt="Chandrika & Xudong Wedding"
        className="absolute inset-0 w-full h-full object-cover md:object-contain max-w-lg md:mx-auto select-none pointer-events-none z-0"
        loading="eager"
      />

      {/* 100% FULL-SCREEN CINEMATIC VIDEO (ZERO CLUTTER, PERMANENTLY SILENT) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        defaultMuted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        poster="/Short_LandingPageVid_poster.jpg"
        onClick={handleToggleSound}
        onLoadedData={() => {
          setVideoLoaded(true);
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlay={() => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        className={`absolute inset-0 w-full h-full object-cover md:object-contain max-w-lg md:mx-auto cursor-pointer z-10 transition-opacity duration-700 ${
          videoLoaded ? "opacity-100" : "opacity-90"
        }`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* TOP: COMPACT SKICKER 25 MUSIC EQUALIZER TOGGLE */}
      <div className="relative z-30 pt-3 sm:pt-5 px-3.5 sm:px-6 flex items-center justify-end pointer-events-auto">
        <SkiperMusicToggle
          isPlaying={isPlayingMusic}
          onToggle={handleToggleSound}
        />
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
          <div className="w-8 h-8 rounded-full border border-white/30 bg-black/30 backdrop-blur-xs flex items-center justify-center group-hover:bg-black/50 transition-colors">
            <ChevronDown className="w-4 h-4 text-white/90 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default VideoLanding;
