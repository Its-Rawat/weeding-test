import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Volume2, VolumeX, ArrowRight } from "lucide-react";
import type { AppConfig } from "../types";

interface EnvelopeProps {
  onOpen: () => void;
  config: AppConfig;
}

interface PetalParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  type: "marigold" | "rose" | "gold";
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, config }) => {
  // Cinematic Unboxing Sequence:
  // 0: 'closed' - Physical luxury envelope closed, tied with sacred Hindu Mauli thread (NO auto-open, NO skip button)
  // 1: 'untying_mauli' - Mauli knot loosens, red-yellow threads pull away smoothly (500ms)
  // 2: 'opening_flap' - 3D flap rotates open 180° revealing gold damask interior (900ms)
  // 3: 'pulling_card' - Royal Patrika card slides UP out of envelope pocket (1100ms)
  // 4: 'card_revealed' - Card rests in full glory, expanding to take over screen
  // 5: 'docking' - Smooth scale-dissolve into the website hero section (600ms)
  const [animStage, setAnimStage] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [guestName, setGuestName] = useState<string>("");
  const [petals, setPetals] = useState<PetalParticle[]>([]);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);

    // Floating celebratory marigold & rose petals (गेंदा और गुलाब के फूल)
    const generatedPetals: PetalParticle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 96 + 2,
      top: -10 - Math.random() * 20,
      size: 11 + Math.random() * 18,
      rotation: Math.random() * 360,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 4,
      type: i % 3 === 0 ? "marigold" : i % 3 === 1 ? "rose" : "gold",
    }));
    setPetals(generatedPetals);

    const handleAudioState = (e: Event) => {
      const custom = e as CustomEvent<{ isPlaying: boolean }>;
      if (custom.detail) {
        setIsAudioMuted(!custom.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleAudioState);

    // Strictly user-initiated: Envelope stays closed until guest taps
    return () => {
      clearAllTimers();
      window.removeEventListener("wedding-music-state", handleAudioState);
    };
  }, []);

  // When user taps the Sacred Mauli / Kalawa knot or envelope
  const handleUntieMauli = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (animStage === 0) {
      // Step 1: Untie sacred Mauli thread & play wedding Shehnai
      window.dispatchEvent(new CustomEvent("play-wedding-music"));
      setAnimStage(1);

      // Step 2: Flap hinges open 180 degrees in 3D
      const t1 = setTimeout(() => {
        setAnimStage(2);
      }, 500);

      // Step 3: Card slides UP out of envelope pocket
      const t2 = setTimeout(() => {
        setAnimStage(3);
      }, 1400);

      // Step 4: Card is fully elevated and interactive
      const t3 = setTimeout(() => {
        setAnimStage(4);
      }, 2500);

      timerRefs.current = [t1, t2, t3];
    } else if (animStage >= 1 && animStage < 4) {
      // If user taps while animating, smoothly fast-forward to full card
      clearAllTimers();
      setAnimStage(4);
    } else if (animStage === 4) {
      handleEnterWebsite();
    }
  };

  // Smooth transition from card into the main website
  const handleEnterWebsite = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    clearAllTimers();
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setAnimStage(5);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioMuted((prev) => !prev);
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const isMauliUntied = animStage >= 1;
  const isFlapOpen = animStage >= 2;
  const isCardPulling = animStage >= 3;
  const isCardRevealed = animStage >= 4;
  const isDocking = animStage >= 5;

  const brideName = config?.couple?.bride?.name || "Chandrika";
  const groomName = config?.couple?.groom?.name || "Xudong";

  return (
    <div
      onClick={animStage === 0 ? handleUntieMauli : undefined}
      className={`fixed inset-0 z-[2000] w-full h-[100dvh] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out cursor-pointer ${
        isDocking
          ? "opacity-0 scale-105 pointer-events-none filter blur-xs"
          : "opacity-100 scale-100"
      }`}
      style={{
        // Synchronized Warm Ivory & Champagne Silk Backdrop
        background: "linear-gradient(to bottom, #FAF5EE 0%, #F5EDE1 50%, #ECE1D1 100%)",
        perspective: "1600px",
      }}
    >
      {/* FLOATING MARIGOLD & ROSE PETALS (गेंदे और गुलाब के फूल) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#F7D8A5]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.3}px`,
              borderRadius:
                p.type === "marigold"
                  ? "50% 50% 50% 0%"
                  : p.type === "rose"
                  ? "60% 40% 60% 40%"
                  : "50%",
              background:
                p.type === "marigold"
                  ? "linear-gradient(135deg, #FFA726 0%, #FB8C00 60%, #E65100 100%)"
                  : p.type === "rose"
                  ? "linear-gradient(135deg, #E24A68 0%, #C2185B 60%, #880E4F 100%)"
                  : "radial-gradient(circle, #FFF4D0 0%, #D4AF37 60%, transparent 100%)",
              boxShadow:
                p.type === "gold"
                  ? "0 0 8px rgba(212,175,55,0.7)"
                  : "0 2px 5px rgba(140,107,28,0.2)",
              opacity: p.type === "gold" ? 0.8 : 0.7,
              animation: `indianPetalFall ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* TOP CONTROLS: AUDIO TOGGLE & GUEST INVOCATION (NO SKIP BUTTON) */}
      <header className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-50 pointer-events-auto">
        {/* Shehnai / Music Toggle */}
        <button
          onClick={handleToggleSound}
          className="group flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(212,175,55,0.2)] text-[#8C6B1C] text-xs font-serif transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95"
          title="Toggle Wedding Shehnai"
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-stone-400" />
          ) : (
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#8C6B1C] animate-pulse" />
              <span className="hidden sm:inline text-[11px] tracking-wider font-semibold text-[#8C6B1C]">
                Shehnai
              </span>
            </div>
          )}
        </button>

        {/* Auspicious Guest Badge or Lord Ganesha Invocation */}
        {guestName ? (
          <div className="mx-2 max-w-[70%] truncate px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D4AF37]/60 shadow-sm text-center">
            <span className="inline-flex items-center gap-1.5 text-stone-800 text-xs font-serif italic tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">
                अतिथि देवो भव • Welcome, <strong className="font-semibold text-stone-900">{guestName}</strong>
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/50 text-[#8C1D24] text-xs font-devanagari tracking-widest shadow-xs">
            <span>卐</span>
            <span>॥ श्री गणेशाय नमः ॥</span>
            <span>卐</span>
          </div>
        )}

        <div className="w-10 sm:w-20" />
      </header>

      {/* ========================================================================= */}
      {/* THE 3D PHYSICAL ENVELOPE & ROYAL CARD STACK (REALISTIC UNBOXING)          */}
      {/* ========================================================================= */}
      <div
        className="relative w-full max-w-[380px] sm:max-w-[430px] h-[540px] sm:h-[600px] flex flex-col items-center justify-end px-3 transition-transform duration-700 ease-out"
        style={{
          perspective: "1600px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft Organic Drop Shadow underneath envelope */}
        <div className="absolute inset-x-6 -bottom-4 top-16 bg-black/15 rounded-3xl blur-2xl pointer-events-none" />

        {/* =================================================================== */}
        {/* LAYER 1: ENVELOPE BACK WALL & INNER GOLD LINING (z-10)             */}
        {/* =================================================================== */}
        <div
          className="relative w-full h-[360px] sm:h-[400px] rounded-2xl sm:rounded-3xl border-2 border-[#D4AF37]/80 shadow-[0_20px_50px_rgba(140,107,28,0.18)] flex flex-col justify-end overflow-hidden"
          style={{
            zIndex: 10,
            background: "linear-gradient(150deg, #FFFDF8 0%, #F5ECE0 50%, #EBE0D0 100%)",
            boxShadow:
              "0 20px 45px rgba(140,107,28,0.15), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(212,175,55,0.25)",
          }}
        >
          {/* Inner Lining with Gold Damask Motif & Palace Watermark */}
          <div
            className="absolute inset-x-3.5 top-3.5 bottom-12 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #FAF5EB 0%, #F3EAE0 100%)",
              boxShadow: "inset 0 10px 25px rgba(212,175,55,0.12)",
            }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(#D4AF37 1.5px, transparent 1.5px), radial-gradient(#D4AF37 1.5px, transparent 1.5px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }}
            />

            <div className="absolute top-4 inset-x-0 flex flex-col items-center text-center opacity-75">
              <span className="text-xl">🪷</span>
              <p className="font-royal text-[10px] tracking-[0.25em] text-[#8C6B1C] uppercase font-semibold mt-0.5">
                The Oberoi Udaivilas • Udaipur
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-1" />
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 2: THE ROYAL INVITATION CARD (Sliding Up Out of Pocket) (z-20)*/}
        {/* =================================================================== */}
        <div
          onClick={(e) => {
            if (isCardRevealed) handleEnterWebsite(e);
          }}
          className={`absolute inset-x-3 sm:inset-x-4 bottom-3 rounded-t-[130px] sm:rounded-t-[160px] rounded-b-2xl sm:rounded-b-3xl border-2 border-[#D4AF37] p-4 sm:p-5 flex flex-col items-center justify-between text-center overflow-y-auto transition-all duration-[1200ms] ${
            isCardPulling
              ? "-translate-y-[64%] sm:-translate-y-[68%] scale-[1.03] shadow-[0_30px_70px_rgba(140,107,28,0.35)] pointer-events-auto"
              : "translate-y-0 scale-100 shadow-md pointer-events-none"
          }`}
          style={{
            zIndex: isCardPulling ? 45 : 15,
            height: "480px",
            background: "linear-gradient(to bottom, #FFFDF9 0%, #FAF5EE 50%, #F5ECE0 100%)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Double Filigree Arch Border matching Hero.tsx */}
          <div className="absolute inset-2 sm:inset-2.5 rounded-t-[120px] sm:rounded-t-[150px] rounded-b-xl sm:rounded-b-2xl border border-[#D4AF37]/60 pointer-events-none">
            <div className="absolute inset-1 rounded-t-[115px] sm:rounded-t-[145px] rounded-b-lg border border-[#D4AF37]/30" />
          </div>

          {/* CARD TOP: LORD GANESHA & SHUBH VIVAH */}
          <div className="pt-2 sm:pt-3 flex flex-col items-center relative z-10 w-full shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mb-1 rounded-full border border-[#D4AF37]/50 bg-white/70 shadow-xs p-1 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_2px_4px_rgba(140,107,28,0.3)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 2" />
                <path
                  d="M42 22 L50 12 L58 22 L50 25 Z"
                  fill="url(#goldGradPatrika)"
                  stroke="#8C6B1C"
                  strokeWidth="0.8"
                />
                <path
                  d="M34 32 C26 32 24 42 29 46 C34 49 37 45 38 41"
                  stroke="url(#goldGradPatrika)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M66 32 C74 32 76 42 71 46 C66 49 63 45 62 41"
                  stroke="url(#goldGradPatrika)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M38 32 C38 27 62 27 62 32 C62 42 50 42 50 48"
                  stroke="url(#goldGradPatrika)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line x1="50" y1="28" x2="50" y2="35" stroke="#8C1D24" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="37" r="1.2" fill="#8C1D24" />
                <path
                  d="M50 45 C50 56 42 66 35 63 C29 60 32 52 38 52 C44 52 46 59 41 62"
                  stroke="url(#goldGradPatrika)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <circle cx="33" cy="53" r="3" fill="#D4AF37" stroke="#8C6B1C" strokeWidth="0.5" />
                <circle cx="50" cy="18" r="1.5" fill="#D4AF37" />
                <defs>
                  <linearGradient id="goldGradPatrika" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF2B2" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8C6B1C" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h3 className="font-devanagari font-bold text-sm sm:text-base text-[#8C1D24] tracking-wider leading-tight">
              ॥ ॐ श्री गणेशाय नमः ॥
            </h3>
            <p className="font-serif italic text-[8.5px] sm:text-[9.5px] text-[#8C6B1C] tracking-wide mt-0.5 max-w-[280px]">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
            </p>

            <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/30 to-[#D4AF37]/15 border border-[#D4AF37]/50">
              <span className="text-[#8C6B1C] text-[10px]">🪷</span>
              <span className="font-devanagari text-[11px] font-bold text-[#8C1D24] tracking-widest uppercase">
                शुभ विवाह
              </span>
              <span className="text-[#8C6B1C] text-[10px]">🪷</span>
            </div>
          </div>

          {/* CARD CENTER: COUPLE TITLES */}
          <div className="my-auto py-1 sm:py-2 relative z-10 w-full flex flex-col items-center shrink-0">
            <p className="font-serif italic text-stone-600 text-[10.5px] sm:text-[11.5px] tracking-wide">
              With the blessings of our parents
            </p>
            <p className="font-sans text-[9.5px] sm:text-[10px] font-bold tracking-[0.25em] text-[#9e7241] uppercase mt-0.5">
              The Verma &amp; Wang Families
            </p>

            <div className="pt-1.5">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-none">
                {brideName}
              </h2>
            </div>

            <div className="my-1 flex items-center justify-center gap-2 w-full max-w-[200px]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
              <span className="font-script text-2xl text-[#d4af37] leading-none px-1">
                weds
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-none">
                {groomName}
              </h2>
            </div>
          </div>

          {/* CARD BOTTOM: DATE, VENUE & ENTER ACTION */}
          <div className="w-full relative z-10 pb-1 flex flex-col items-center shrink-0">
            <div className="w-full max-w-[270px] py-1.5 px-3 rounded-xl bg-white/70 border border-[#D4AF37]/50 shadow-2xs mb-1.5">
              <span className="font-royal text-[9px] font-bold tracking-[0.25em] text-[#8C6B1C] uppercase block">
                SATURDAY • 28TH NOVEMBER 2026
              </span>
              <div className="flex items-center justify-center gap-2 my-0.5">
                <div className="w-4 h-px bg-[#D4AF37]" />
                <span className="font-devanagari text-[9.5px] sm:text-[10.5px] font-bold text-[#8C1D24] tracking-wider">
                  शुभ लग्न मुहूर्त : सायं 7:00 बजे
                </span>
                <div className="w-4 h-px bg-[#D4AF37]" />
              </div>
            </div>

            <div className="text-center">
              <span className="font-royal text-[10.5px] sm:text-xs font-bold text-stone-800 tracking-widest uppercase block">
                The Oberoi Udaivilas
              </span>
              <span className="font-serif text-[9.5px] text-[#8C6B1C] italic tracking-wide block">
                Lake Pichola, Udaipur, Rajasthan
              </span>
              <p className="font-serif italic text-[8.5px] text-[#8C1D24] mt-0.5 font-semibold">
                Warmly Hosted by Aditya Rawat &amp; Family
              </p>
            </div>

            {/* Immersive Enter Button */}
            {isCardPulling && (
              <button
                onClick={handleEnterWebsite}
                className="mt-2.5 w-full max-w-[260px] py-2 px-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C768] to-[#AA7C11] text-stone-900 font-bold text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-bounce-soft pointer-events-auto cursor-pointer"
              >
                <span>शुभ विवाह में प्रवेश करें • Enter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 3: ENVELOPE FRONT POCKET (V-Notch holding the card) (z-25)   */}
        {/* =================================================================== */}
        <div
          className="absolute inset-x-0 bottom-0 h-[56%] rounded-b-2xl sm:rounded-b-3xl shadow-[0_-6px_20px_rgba(140,107,28,0.12)] flex flex-col justify-end p-5 text-center overflow-hidden pointer-events-none"
          style={{
            zIndex: 25,
            background:
              "linear-gradient(to top, #EDE0D0 0%, #F5ECE0 60%, #FFFDF8 100%)",
            clipPath: "polygon(0 0, 50% 34%, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          {/* Gold piping along the V-notch cut */}
          <div
            className="absolute inset-0 border-t-2 border-[#D4AF37]/90"
            style={{
              clipPath: "polygon(0 0, 50% 34%, 100% 0, 100% 100%, 0 100%)",
            }}
          />

          {/* Pocket Calligraphy */}
          <div className="relative z-10 mb-3 sm:mb-5">
            <span className="font-devanagari text-xs text-[#8C1D24] font-bold tracking-widest block">
              ॥ शुभ विवाह ॥
            </span>
            <p className="font-serif italic text-stone-800 text-xs sm:text-sm tracking-wide mt-0.5">
              Chandrika &amp; Xudong
            </p>
            <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-1 rounded-full" />
            <p className="font-royal text-[8.5px] tracking-[0.2em] text-[#9E7241] uppercase mt-0.5">
              Royal Wedding Invitation
            </p>
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 4: ENVELOPE 3D TOP FLAP (Hinges open 180° backward!) (z-30)   */}
        {/* =================================================================== */}
        <div
          className={`absolute inset-x-0 top-0 h-[58%] origin-top transition-transform ${
            isFlapOpen ? "pointer-events-none" : ""
          }`}
          style={{
            zIndex: isFlapOpen ? 12 : 30,
            transformStyle: "preserve-3d",
            transform: isFlapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            transitionDuration: "900ms",
            transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {/* Flap Outer Face (Seen when closed) */}
          <div
            className="w-full h-full relative flex flex-col items-center pt-3 shadow-[0_12px_25px_rgba(140,107,28,0.18)]"
            style={{
              background:
                "linear-gradient(180deg, #FFFDF8 0%, #F6ECE0 60%, #EAE0D0 100%)",
              clipPath:
                "polygon(0 0, 100% 0, 100% 5%, 50% 100%, 0 5%)",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% 5%, 50% 100%, 0 5%)",
                boxShadow: "inset 0 -3px 0 #D4AF37",
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center mt-1">
              <span className="text-[#8C6B1C] text-sm">
                卐 🪷 卐
              </span>
              <span className="font-devanagari text-[10px] font-bold text-[#8C1D24] tracking-widest mt-0.5">
                ॥ श्री गणेशाय नमः ॥
              </span>
              <div className="w-12 h-0.5 bg-[#D4AF37]/70 mt-0.5 rounded-full" />
            </div>
          </div>

          {/* Flap Inner Face (Gold Damask silk seen when flipped open 180°) */}
          <div
            className="w-full h-full absolute inset-0 flex flex-col items-center justify-center p-4"
            style={{
              background: "linear-gradient(to bottom, #FAF5EB 0%, #F3EAE0 100%)",
              clipPath:
                "polygon(0 0, 100% 0, 100% 5%, 50% 100%, 0 5%)",
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(#D4AF37 1.5px, transparent 1.5px)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 5: SACRED HINDU MAULI / KALAWA THREAD (Red & Yellow Cotton)   */}
        {/* (Holds flap closed over the pocket until tapped) (z-35)            */}
        {/* =================================================================== */}
        <div
          className={`absolute top-[48%] inset-x-0 -translate-y-1/2 flex items-center justify-between pointer-events-none transition-all duration-500 ${
            isMauliUntied ? "opacity-0 scale-y-50" : "opacity-100 scale-y-100"
          }`}
          style={{ zIndex: 35 }}
        >
          {/* Left Twisted Mauli Cords */}
          <div
            className={`w-1/2 flex flex-col gap-1.5 transition-transform duration-600 ease-out ${
              isMauliUntied ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div
              className="w-full h-2 sm:h-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #B71C1C 0px, #B71C1C 6px, #FBC02D 6px, #FBC02D 12px, #E65100 12px, #E65100 14px)",
                borderRadius: "2px",
              }}
            />
            <div
              className="w-full h-2.5 sm:h-3 shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #FBC02D 0px, #FBC02D 6px, #C62828 6px, #C62828 12px, #FF8F00 12px, #FF8F00 14px)",
                borderRadius: "2px",
              }}
            />
            <div
              className="w-full h-2 sm:h-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #B71C1C 0px, #B71C1C 6px, #FBC02D 6px, #FBC02D 12px, #E65100 12px, #E65100 14px)",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* Right Twisted Mauli Cords */}
          <div
            className={`w-1/2 flex flex-col gap-1.5 transition-transform duration-600 ease-out ${
              isMauliUntied ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div
              className="w-full h-2 sm:h-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #B71C1C 0px, #B71C1C 6px, #FBC02D 6px, #FBC02D 12px, #E65100 12px, #E65100 14px)",
                borderRadius: "2px",
              }}
            />
            <div
              className="w-full h-2.5 sm:h-3 shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #FBC02D 0px, #FBC02D 6px, #C62828 6px, #C62828 12px, #FF8F00 12px, #FF8F00 14px)",
                borderRadius: "2px",
              }}
            />
            <div
              className="w-full h-2 sm:h-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #B71C1C 0px, #B71C1C 6px, #FBC02D 6px, #FBC02D 12px, #E65100 12px, #E65100 14px)",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 6: SACRED KNOT & SHAGUN SEAL (Tap to Untie & Open!) (z-40)    */}
        {/* =================================================================== */}
        <div
          onClick={handleUntieMauli}
          className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out cursor-pointer pointer-events-auto ${
            isMauliUntied
              ? "opacity-0 scale-125 pointer-events-none -translate-y-[80%]"
              : "opacity-100 scale-100 hover:scale-108 active:scale-95"
          }`}
          style={{
            zIndex: 40,
            transitionDuration: "450ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative group flex flex-col items-center">
            {/* Haldi & Kumkum Radiance Glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#E65100]/50 via-[#FBC02D]/60 to-[#B71C1C]/50 blur-lg animate-pulse" />

            {/* Sacred Mauli Knot Frayed Cotton Ends */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none">
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#B71C1C] to-[#FBC02D] rounded-full rotate-[-25deg] shadow-xs" />
              <span className="w-1.5 h-5 bg-gradient-to-b from-[#FBC02D] to-[#B71C1C] rounded-full rotate-[15deg] shadow-xs" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none">
              <span className="w-1.5 h-5 bg-gradient-to-b from-[#B71C1C] to-[#FBC02D] rounded-full rotate-[20deg] shadow-xs" />
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#FBC02D] to-[#B71C1C] rounded-full rotate-[-15deg] shadow-xs" />
            </div>

            {/* 3D Auspicious Terracotta & Gold Shagun Medallion */}
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1.5 flex items-center justify-center shadow-[0_14px_35px_rgba(183,28,28,0.5)] border-2 border-[#FFD54F] transition-transform group-hover:scale-105"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #FFD54F 0%, #D4AF37 35%, #B71C1C 75%, #5D0000 100%)",
                boxShadow:
                  "0 12px 30px rgba(183,28,28,0.5), inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -3px 8px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="w-full h-full rounded-full border border-[#FFE79A]/80 flex flex-col items-center justify-center shadow-inner"
                style={{
                  background:
                    "linear-gradient(135deg, #B71C1C 0%, #8E1515 50%, #5D0000 100%)",
                }}
              >
                <div className="flex items-center gap-1 text-[#FFD54F] text-[10px] leading-none mb-0.5">
                  <span>卐</span>
                  <span className="font-royal font-bold text-base sm:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-tight">
                    C &amp; X
                  </span>
                  <span>卐</span>
                </div>
                <span className="font-devanagari text-[8.5px] sm:text-[9.5px] text-[#FFD54F] font-bold tracking-wider leading-none mt-0.5 drop-shadow">
                  ॥ शुभ विवाह ॥
                </span>
              </div>
            </div>

            {/* Auspicious Interactive Bouncing Callout Pill */}
            <div className="absolute -bottom-11 sm:-bottom-12 whitespace-nowrap px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#D4AF37] shadow-[0_6px_22px_rgba(212,175,55,0.45)] flex items-center gap-1.5 animate-bounce-soft">
              <Sparkles className="w-3.5 h-3.5 text-[#B71C1C] animate-pulse" />
              <span className="font-devanagari font-bold text-xs sm:text-sm text-[#8C1D24] tracking-wide">
                पवित्र कलावा खोलें • Tap to Open
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM HINT (When Closed) */}
        {!isCardPulling && (
          <div className="absolute -bottom-10 sm:-bottom-12 inset-x-0 flex flex-col items-center pointer-events-none">
            <span className="text-[11px] text-[#8C6B1C] font-serif italic tracking-wide">
              Chandrika &amp; Xudong • 28 November 2026 • The Oberoi Udaivilas
            </span>
          </div>
        )}

      </div>

      <style>{`
        @keyframes indianPetalFall {
          0% {
            transform: translateY(-8vh) translateX(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(112vh) translateX(60px) rotate(540deg) scale(1.05);
            opacity: 0;
          }
        }
        @keyframes bounce-soft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-soft {
          animation: bounce-soft 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Envelope;
