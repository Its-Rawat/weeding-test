import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import type { AppConfig } from "../types";

interface EnvelopeProps {
  onOpen: () => void;
  config: AppConfig;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, config }) => {
  // Animation stages matching video SaveClip.App_AQOEUMF7tk4WzyqjaTo515sDxjwSjj4GsVzZi41Ka5KTrIPyV9Z1yftAdRKXLDj6-RApOh_O1ed4awHmJfaUmg3Ie96qRNEZKFCpwwo.mp4
  // Stage 0: Initial closed envelope (0 - 600ms)
  // Stage 1: Wax seal releases & fades (600ms)
  // Stage 2: Flap swings open 180° (900ms)
  // Stage 3: Card slides UP out of envelope pocket (1600ms)
  // Stage 4: Card docks into place and transitions smoothly (3200ms)
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);

    // Auto-trigger video sequence right after loading
    const timer1 = setTimeout(() => {
      setAnimationStep(1); // Release wax seal
    }, 700);

    const timer2 = setTimeout(() => {
      setAnimationStep(2); // Flap unfolds 180deg
      window.dispatchEvent(new CustomEvent("play-wedding-music"));
    }, 1100);

    const timer3 = setTimeout(() => {
      setAnimationStep(3); // Card slides up out of envelope
    }, 1800);

    const timer4 = setTimeout(() => {
      setAnimationStep(4); // Fully revealed, transition to page
      setTimeout(() => {
        onOpen();
      }, 700);
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onOpen]);

  const handleInstantOpen = () => {
    // If guest taps anywhere, immediately finish animation and play music
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setAnimationStep(4);
    setTimeout(() => {
      onOpen();
    }, 300);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioMuted((prev) => !prev);
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const isFlapOpen = animationStep >= 2;
  const isCardSliding = animationStep >= 3;
  const isFinished = animationStep >= 4;

  return (
    <div
      onClick={handleInstantOpen}
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#F7EBE5] transition-all duration-700 select-none overflow-hidden ${
        isFinished ? "opacity-0 pointer-events-none scale-102" : "opacity-100"
      }`}
      style={{ perspective: "1400px" }}
    >
      {/* Background paper texture & warm lighting */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F9EFEA] via-[#F5E5DE] to-[#EFE0D7] opacity-95">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Guest Personalization Pill */}
      {guestName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-[#d4af37]/40 text-stone-800 text-[11px] font-serif italic shadow-sm">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            Delivered for {guestName}
          </span>
        </div>
      )}

      {/* THE PHYSICAL ENVELOPE (matching frame_000.jpg exactly) */}
      <div 
        className="relative w-full max-w-[390px] sm:max-w-[430px] h-[88vh] sm:h-[84vh] max-h-[760px] flex flex-col items-center justify-end px-3 transition-transform duration-500"
        style={{ perspective: "1400px" }}
      >
        {/* Envelope Outer Drop Shadow */}
        <div className="absolute inset-x-2 -bottom-2 top-10 bg-black/15 rounded-3xl blur-2xl pointer-events-none" />

        {/* Envelope Back Body & Lining */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#F2E5DC] via-[#EFE0D6] to-[#E9D6CA] border border-[#d4af37]/30 shadow-2xl overflow-hidden flex flex-col justify-end">
          
          {/* Inner Envelope Lining: Botanical Floral Watercolor Arch (Visible behind card when flap opens) */}
          <div className="absolute inset-x-2 top-2 bottom-20 rounded-xl bg-gradient-to-b from-[#FAF5F0] to-[#F5ECE3] overflow-hidden border border-[#d4af37]/20">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:14px_14px]" />
            
            {/* Arched Floral Watercolor Backdrop on the Inner Lining */}
            <div className="absolute top-4 inset-x-0 flex flex-col items-center text-center opacity-60">
              <span className="text-3xl filter drop-shadow">🌸 🌿 🌸</span>
              <div className="w-32 h-0.5 bg-[#d4af37]/30 mt-1 rounded-full" />
            </div>
          </div>

          {/* THE ARCHED FORMAL INVITATION CARD (SLIDES UPWARD OUT OF ENVELOPE) */}
          <div
            className={`absolute inset-x-4 bottom-4 h-[92%] bg-[#FFFDF9] rounded-t-[140px] sm:rounded-t-[180px] rounded-b-xl border border-[#d4af37]/60 shadow-xl p-5 sm:p-6 flex flex-col items-center justify-between text-center transition-all duration-[1400ms] ease-out ${
              isCardSliding
                ? "-translate-y-[85%] sm:-translate-y-[78%] scale-[1.03] shadow-2xl"
                : "translate-y-0"
            }`}
            style={{ zIndex: 15 }}
          >
            {/* Inner Filigree Arch */}
            <div className="absolute inset-2 rounded-t-[130px] sm:rounded-t-[170px] rounded-b-lg border border-[#d4af37]/30 pointer-events-none" />

            {/* Monogram Crest on Card */}
            <div className="pt-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] bg-white shadow-xs flex items-center justify-center mb-1">
                <span className="font-serif font-bold text-sm text-[#8C6B1C] tracking-tight">C &amp; X</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#9e7241] font-semibold">
                Royal Wedding
              </span>
            </div>

            {/* Formal Request & Couple Names matching video frame 00:05 */}
            <div className="my-auto py-2 space-y-1">
              <p className="font-serif italic text-stone-500 text-[11px]">
                Request the pleasure of your company
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight">
                {config.couple.bride.name}
              </h2>
              <span className="font-script text-2xl text-[#d4af37] block -my-1">&amp;</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight">
                {config.couple.groom.name}
              </h2>
            </div>

            {/* Editorial Date Block matching video */}
            <div className="py-2 border-y border-[#d4af37]/40 w-full max-w-[200px]">
              <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-600 uppercase block">
                SATURDAY
              </span>
              <span className="font-serif text-3xl font-bold text-stone-900 leading-none my-0.5 block">
                28
              </span>
              <span className="font-sans text-[9px] font-bold tracking-[0.25em] text-stone-600 uppercase block">
                NOVEMBER 2026
              </span>
            </div>

            {/* Venue Lockup */}
            <div className="pb-1">
              <span className="text-[10px] font-serif font-bold text-stone-800 tracking-wider uppercase block">
                The Oberoi Udaivilas
              </span>
              <span className="text-[9px] text-stone-500 font-sans tracking-wide block">
                Udaipur, Rajasthan
              </span>
            </div>
          </div>

          {/* ENVELOPE FRONT POCKET (V-fold covering lower part of card) */}
          <div
            className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#EDE0D6] via-[#F4E6DC] to-[#F9EFE8] border-t border-[#d4af37]/30 shadow-inner flex flex-col justify-end p-6 text-center"
            style={{
              zIndex: 25,
              clipPath: "polygon(0 0, 50% 28%, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            {/* Calligraphy script matching video frame 00:00: "Requests the pleasure of your company" */}
            <div className="relative z-10 mb-6 sm:mb-8">
              <p className="font-serif italic text-stone-700 text-sm sm:text-base tracking-wide drop-shadow-xs font-normal">
                Requests the pleasure
              </p>
              <p className="font-serif italic text-stone-700 text-sm sm:text-base tracking-wide drop-shadow-xs font-normal -mt-0.5">
                of your company
              </p>
              <div className="w-16 h-0.5 bg-[#d4af37]/40 mx-auto mt-2 rounded-full" />
            </div>
          </div>

          {/* ENVELOPE TOP TRIANGULAR FLAP (FOLDS OPEN IN 3D rotateX) */}
          <div
            className={`absolute inset-x-0 top-0 h-[56%] origin-top transition-transform duration-[1000ms] ease-in-out ${
              isFlapOpen ? "pointer-events-none" : ""
            }`}
            style={{
              zIndex: isFlapOpen ? 10 : 35,
              transformStyle: "preserve-3d",
              transform: isFlapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              transition: "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Front of Flap with V-shape pointing down */}
            <div
              className="w-full h-full bg-gradient-to-b from-[#F2E3DA] via-[#EDE0D6] to-[#E5D4C8] shadow-lg relative border-b border-[#d4af37]/40"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            >
              {/* Gold foil border rim */}
              <div
                className="absolute inset-0 border-b-2 border-[#d4af37]/50"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
            </div>
          </div>

          {/* TRANSLUCENT GOLD WAX SEAL (STAMPED ON FLAP TIP, FADES WHEN RELEASED) */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
              animationStep >= 1 ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
            }`}
            style={{ zIndex: 45 }}
          >
            <div className="relative group">
              {/* Outer soft wax glow */}
              <div className="absolute -inset-2.5 rounded-full bg-[#d4af37]/30 blur-md animate-pulse" />
              
              {/* Embossed Wax Seal Button */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FAF0D7] via-[#D4AF37] to-[#8C6B1C] p-0.5 shadow-[0_10px_25px_rgba(140,107,28,0.4)] flex items-center justify-center border-2 border-white/80">
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

        {/* BOTTOM CONTROLS MATCHING VIDEO (Audio Speaker & Skip Button) */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-auto z-50">
          {/* Audio Speaker Icon matching video frame 00:00 */}
          <button
            onClick={handleToggleSound}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-[#d4af37]/40 shadow-md flex items-center justify-center text-stone-700 active:scale-95 transition-all"
            title="Toggle Wedding Music"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#8C6B1C] animate-pulse" />
            )}
          </button>

          {/* Tap to Open Hint */}
          <button
            onClick={handleInstantOpen}
            className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#d4af37]/30 text-stone-600 text-[10px] font-sans font-semibold uppercase tracking-widest shadow-sm hover:bg-white active:scale-95 transition-all"
          >
            Tap to Open
          </button>
        </div>

      </div>
    </div>
  );
};

export default Envelope;
