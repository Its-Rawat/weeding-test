import React, { useState, useEffect } from "react";
import {
  Calendar,
  Palette,
  MapPin,
  Send,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Menu,
  X,
  Heart,
  Sparkles,
  Gift,
} from "lucide-react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

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

  const navLinks = [
    { label: "Invitation", href: "#invitation" },
    { label: "Celebrations", href: "#event", icon: Calendar },
    { label: "Dress Code", href: "#dress-code", icon: Palette },
    { label: "Venue", href: "#venue", icon: MapPin },
    { label: "Our Story", href: "#story", icon: Heart },
    { label: "Wishes", href: "#wishes", icon: Sparkles },
    { label: "Shagun", href: "#gift", icon: Gift },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace("#", "");
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 select-none ${
        isScrolled
          ? "bg-[#FFFDF9]/95 dark:bg-[#1a1715]/95 backdrop-blur-xl border-b border-[#D4AF37]/40 shadow-[0_4px_25px_rgba(140,107,28,0.15)] text-[#231C18] dark:text-white py-2.5 sm:py-3"
          : "bg-black/35 backdrop-blur-md border-b border-[#D4AF37]/30 text-white shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-3 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        
        {/* LEFT: ROYAL MONOGRAM & LOGO */}
        <a
          href="#video-hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
              isScrolled
                ? "border-[#D4AF37] bg-[#FAF5EB] text-[#8C1D24]"
                : "border-[#FFD54F] bg-white/10 text-white"
            }`}
          >
            <span className="font-royal font-bold text-xs sm:text-sm tracking-wider">
              C &amp; X
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif italic font-bold text-xs sm:text-sm tracking-wide leading-tight">
              Chandrika &amp; Xudong
            </span>
            <span
              className={`font-devanagari text-[9.5px] tracking-widest leading-none ${
                isScrolled ? "text-[#8C1D24]" : "text-amber-300"
              }`}
            >
              ॥ शुभ विवाह ॥
            </span>
          </div>
        </a>

        {/* CENTER: DESKTOP NAVIGATION MENU ITEMS */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className={`px-3 py-1.5 rounded-full text-xs font-serif tracking-wide transition-all cursor-pointer ${
                isScrolled
                  ? "text-[#4A3E36] dark:text-stone-200 hover:text-[#8C1D24] hover:bg-[#FAF5EB] dark:hover:bg-white/10"
                  : "text-white/90 hover:text-white hover:bg-white/15"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: CONTROLS & RSVP BUTTON */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Music Audio Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xs ${
              isScrolled
                ? "border-[#D4AF37]/50 bg-[#FAF5EB] dark:bg-white/10 text-[#8C6B1C]"
                : "border-white/25 bg-black/40 text-amber-200"
            }`}
            title={isPlayingMusic ? "Mute Music" : "Play Wedding Shehnai"}
          >
            {isPlayingMusic ? (
              <Volume2 className="w-4 h-4 text-[#8C1D24] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className={`hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full items-center justify-center border transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xs ${
              isScrolled
                ? "border-[#D4AF37]/50 bg-[#FAF5EB] dark:bg-white/10 text-[#8C6B1C]"
                : "border-white/25 bg-black/40 text-amber-200"
            }`}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-[#8C6B1C]" />
            ) : (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            )}
          </button>

          {/* THE PROMINENT RSVP BUTTON */}
          <button
            onClick={() => handleNavClick("#rsvp")}
            className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] text-white border border-[#FFD54F]/80 shadow-[0_4px_16px_rgba(140,29,36,0.35)] text-xs font-serif font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Confirm Attendance"
          >
            <Send className="w-3.5 h-3.5 text-[#FFD54F] transition-transform group-hover:translate-x-0.5" />
            <span>RSVP</span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`lg:hidden w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              isScrolled
                ? "border-[#D4AF37]/50 bg-[#FAF5EB] text-[#231C18]"
                : "border-white/30 bg-black/40 text-white"
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-DOWN SEMI-TRANSPARENT MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-[#FFFDF9]/98 dark:bg-[#1a1715]/98 backdrop-blur-2xl border-b border-[#D4AF37]/50 shadow-2xl py-4 px-6 flex flex-col gap-2 animate-fade-in text-[#231C18] dark:text-white">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-[#FAF5EB] dark:hover:bg-white/10 text-left font-serif text-sm transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                {link.icon && <link.icon className="w-4 h-4 text-[#8C1D24]" />}
                <span>{link.label}</span>
              </span>
              <span className="text-xs text-[#D4AF37]">→</span>
            </button>
          ))}

          <div className="pt-2 mt-2 border-t border-[#D4AF37]/30 flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 text-xs font-serif text-[#8C6B1C] py-1"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#D4AF37]" />}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>

            <button
              onClick={() => handleNavClick("#rsvp")}
              className="px-4 py-1.5 rounded-full bg-[#8C1D24] text-white text-xs font-serif font-bold shadow-md"
            >
              Confirm RSVP
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
