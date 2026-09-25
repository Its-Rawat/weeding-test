import React, { useState, useEffect } from "react";
import { Sparkles, Mail, Heart, ChevronDown } from "lucide-react";
import type { AppConfig } from "../types";

interface EnvelopeProps {
  onOpen: () => void;
  config: AppConfig;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);
  }, []);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Trigger music immediately on tap
    window.dispatchEvent(new CustomEvent("play-wedding-music"));

    // After flap opens and card slides out, smoothly transition into the main invitation scroll
    setTimeout(() => {
      setIsFullyRevealed(true);
      setTimeout(() => {
        onOpen();
      }, 600);
    }, 1400);
  };

  return (
    <div
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#151210]/95 backdrop-blur-md px-4 select-none transition-all duration-1000 ${
        isFullyRevealed ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{ perspective: "1200px" }}
    >
      {/* Background subtle romantic bokeh lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#d4af37]/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#b73239]/10 blur-3xl animate-pulse-soft [animation-delay:2s]" />
      </div>

      {/* Top Greeting Badge */}
      <div className="relative z-10 mb-6 text-center animate-reveal">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 backdrop-blur-md shadow-sm mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f4e7bd]">
            You're Cordially Invited
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-wide">
          {config.couple.bride.name} &amp; {config.couple.groom.name}
        </h1>
        {guestName && (
          <p className="font-serif italic text-[#f4e7bd] text-sm mt-1">
            Specially delivered for {guestName}
          </p>
        )}
      </div>

      {/* 3D Envelope Container */}
      <div
        onClick={handleOpenEnvelope}
        className="group relative cursor-pointer w-[320px] sm:w-[380px] md:w-[420px] h-[220px] sm:h-[260px] md:h-[280px] transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
        style={{ perspective: "1200px" }}
      >
        {/* Envelope Outer Shadow */}
        <div className="absolute -inset-4 bg-gradient-to-b from-[#d4af37]/20 via-black/40 to-black/60 rounded-3xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Envelope Body */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#FAF5EE] to-[#F3EBE0] border border-[#d4af37]/40 shadow-2xl overflow-hidden flex flex-col justify-end">
          
          {/* Inner Envelope Lining with delicate palace & floral watercolor */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF2E6] via-[#FFF9F2] to-[#FCEEE2] opacity-90">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Invitation Card Inside (Slides up when opened) */}
          <div
            className={`absolute inset-x-3.5 bottom-3.5 h-[90%] bg-[#FFFDF9] rounded-xl border border-[#d4af37]/50 shadow-md p-4 flex flex-col items-center justify-between text-center transition-all duration-1000 ease-out ${
              isOpen ? "-translate-y-[65%] shadow-2xl scale-[1.03]" : "translate-y-0"
            }`}
            style={{ zIndex: 10 }}
          >
            {/* Top Monogram Seal on Card */}
            <div className="w-9 h-9 rounded-full border border-[#d4af37] flex items-center justify-center bg-white shadow-xs">
              <span className="font-serif font-bold text-xs text-[#9e7241] tracking-tight">C&amp;X</span>
            </div>

            <div className="my-auto py-1">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#9e7241] font-bold block mb-0.5">
                Save The Date
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-tight">
                {config.couple.bride.name} &amp; {config.couple.groom.name}
              </h3>
              <p className="text-[10px] text-stone-600 mt-0.5 font-light">
                {config.events.akad.date} • {config.hero.city}
              </p>
            </div>

            <div className="w-12 h-0.5 bg-[#d4af37]/50 rounded-full" />
          </div>

          {/* Envelope Bottom Pocket (Front Face with V-cut folds) */}
          <div 
            className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#EDE2D3] to-[#F8EFE4] border-t border-[#d4af37]/30 shadow-inner flex flex-col justify-end p-4 text-center"
            style={{ zIndex: 20 }}
          >
            {/* Calligraphy script matching video: "Request the pleasure of your company" */}
            <div className="relative z-10 mb-2">
              <p className="font-serif italic text-stone-700 text-xs sm:text-sm tracking-wide drop-shadow-xs">
                Request the pleasure of your company
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#9e7241] mt-0.5">
                The Royal Celebration
              </p>
            </div>
          </div>

          {/* Envelope Top Triangular Flap (Folds open in 3D rotateX) */}
          <div
            className={`absolute inset-x-0 top-0 h-[55%] origin-top transition-transform duration-1000 ease-in-out ${
              isOpen ? "rotate-x-180 pointer-events-none" : "rotate-x-0"
            }`}
            style={{
              zIndex: isOpen ? 5 : 30,
              transformStyle: "preserve-3d",
              transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Front of Flap with V-shape clip path */}
            <div 
              className="w-full h-full bg-gradient-to-b from-[#F2E7D9] to-[#E9DCcb] border-b border-[#d4af37]/50 shadow-md flex items-center justify-center relative"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            >
              {/* Gold foiled border accent along the V */}
              <div 
                className="absolute inset-0 border-b-2 border-[#d4af37]/60 pointer-events-none"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
            </div>
          </div>

          {/* Royal Wax Seal with C&X monogram in center (Tapping it triggers open) */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
              isOpen ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100"
            }`}
            style={{ zIndex: 40 }}
          >
            <div className="relative group/seal">
              {/* Wax Seal Outer Glow */}
              <div className="absolute -inset-2 rounded-full bg-[#d4af37]/40 blur-md animate-pulse" />

              {/* 3D Wax Seal Medal */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#E5C775] via-[#D4AF37] to-[#8C6B1C] p-0.5 shadow-[0_8px_25px_rgba(140,107,28,0.5)] flex items-center justify-center border-2 border-[#FFF6D6]">
                <div className="w-full h-full rounded-full border border-[#8C6B1C]/60 flex flex-col items-center justify-center bg-gradient-to-br from-[#D4AF37] to-[#A37B24] text-white shadow-inner">
                  <span className="font-serif font-bold text-xs sm:text-sm tracking-tight text-[#FFFDF4] drop-shadow">
                    C &amp; X
                  </span>
                  <span className="text-[6px] uppercase tracking-widest text-[#FFF2C2] font-mono leading-none mt-0.5">
                    SEAL
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Tap to Open Prompt */}
        {!isOpen && (
          <div className="mt-5 text-center animate-bounce">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFF4D0] text-xs font-semibold uppercase tracking-widest shadow-md">
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Tap to Open Invitation</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Envelope;
