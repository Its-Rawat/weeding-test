import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Calendar,
  Palette,
  MapPin,
  Send,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Home,
} from "lucide-react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  onReopenEnvelope?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onReopenEnvelope }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const resetTimer = () => {
    setIsVisible(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (window.scrollY > 150) {
        setIsVisible(false);
      }
    }, 4000);
  };

  useEffect(() => {
    const events = ["mousemove", "scroll", "touchstart", "keydown"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    const handleMusicPlayState = (e: any) => {
      if (e.detail?.isPlaying !== undefined) {
        setIsPlayingMusic(e.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleMusicPlayState);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      window.removeEventListener("wedding-music-state", handleMusicPlayState);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleToggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
    resetTimer();
  };

  const navItems = [
    { icon: Home, label: "Invitation", href: "#" },
    { icon: Calendar, label: "Celebrations", href: "#event" },
    { icon: Palette, label: "Dress Code", href: "#dress-code" },
    { icon: MapPin, label: "Venue", href: "#venue" },
    { icon: Send, label: "RSVP", href: "#rsvp", isRsvp: true },
  ];

  const itemBaseClass =
    "p-2.5 sm:p-3 rounded-full text-slate-700 dark:text-slate-200 hover:text-[#d4af37] dark:hover:text-[#d4af37] hover:bg-white/80 dark:hover:bg-white/10 transition-all group relative flex items-center justify-center active:scale-95";
  const tooltipClass =
    "absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-[#d4af37] text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap hidden md:block shadow-xl pointer-events-none";

  return (
    <nav
      className={`pointer-events-none fixed bottom-3 sm:bottom-6 left-1/2 z-[100] w-[96%] max-w-md -translate-x-1/2 px-1 transition-all duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <div className="dark:bg-[#1a1715]/90 pointer-events-auto flex items-center justify-between gap-1 rounded-full border border-white/60 bg-[#FFFDF9]/90 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-colors duration-500 border-[#d4af37]/40">
        
        {/* Re-open Envelope Button */}
        {onReopenEnvelope && (
          <button
            onClick={() => {
              onReopenEnvelope();
              resetTimer();
            }}
            className={itemBaseClass}
            title="Re-open Invitation Envelope"
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#9e7241]" />
            <span className={tooltipClass}>Re-open Envelope</span>
          </button>
        )}

        {navItems.map((item) => {
          if (item.isRsvp) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="py-1.5 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-[#DFBE68] via-[#D4AF37] to-[#B89328] text-white shadow-md active:scale-95 transition-all flex items-center gap-1 font-bold text-xs group relative"
                title={item.label}
              >
                <item.icon className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                <span className={tooltipClass}>Confirm Attendance</span>
              </a>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              className={itemBaseClass}
              title={item.label}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className={tooltipClass}>{item.label}</span>
            </a>
          );
        })}

        {/* Music Audio Toggle */}
        <button
          onClick={handleToggleMusic}
          className={itemBaseClass}
          title={isPlayingMusic ? "Mute Music" : "Play Music"}
        >
          {isPlayingMusic ? (
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#b73239] animate-pulse" />
          ) : (
            <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          )}
          <span className={tooltipClass}>
            {isPlayingMusic ? "Mute Music" : "Play Music"}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
            resetTimer();
          }}
          className={itemBaseClass}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-[#d4af37]" />
          )}
          <span className={tooltipClass}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
