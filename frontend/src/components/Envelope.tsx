import React, { useState, useEffect } from "react";
import { Sparkles, Mail, Volume2, VolumeX } from "lucide-react";
import type { AppConfig } from "../types";

interface EnvelopeProps {
  onOpen: () => void;
  config: AppConfig;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, config }) => {
  // Animation states matching luxury stationery unboxing
  // 0: Initial closed envelope resting
  // 1: Wax seal releases & dissolves (600ms)
  // 2: 3D flap swings open 180° (1000ms)
  // 3: Arched card slides up out of envelope pocket (1700ms)
  // 4: Card docks into page, scroll unlocked (3400ms)
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);

    const t1 = setTimeout(() => setAnimationStep(1), 600);
    const t2 = setTimeout(() => {
      setAnimationStep(2);
      window.dispatchEvent(new CustomEvent("play-wedding-music"));
    }, 1100);
    const t3 = setTimeout(() => setAnimationStep(3), 1800);
    const t4 = setTimeout(() => {
      setAnimationStep(4);
      setTimeout(() => onOpen(), 600);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onOpen]);

  const handleInstantOpen = () => {
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setAnimationStep(4);
    setTimeout(() => onOpen(), 250);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioMuted((prev) => !prev);
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const isFlapOpen = animationStep >= 2;
  const isCardElevating = animationStep >= 3;
  const isFinished = animationStep >= 4;

  const brideName = config?.couple?.bride?.name || "Chandrika";
  const groomName = config?.couple?.groom?.name || "Xudong";

  return (
    <div
      onClick={handleInstantOpen}
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#F8F4EF] select-none transition-all duration-1000 overflow-hidden cursor-pointer ${
        isFinished ? "opacity-0 pointer-events-none scale-102" : "opacity-100"
      }`}
      style={{ perspective: "1500px" }}
    >
      {/* Warm natural linen stationery backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF5EE] via-[#F4ECE2] to-[#ECE1D5] opacity-95">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8C7355_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Guest Name Badge */}
      {guestName && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#d4af37]/40 text-stone-800 text-xs font-serif italic shadow-sm tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Cordially invited: {guestName}
          </span>
        </div>
      )}

      {/* THE PHYSICAL LUXURY ENVELOPE */}
      <div
        className="relative w-full max-w-[390px] sm:max-w-[440px] h-[82vh] sm:h-[78vh] max-h-[680px] flex flex-col items-center justify-end px-3 transition-transform duration-700"
        style={{ perspective: "1500px" }}
      >
        {/* Soft Organic Shadow under Envelope */}
        <div className="absolute inset-x-4 -bottom-3 top-12 bg-black/15 rounded-3xl blur-2xl pointer-events-none" />

        {/* Envelope Paper Body */}
        <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-[#FAF4EC] via-[#F3EADE] to-[#EBE0D2] border border-[#d4af37]/35 shadow-2xl overflow-hidden flex flex-col justify-end">
          
          {/* Envelope Inner Lining: Royal Palace & Floral Watercolor Garland */}
          <div className="absolute inset-x-2.5 top-2.5 bottom-16 rounded-2xl bg-[#FFFDF9] overflow-hidden border border-[#d4af37]/25">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-5 inset-x-0 flex flex-col items-center text-center opacity-80">
              <span className="text-3xl filter drop-shadow-xs">🌸 🌿 🌸</span>
              <p className="font-serif italic text-xs text-[#9e7241] tracking-widest mt-1 uppercase">
                The Oberoi Udaivilas • Udaipur
              </p>
              <div className="w-24 h-0.5 bg-[#d4af37]/40 mt-1 rounded-full" />
            </div>
          </div>

          {/* THE ARCHED FORMAL INVITATION CARD (Glides Upward Out of Envelope) */}
          <div
            className={`absolute inset-x-4 bottom-4 h-[94%] bg-[#FFFDF9] rounded-t-[130px] sm:rounded-t-[170px] rounded-b-xl border border-[#d4af37]/60 shadow-xl p-5 sm:p-6 flex flex-col items-center justify-between text-center transition-all duration-[1500ms] ease-out ${
              isCardElevating
                ? "-translate-y-[88%] sm:-translate-y-[80%] scale-[1.03] shadow-2xl"
                : "translate-y-0"
            }`}
            style={{ zIndex: 15 }}
          >
            {/* Inner Filigree Arch */}
            <div className="absolute inset-2 rounded-t-[120px] sm:rounded-t-[160px] rounded-b-lg border border-[#d4af37]/30 pointer-events-none" />

            {/* Monogram Crest on Card */}
            <div className="pt-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] bg-white shadow-xs flex items-center justify-center mb-1">
                <span className="font-serif font-bold text-sm text-[#8C6B1C] tracking-tight">C &amp; X</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#9e7241] font-semibold">
                Royal Nuptials
              </span>
            </div>

            {/* Couple Title */}
            <div className="my-auto py-1 space-y-0.5">
              <p className="font-serif italic text-stone-500 text-xs">
                Request the pleasure of your company
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight pt-1">
                {brideName}
              </h2>
              <span className="font-script text-2xl text-[#d4af37] block -my-1">&amp;</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight">
                {groomName}
              </h2>
            </div>

            {/* Editorial Date Block */}
            <div className="py-2 border-y border-[#d4af37]/40 w-full max-w-[210px]">
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#9e7241] uppercase block">
                SATURDAY
              </span>
              <span className="font-serif text-3xl font-bold text-stone-900 leading-none my-0.5 block">
                28
              </span>
              <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[#9e7241] uppercase block">
                NOVEMBER 2026
              </span>
            </div>

            {/* Venue Lockup */}
            <div className="pb-1">
              <span className="text-[11px] font-serif font-semibold text-stone-800 tracking-wider uppercase block">
                The Oberoi Udaivilas
              </span>
              <span className="text-[9px] text-[#9e7241] font-sans tracking-wide block">
                Lake Pichola, Udaipur
              </span>
            </div>
          </div>

          {/* ENVELOPE FRONT POCKET (V-fold with Calligraphy) */}
          <div
            className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#EDE0D6] via-[#F4E6DC] to-[#F9EFE8] border-t border-[#d4af37]/35 shadow-inner flex flex-col justify-end p-6 text-center"
            style={{
              zIndex: 25,
              clipPath: "polygon(0 0, 50% 28%, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="relative z-10 mb-6 sm:mb-8">
              <p className="font-serif italic text-stone-700 text-sm sm:text-base tracking-wide font-normal">
                Requests the pleasure
              </p>
              <p className="font-serif italic text-stone-700 text-sm sm:text-base tracking-wide font-normal -mt-1">
                of your company
              </p>
              <div className="w-16 h-0.5 bg-[#d4af37]/45 mx-auto mt-2 rounded-full" />
            </div>
          </div>

          {/* ENVELOPE TOP FLAP (3D rotateX) */}
          <div
            className={`absolute inset-x-0 top-0 h-[56%] origin-top transition-transform duration-[1200ms] ease-in-out ${
              isFlapOpen ? "pointer-events-none" : ""
            }`}
            style={{
              zIndex: isFlapOpen ? 10 : 35,
              transformStyle: "preserve-3d",
              transform: isFlapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              className="w-full h-full bg-gradient-to-b from-[#F2E3DA] via-[#EDE0D6] to-[#E5D4C8] shadow-lg relative border-b border-[#d4af37]/40"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            >
              {/* Botanical Floral Garland Header on Top Flap */}
              <div className="absolute top-3 inset-x-0 flex justify-center text-lg opacity-80 pointer-events-none">
                🌸 🌿 🌸
              </div>

              {/* Gold foil border rim */}
              <div
                className="absolute inset-0 border-b-2 border-[#d4af37]/60"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
            </div>
          </div>

          {/* ROYAL GOLD WAX SEAL ("C & X" Monogram) */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
              animationStep >= 1 ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
            }`}
            style={{ zIndex: 45 }}
          >
            <div className="relative group">
              <div className="absolute -inset-2.5 rounded-full bg-[#d4af37]/40 blur-md animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FAF0D7] via-[#D4AF37] to-[#8C6B1C] p-0.5 shadow-[0_10px_25px_rgba(140,107,28,0.5)] flex items-center justify-center border-2 border-white/80">
                <div className="w-full h-full rounded-full border border-[#8C6B1C]/50 flex flex-col items-center justify-center bg-gradient-to-br from-[#E2BE68] to-[#9E7820] text-white shadow-inner">
                  <span className="font-serif font-bold text-sm tracking-tight text-white drop-shadow">
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

        {/* BOTTOM ACTION PILL & SOUND TOGGLE */}
        <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between pointer-events-auto z-50">
          <button
            onClick={handleToggleSound}
            className="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md border border-[#d4af37]/40 shadow-md flex items-center justify-center text-stone-700 active:scale-95 transition-all"
            title="Toggle Wedding Music"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#8C6B1C] animate-pulse" />
            )}
          </button>

          <button
            onClick={handleInstantOpen}
            className="px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#d4af37]/40 text-[#8C6B1C] text-[10px] font-sans font-bold uppercase tracking-widest shadow-md hover:bg-white active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open Invitation</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Envelope;
