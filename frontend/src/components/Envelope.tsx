import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import type { AppConfig } from "../types";

interface EnvelopeProps {
  onOpen: () => void;
  config: AppConfig;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, config }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [guestName, setGuestName] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);
  }, []);

  const handleStartPlay = () => {
    if (!videoRef.current) return;
    setHasStarted(true);
    videoRef.current.currentTime = 0;
    videoRef.current.muted = false;
    setIsMuted(false);
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Autoplay with sound blocked, trying muted:", err);
        // Fallback if browser blocks unmuted play without user gesture
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
          setIsPlaying(true);
        }
      });
  };

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    setIsEnded(false);
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((curr / dur) * 100);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
    // Smooth auto-transition after 2.8 seconds or let user click
    const timer = setTimeout(() => {
      handleEnterWebsite();
    }, 2800);
    return () => clearTimeout(timer);
  };

  const handleEnterWebsite = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsTransitioning(true);
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  const brideName = config?.couple?.bride?.name || "Chandrika";
  const groomName = config?.couple?.groom?.name || "Xudong";

  return (
    <div
      className={`fixed inset-0 z-[2000] w-full h-[100dvh] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out ${
        isTransitioning
          ? "opacity-0 scale-105 pointer-events-none filter blur-sm"
          : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #FFFDF9 0%, #FAF5EB 50%, #ECE0CE 100%)",
      }}
    >
      {/* FLOATING MARIGOLD & ROSE AMBIENT PARTICLES */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#F7D8A5]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP HEADER: INVOCATION & ENTER WEBSITE SHORTCUT */}
      <header className="absolute top-3 sm:top-5 inset-x-4 sm:inset-x-8 flex items-center justify-between z-50 pointer-events-auto">
        {/* Sacred Invocation / Guest Badge */}
        {guestName ? (
          <div className="max-w-[65%] truncate px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#D4AF37]/60 shadow-sm">
            <span className="inline-flex items-center gap-1.5 text-[#2D2520] text-xs font-serif italic tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">
                अतिथि देवो भव • <strong className="font-semibold text-[#8C1D24]">{guestName}</strong>
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/90 border border-[#D4AF37]/50 text-[#8C1D24] text-xs font-devanagari tracking-widest shadow-xs">
            <span>卐</span>
            <span>॥ श्री गणेशाय नमः ॥</span>
            <span>卐</span>
          </div>
        )}

        {/* Enter Website Shortcut Button */}
        <button
          onClick={handleEnterWebsite}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#8C1D24] text-[#FFFDF9] border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(140,29,36,0.25)] text-xs font-serif tracking-wider transition-all duration-300 hover:scale-105 hover:bg-[#6D141A] active:scale-95 cursor-pointer"
        >
          <span>प्रवेश करें • Enter</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </header>

      {/* ========================================================================= */}
      {/* RESPONSIVE VIDEO INVITATION CARD FRAME (NEVER EXCEEDS SCREEN)             */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 w-[92vw] max-w-[400px] sm:max-w-[420px] h-[82dvh] max-h-[640px] sm:h-[680px] rounded-3xl border-2 border-[#D4AF37] shadow-[0_25px_60px_rgba(140,107,28,0.28)] flex flex-col items-center justify-center overflow-hidden bg-black transition-all duration-500"
        style={{
          boxShadow:
            "0 25px 60px rgba(140,107,28,0.25), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 25px rgba(0,0,0,0.5)",
        }}
      >
        {/* THE WEDDING VIDEO ELEMENT */}
        <video
          ref={videoRef}
          src="/wedding_invitation.mp4"
          playsInline
          webkit-playsinline="true"
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onClick={handleTogglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* ===================================================================== */}
        {/* INITIAL COVER SCREEN: TAP TO PLAY INVITATION WITH SOUND               */}
        {/* ===================================================================== */}
        {!hasStarted && (
          <div
            onClick={handleStartPlay}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 sm:p-8 text-center cursor-pointer transition-all duration-500"
            style={{
              background:
                "radial-gradient(ellipse at 50% 35%, rgba(255,253,249,0.96) 0%, rgba(250,245,235,0.95) 60%, rgba(236,224,206,0.97) 100%)",
            }}
          >
            {/* Double Gold Filigree Arch Border */}
            <div className="absolute inset-3 sm:inset-4 rounded-2xl border-2 border-[#D4AF37]/70 pointer-events-none">
              <div className="absolute inset-1 rounded-xl border border-[#D4AF37]/35" />
            </div>

            {/* Top Ganesha Emblem & Shlokas */}
            <div className="relative z-10 pt-2 flex flex-col items-center">
              <div className="w-12 h-12 mb-2 rounded-full border border-[#D4AF37]/70 bg-white/90 shadow-sm p-1.5 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M42 22 L50 12 L58 22 L50 25 Z" fill="#D4AF37" stroke="#8C6B1C" strokeWidth="0.8" />
                  <path d="M34 32 C26 32 24 42 29 46 C34 49 37 45 38 41" stroke="#D4AF37" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M66 32 C74 32 76 42 71 46 C66 49 63 45 62 41" stroke="#D4AF37" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M38 32 C38 27 62 27 62 32 C62 42 50 42 50 48" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="28" x2="50" y2="35" stroke="#8C1D24" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="37" r="1.2" fill="#8C1D24" />
                  <path d="M50 45 C50 56 42 66 35 63 C29 60 32 52 38 52 C44 52 46 59 41 62" stroke="#D4AF37" strokeWidth="3.2" strokeLinecap="round" />
                  <circle cx="33" cy="53" r="3" fill="#D4AF37" stroke="#8C6B1C" strokeWidth="0.5" />
                </svg>
              </div>

              <span className="font-devanagari text-xs text-[#8C1D24] font-bold tracking-widest">
                ॥ श्री गणेशाय नमः ॥
              </span>
              <p className="font-devanagari text-[9.5px] text-[#8C6B1C] mt-0.5 tracking-wider">
                ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥
              </p>
            </div>

            {/* Middle Couple Calligraphy */}
            <div className="relative z-10 flex flex-col items-center my-auto py-2">
              <span className="font-royal text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#8C6B1C] font-semibold">
                Royal Wedding Invitation
              </span>

              <h1 className="font-script text-4xl sm:text-5xl text-[#8C1D24] leading-tight mt-1 mb-0.5">
                {brideName}
              </h1>
              <span className="font-serif italic text-base sm:text-lg text-[#D4AF37] font-semibold">
                &amp;
              </span>
              <h1 className="font-script text-4xl sm:text-5xl text-[#8C1D24] leading-tight mb-2">
                {groomName}
              </h1>

              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1" />

              <p className="font-serif text-[11px] sm:text-xs text-[#2D2520] tracking-wide mt-1">
                Saturday, 28th November 2026
              </p>
              <p className="font-royal text-[9.5px] uppercase tracking-widest text-[#8C6B1C] font-semibold">
                The Oberoi Udaivilas • Udaipur
              </p>
            </div>

            {/* Bottom Auspicious Glowing Play CTA Button */}
            <div className="relative z-10 pb-2 flex flex-col items-center w-full">
              <div className="group/btn relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#8C1D24] via-[#A8232B] to-[#8C1D24] text-[#FFFDF9] border-2 border-[#FFD54F] shadow-[0_8px_25px_rgba(140,29,36,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-gentle">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>
                <span className="font-devanagari font-bold text-xs sm:text-sm tracking-wide">
                  निमंत्रण पत्र देखें • Watch Invitation
                </span>
              </div>
              <span className="text-[10px] text-[#8C6B1C] font-serif italic mt-2">
                Tap to play wedding card video with sound
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* IN-PLAY CONTROLS (Floating Over Video)                                 */}
        {/* ===================================================================== */}
        {hasStarted && (
          <>
            {/* Top Corner Audio Control & Video Watermark */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-auto">
              <div className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-royal tracking-widest text-amber-200">
                {brideName} &amp; {groomName}
              </div>

              <button
                onClick={handleToggleMute}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/60 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-300" />
                )}
              </button>
            </div>

            {/* Center Play/Pause Indicator on tap */}
            {!isPlaying && !isEnded && (
              <button
                onClick={handleTogglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border-2 border-[#D4AF37] text-white flex items-center justify-center z-20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl animate-fade-in"
              >
                <Play className="w-7 h-7 text-amber-300 fill-amber-300 ml-1" />
              </button>
            )}

            {/* Bottom Controls: Progress Bar & Replay / Enter */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent z-20 flex flex-col gap-2 pointer-events-auto">
              {/* Gold Progress Bar */}
              <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD54F] transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="p-1 text-white/90 hover:text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <button
                    onClick={handleReplay}
                    className="p-1 text-white/90 hover:text-white transition-colors"
                    title="Replay Video"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleEnterWebsite}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C1D24]/90 hover:bg-[#8C1D24] text-[#FFFDF9] border border-[#D4AF37]/70 text-[11px] font-serif tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>प्रवेश करें • Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ===================================================================== */}
        {/* VIDEO ENDED OVERLAY: WELCOME & ENTER WEBSITE                          */}
        {/* ===================================================================== */}
        {isEnded && (
          <div
            onClick={handleEnterWebsite}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/75 backdrop-blur-sm cursor-pointer animate-fade-in"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] bg-[#8C1D24] flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(212,175,55,0.6)]">
              <Sparkles className="w-7 h-7 text-[#FFD54F]" />
            </div>

            <span className="font-devanagari text-base font-bold text-[#FFD54F] tracking-wide mb-1">
              ॥ शुभ विवाह में आपका स्वागत है ॥
            </span>
            <p className="font-serif italic text-white/90 text-sm mb-4">
              Welcome to the Wedding of Chandrika &amp; Xudong
            </p>

            <button
              onClick={handleEnterWebsite}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#231C18] font-royal font-bold text-xs sm:text-sm uppercase tracking-widest shadow-[0_6px_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Wedding Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReplay}
              className="mt-3 text-xs text-white/70 hover:text-white inline-flex items-center gap-1 font-serif underline underline-offset-4"
            >
              <RotateCcw className="w-3 h-3" /> Watch video again
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM SUBTITLE */}
      <footer className="absolute bottom-2 sm:bottom-4 inset-x-0 flex flex-col items-center pointer-events-none z-10">
        <span className="text-[11px] text-[#8C6B1C] font-serif italic tracking-wide">
          {brideName} &amp; {groomName} • 28 November 2026 • The Oberoi Udaivilas
        </span>
      </footer>

      <style>{`
        @keyframes pulse-gentle {
          0%, 100% {
            box-shadow: 0 8px 25px rgba(140,29,36,0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 10px 32px rgba(212,175,55,0.6);
            transform: scale(1.02);
          }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2.2s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Envelope;
