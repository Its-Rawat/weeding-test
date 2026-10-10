import React, { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  Send,
  Moon,
  Sun,
  Music,
} from "lucide-react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isPhone = window.innerWidth < 768;
      if (!isPhone) {
        // On PC, floating navigation dock is always accessible
        setIsVisible(true);
        return;
      }
      // On phone, navbar is hidden on the landing video, and appears once user scrolls down
      const threshold = window.innerHeight * 0.35;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Venue removed as requested; only essential navigation retained
  const navItems = [
    { icon: Mail, label: "Invitation", href: "#invitation" },
    { icon: Calendar, label: "Celebrations", href: "#event" },
    { icon: Music, label: "Melodies", href: "#photo-music" },
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
    "px-2 sm:px-3 md:px-3.5 py-1.5 sm:py-2 rounded-full text-[#4A3E36] dark:text-slate-200 hover:text-[#8C1D24] dark:hover:text-[#D4AF37] hover:bg-[#FAF5EB] dark:hover:bg-white/10 transition-all group relative flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer";
  const tooltipClass =
    "absolute -top-9 left-1/2 -translate-x-1/2 bg-[#231C18] dark:bg-[#D4AF37] text-white dark:text-[#231C18] text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block";

  return (
    <nav
      className={`fixed bottom-3 sm:bottom-6 left-3 right-[88px] sm:right-[100px] md:right-auto md:left-1/2 md:-translate-x-1/2 z-40 w-auto md:min-w-[560px] md:max-w-2xl transition-all duration-500 ease-out select-none pointer-events-none ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div className="pointer-events-auto flex items-center justify-between md:justify-center gap-1 sm:gap-2 md:gap-3 rounded-full border border-[#D4AF37]/50 bg-[#FFFDF9]/95 dark:bg-[#1a1715]/95 p-1.5 sm:p-2 px-2.5 sm:px-5 shadow-[0_12px_35px_rgba(140,107,28,0.2)] backdrop-blur-2xl transition-colors duration-500">
        
        {navItems.map((item) => {
          if (item.isRsvp) {
            return (
              <button
                key={item.label}
                onClick={(e) => handleNavClick(e, item.href)}
                className="py-1.5 sm:py-2 px-2.5 sm:px-4 md:px-5 rounded-full bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] text-white shadow-md active:scale-95 transition-all flex items-center gap-1 font-bold text-xs group relative cursor-pointer border border-[#FFD54F]/70 shrink-0"
                title={item.label}
              >
                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FFE082]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-sans font-bold">RSVP</span>
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
              <item.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
              <span className="hidden md:inline-block text-xs md:text-[13px] font-serif font-medium tracking-wide">
                {item.label}
              </span>
              <span className={tooltipClass}>{item.label}</span>
            </button>
          );
        })}

        {/* Theme Toggle (Speaker icon removed as requested) */}
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
            <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
          ) : (
            <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0 text-[#D4AF37]" />
          )}
          <span className="hidden md:inline-block text-xs md:text-[13px] font-serif font-medium">
            {theme === "light" ? "Dark" : "Light"}
          </span>
          <span className={tooltipClass}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
