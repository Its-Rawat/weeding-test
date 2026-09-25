import React, { useState, useEffect, useRef } from "react";
import { Mail } from "lucide-react";

interface FloatingNavProps {
  onReopenEnvelope: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onReopenEnvelope }) => {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  const resetTimer = () => {
    setIsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (window.scrollY > 200) {
        setIsVisible(false);
      }
    }, 4500);
  };

  useEffect(() => {
    const events = ["scroll", "mousemove", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const items = [
    { label: "Home", href: "#home" },
    { label: "Destination", href: "#destination" },
    { label: "Events", href: "#events" },
    { label: "Details", href: "#details" },
    { label: "RSVP", href: "#rsvp" },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 pointer-events-none ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-16 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-4 px-3 sm:px-6 py-2 rounded-full bg-[#FAF6EE]/90 backdrop-blur-xl border border-[#C5A059]/40 shadow-[0_8px_30px_rgba(74,47,20,0.1)] text-stone-800 text-[10px] sm:text-xs font-serif uppercase tracking-[0.25em]">
        
        <button
          onClick={onReopenEnvelope}
          className="p-1 rounded-full text-[#722F37] hover:scale-110 transition-transform mr-1"
          title="Re-open Invitation Envelope"
        >
          <Mail className="w-3.5 h-3.5" />
        </button>

        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className="hover:text-[#722F37] transition-colors px-1.5 py-0.5"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default FloatingNav;
