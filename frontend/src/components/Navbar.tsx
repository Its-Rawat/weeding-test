import React, { useState, useEffect } from "react";
import {
  Home,
  Mail,
  Calendar,
  Palette,
  MapPin,
  Send,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Video,
} from "lucide-react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar is hidden/minimized on the landing video, and appears at the bottom once user scrolls down
      const threshold = window.innerHeight * 0.35;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    const handleMusicPlayState = (e: any) => {
      if (e.detail?.isPlaying !== undefined) {
        setIsPlayingMusic(e.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleMusicPlayState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wedding-music-state", handleMusicPlayState);
    };
  }, []);

  const handleToggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const navItems = [
    { icon: Video, label: "Video", href: "#video-hero" },
    { icon: Mail, label: "Invitation", href: "#invitation" },
    { icon: Calendar, label: "Celebrations", href: "#event" },
    { icon: Palette, label: "Dress Code", href: "#dress-code" },
    { icon: MapPin, label: "Venue", href: "#venue" },
    { icon: Send, label: "RSVP", href: "#rsvp", isRsvp: true },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const itemBaseClass =
    "p-2 sm:p-2.5 rounded-full text-[#4A3E36] dark:text-slate-200 hover:text-[#8C1D24] dark:hover:text-[#D4AF37] hover:bg-[#FAF5EB] dark:hover:bg-white/10 transition-all group relative flex items-center justify-center active:scale-95 cursor-pointer";
  const tooltipClass =
    "absolute -top-9 left-1/2 -translate-x-1/2 bg-[#231C18] dark:bg-[#D4AF37] text-white dark:text-[#231C18] text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block";

  return (
    <nav
      className={`fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md transition-all duration-500 ease-out select-none pointer-events-none ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div className="pointer-events-auto flex items-center justify-between gap-0.5 sm:gap-1 rounded-full border border-[#D4AF37]/50 bg-[#FFFDF9]/92 dark:bg-[#1a1715]/92 p-1.5 shadow-[0_12px_35px_rgba(140,107,28,0.2)] backdrop-blur-2xl transition-colors duration-500">
        
        {navItems.map((item) => {
          if (item.isRsvp) {
            return (
              <button
                key={item.label}
                onClick={(e) => handleNavClick(e, item.href)}
                className="py-1.5 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] text-white shadow-md active:scale-95 transition-all flex items-center gap-1 font-bold text-xs group relative cursor-pointer border border-[#FFD54F]/70"
                title={item.label}
              >
                <item.icon className="h-3.5 w-3.5 text-[#FFE082]" />
                <span className="text-[10.5px] uppercase tracking-wider">RSVP</span>
                <span className={tooltipClass}>Confirm Attendance</span>
              </button>
            );
          }

          return (
            <button
              key={item.label}
              onClick={(e) => handleNavClick(e, item.href)}
              className={itemBaseClass}
              title={item.label}
            >
              <item.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              <span className={tooltipClass}>{item.label}</span>
            </button>
          );
        })}

        {/* Music Sound Toggle */}
        <button
          onClick={handleToggleMusic}
          className={itemBaseClass}
          title={isPlayingMusic ? "Mute Music" : "Play Wedding Music"}
        >
          {isPlayingMusic ? (
            <Volume2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#8C1D24] animate-pulse" />
          ) : (
            <VolumeX className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-stone-400" />
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
          }}
          className={itemBaseClass}
          aria-label="Toggle theme"
          title="Toggle Light / Dark Mode"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          ) : (
            <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#D4AF37]" />
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
