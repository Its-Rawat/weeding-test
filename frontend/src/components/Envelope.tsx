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
  // Animation Sequence States:
  // 0: 'idle' - Closed envelope resting with gentle float & pulsing gold seal
  // 1: 'unsealing' - Seal glows, lifts forward and dissolves (600ms)
  // 2: 'flap_opening' - Flap hinges open 180° in 3D perspective (1100ms)
  // 3: 'card_rising' - Royal Patrika card glides up out of crimson pocket (1300ms)
  // 4: 'card_revealed' - Card fully displayed in all its royal Indian splendor
  // 5: 'docking' - Seamless scale-fade into the website (650ms)
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

    // Generate floating celebratory petals (Marigolds, Rose petals, Gold sparkles)
    const generatedPetals: PetalParticle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 96 + 2,
      top: -10 - Math.random() * 20,
      size: 11 + Math.random() * 16,
      rotation: Math.random() * 360,
      duration: 7 + Math.random() * 6,
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

    // Choreographed auto-sequence
    const t0 = setTimeout(() => {
      setAnimStage(1);
      window.dispatchEvent(new CustomEvent("play-wedding-music"));
    }, 1100);

    const t1 = setTimeout(() => {
      setAnimStage(2);
    }, 1700);

    const t2 = setTimeout(() => {
      setAnimStage(3);
    }, 2700);

    const t3 = setTimeout(() => {
      setAnimStage(4);
    }, 4100);

    timerRefs.current = [t0, t1, t2, t3];

    return () => {
      clearAllTimers();
      window.removeEventListener("wedding-music-state", handleAudioState);
    };
  }, []);

  const handleDirectEnter = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    clearAllTimers();
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setAnimStage(5);
    setTimeout(() => {
      onOpen();
    }, 650);
  };

  const handleEnvelopeClick = () => {
    if (animStage === 0) {
      clearAllTimers();
      window.dispatchEvent(new CustomEvent("play-wedding-music"));
      setAnimStage(1);
      const t1 = setTimeout(() => setAnimStage(2), 550);
      const t2 = setTimeout(() => setAnimStage(3), 1400);
      const t3 = setTimeout(() => setAnimStage(4), 2600);
      timerRefs.current = [t1, t2, t3];
    } else if (animStage >= 1 && animStage < 4) {
      clearAllTimers();
      setAnimStage(4);
    } else if (animStage === 4) {
      handleDirectEnter();
    }
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioMuted((prev) => !prev);
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const isFlapOpen = animStage >= 2;
  const isCardRising = animStage >= 3;
  const isCardRevealed = animStage >= 4;
  const isDocking = animStage >= 5;

  const brideName = config?.couple?.bride?.name || "Chandrika";
  const groomName = config?.couple?.groom?.name || "Xudong";

  return (
    <div
      onClick={handleEnvelopeClick}
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out ${
        isDocking
          ? "opacity-0 scale-105 pointer-events-none filter blur-xs"
          : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, #2C070B 0%, #170305 60%, #0A0102 100%)",
        perspective: "1600px",
      }}
    >
      {/* FLOATING MARIGOLD & ROSE PETALS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#9B111E]/20 via-[#D4AF37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

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
                  ? "linear-gradient(135deg, #E91E63 0%, #C2185B 60%, #880E4F 100%)"
                  : "radial-gradient(circle, #FFF4D0 0%, #D4AF37 60%, transparent 100%)",
              boxShadow:
                p.type === "gold"
                  ? "0 0 10px rgba(212,175,55,0.8)"
                  : "0 2px 6px rgba(0,0,0,0.3)",
              opacity: p.type === "gold" ? 0.85 : 0.75,
              animation: `indianPetalFall ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* TOP HEADER CONTROLS */}
      <header className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-50 pointer-events-auto">
        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#3D0A0F]/85 backdrop-blur-md border border-[#D4AF37]/50 shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-[#F5E5B8] text-xs font-serif transition-all duration-300 hover:scale-105 hover:border-[#D4AF37] hover:bg-[#4E0D14]"
          title="Toggle Wedding Music"
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-stone-400 group-hover:text-stone-200" />
          ) : (
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span className="hidden sm:inline text-[11px] tracking-wider text-[#D4AF37]">
                Music On
              </span>
            </div>
          )}
        </button>

        {/* Guest Invocation or Lord Ganesha Title */}
        {guestName ? (
          <div className="mx-2 max-w-[55%] truncate px-4 py-1.5 rounded-full bg-[#3D0A0F]/85 backdrop-blur-md border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(212,175,55,0.25)] text-center">
            <span className="inline-flex items-center gap-1.5 text-[#F7E7BE] text-xs sm:text-sm font-serif italic tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">
                अतिथि देवो भव • Welcome, <strong className="font-semibold text-white">{guestName}</strong>
              </span>
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#3D0A0F]/70 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-devanagari tracking-widest">
            <span>॥ श्री गणेशाय नमः ॥</span>
          </div>
        )}

        {/* Skip Button */}
        <button
          onClick={handleDirectEnter}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#2C070B] font-bold text-[11px] sm:text-xs tracking-wider uppercase shadow-[0_4px_18px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_25px_rgba(212,175,55,0.6)] active:scale-95"
          title="Enter wedding website directly"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </header>

      {/* THE ROYAL INDIAN ENVELOPE */}
      <div
        className="relative w-full max-w-[380px] sm:max-w-[430px] h-[550px] sm:h-[620px] flex flex-col items-center justify-end px-3 transition-transform duration-700 ease-out"
        style={{
          perspective: "1600px",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-x-6 -bottom-4 top-16 bg-black/80 rounded-3xl blur-2xl pointer-events-none" />

        {/* ENVELOPE BASE (Crimson Velvet with Gold Foil) */}
        <div
          className="relative w-full h-[360px] sm:h-[400px] rounded-2xl sm:rounded-3xl border-2 border-[#D4AF37]/70 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-end overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #7C0F17 0%, #58080E 50%, #3D0408 100%)",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.9), inset 0 1px 3px rgba(255,215,0,0.4), inset 0 -3px 8px rgba(0,0,0,0.6)",
          }}
        >
          {/* Gold Foil Jaali Border */}
          <div className="absolute inset-2 sm:inset-3 rounded-xl sm:rounded-2xl border border-[#D4AF37]/40 pointer-events-none">
            <div className="absolute top-1 left-1 text-[#D4AF37]/70 text-xs leading-none">✦</div>
            <div className="absolute top-1 right-1 text-[#D4AF37]/70 text-xs leading-none">✦</div>
            <div className="absolute bottom-1 left-1 text-[#D4AF37]/70 text-xs leading-none">✦</div>
            <div className="absolute bottom-1 right-1 text-[#D4AF37]/70 text-xs leading-none">✦</div>
          </div>

          {/* INNER LINING: Royal Ivory Silk */}
          <div
            className="absolute inset-x-3.5 top-3.5 bottom-12 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #FAF5EB 0%, #F5ECE0 100%)",
              boxShadow: "inset 0 10px 30px rgba(78,13,20,0.3)",
            }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(#AA7C11 1.5px, transparent 1.5px), radial-gradient(#AA7C11 1.5px, transparent 1.5px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }}
            />

            <div className="absolute top-4 inset-x-0 flex flex-col items-center text-center opacity-70">
              <span className="text-xl">🪷</span>
              <p className="font-royal text-[10px] tracking-[0.25em] text-[#8C6B1C] uppercase font-semibold mt-0.5">
                The Oberoi Udaivilas • Udaipur
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-1" />
            </div>
          </div>

          {/* ============================================================== */}
          {/* THE ROYAL INVITATION CARD (PATRIKA) - Slides Up Smoothly */}
          {/* ============================================================== */}
          <div
            className={`absolute inset-x-4 sm:inset-x-5 bottom-4 h-[510px] sm:h-[570px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EF] to-[#F5EEE1] rounded-t-[140px] sm:rounded-t-[170px] rounded-b-xl sm:rounded-b-2xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 sm:p-5 flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-[1300ms] ${
              isCardRising
                ? "-translate-y-[62%] sm:-translate-y-[65%] scale-[1.02] shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
                : "translate-y-0 scale-100"
            }`}
            style={{
              zIndex: 15,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Scalloped Arch & Jaali Filigree Border */}
            <div className="absolute inset-2 sm:inset-2.5 rounded-t-[130px] sm:rounded-t-[160px] rounded-b-lg sm:rounded-b-xl border border-[#D4AF37]/60 pointer-events-none">
              <div className="absolute inset-1 rounded-t-[125px] sm:rounded-t-[155px] rounded-b-md border border-[#D4AF37]/30" />
            </div>

            {/* CARD TOP: LORD GANESHA & SHUBH VIVAH */}
            <div className="pt-2 sm:pt-3 flex flex-col items-center relative z-10 w-full">
              {/* Golden Lord Ganesha Silhouette */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 mb-1 rounded-full p-1 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-[0_2px_4px_rgba(140,107,28,0.4)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path
                    d="M42 22 L50 12 L58 22 L50 25 Z"
                    fill="url(#goldGrad)"
                    stroke="#8C6B1C"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M34 32 C26 32 24 42 29 46 C34 49 37 45 38 41"
                    stroke="url(#goldGrad)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M66 32 C74 32 76 42 71 46 C66 49 63 45 62 41"
                    stroke="url(#goldGrad)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M38 32 C38 27 62 27 62 32 C62 42 50 42 50 48"
                    stroke="url(#goldGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line x1="50" y1="28" x2="50" y2="35" stroke="#B81D24" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="37" r="1.2" fill="#B81D24" />
                  <path
                    d="M50 45 C50 56 42 66 35 63 C29 60 32 52 38 52 C44 52 46 59 41 62"
                    stroke="url(#goldGrad)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle cx="33" cy="53" r="3" fill="#D4AF37" stroke="#8C6B1C" strokeWidth="0.5" />
                  <circle cx="50" cy="18" r="1.5" fill="#D4AF37" />
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2B2" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#8C6B1C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h3 className="font-devanagari font-bold text-sm sm:text-base text-[#7A0F17] tracking-wider leading-tight">
                ॥ ॐ श्री गणेशाय नमः ॥
              </h3>
              <p className="font-serif italic text-[8.5px] sm:text-[9.5px] text-[#8C6B1C] tracking-wide mt-0.5 max-w-[280px]">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>

              <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/35 to-[#D4AF37]/20 border border-[#D4AF37]/60">
                <span className="text-[#8C6B1C] text-[10px]">🪷</span>
                <span className="font-devanagari text-[11px] sm:text-xs font-bold text-[#7A0F17] tracking-widest uppercase">
                  शुभ विवाह
                </span>
                <span className="text-[#8C6B1C] text-[10px]">🪷</span>
              </div>
            </div>

            {/* CARD CENTER: COUPLE NAMES */}
            <div className="my-auto py-1 sm:py-2 relative z-10 w-full flex flex-col items-center">
              <p className="font-serif italic text-[#6B5A4E] text-[11px] sm:text-xs tracking-wide">
                With the divine blessings of our elders, we cordially invite you to celebrate the wedding union of
              </p>

              <div className="pt-2 sm:pt-3">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#4A080C] leading-none">
                  {brideName}
                </h2>
                <p className="text-[9px] font-serif italic text-[#8C6B1C] mt-0.5 tracking-wider">
                  Daughter of Rawat Family
                </p>
              </div>

              <div className="my-1 sm:my-2 flex items-center justify-center gap-2 w-full max-w-[220px]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
                <span className="font-script text-2xl sm:text-3xl text-[#D4AF37] leading-none px-1">
                  weds
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#4A080C] leading-none">
                  {groomName}
                </h2>
                <p className="text-[9px] font-serif italic text-[#8C6B1C] mt-0.5 tracking-wider">
                  Son of Li Family
                </p>
              </div>
            </div>

            {/* CARD BOTTOM: DATE, MUHURAT & PALACE VENUE */}
            <div className="w-full relative z-10 pb-1 flex flex-col items-center">
              <div className="w-full max-w-[270px] py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 via-[#FFF9EA] to-[#D4AF37]/10 border border-[#D4AF37]/60 shadow-xs mb-2">
                <span className="font-royal text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-[#8C6B1C] uppercase block">
                  SATURDAY • 28TH NOVEMBER 2026
                </span>
                <div className="flex items-center justify-center gap-2 my-0.5">
                  <div className="w-5 h-px bg-[#D4AF37]" />
                  <span className="font-devanagari text-[10px] sm:text-[11px] font-bold text-[#7A0F17] tracking-wider">
                    शुभ लग्न मुहूर्त : सायं 7:00 बजे
                  </span>
                  <div className="w-5 h-px bg-[#D4AF37]" />
                </div>
                <span className="font-serif italic text-[8.5px] sm:text-[9.5px] text-[#6B5A4E] block">
                  Margashirsha, Shukla Paksha
                </span>
              </div>

              <div className="text-center">
                <span className="font-royal text-[11px] sm:text-xs font-bold text-[#3D0A0F] tracking-widest uppercase block">
                  The Oberoi Udaivilas
                </span>
                <span className="font-serif text-[10px] text-[#8C6B1C] italic tracking-wide block">
                  Lake Pichola, Udaipur, Rajasthan
                </span>
                <p className="font-serif italic text-[9px] text-[#7A0F17] mt-1 font-semibold">
                  Warmly Hosted by Aditya Rawat &amp; Family
                </p>
              </div>

              <p className="font-devanagari text-[10.5px] text-[#8C6B1C] font-semibold mt-1">
                ॥ पधारो म्हारे देश ॥
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* ENVELOPE FRONT POCKET (Crimson Velvet with Scalloped V-Cut) */}
          {/* ============================================================== */}
          <div
            className="absolute inset-x-0 bottom-0 h-[64%] shadow-[0_-8px_25px_rgba(0,0,0,0.6)] flex flex-col justify-end p-5 text-center overflow-hidden"
            style={{
              zIndex: 25,
              background:
                "linear-gradient(to top, #50070B 0%, #6E0E15 60%, #87131B 100%)",
              clipPath: "polygon(0 0, 50% 32%, 100% 0, 100% 100%, 0 100%)",
              boxShadow: "inset 0 2px 4px rgba(255,215,0,0.3)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#D4AF37 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none border-t-2 border-[#D4AF37]/80"
              style={{
                clipPath: "polygon(0 0, 50% 32%, 100% 0, 100% 100%, 0 100%)",
              }}
            />

            <div className="relative z-10 mb-4 sm:mb-6">
              <span className="font-devanagari text-xs sm:text-sm text-[#FFDF73] font-bold tracking-widest block drop-shadow-md">
                ॥ शुभ विवाह ॥
              </span>
              <p className="font-serif italic text-[#FCEAC7] text-xs sm:text-sm tracking-wide mt-0.5 drop-shadow">
                Chandrika &amp; Xudong
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-1 rounded-full" />
              <p className="font-royal text-[9px] tracking-[0.2em] text-[#E0C070] uppercase mt-1">
                Royal Wedding Invitation
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* ENVELOPE TOP FLAP (3D Hinge Flip Open 180°) */}
          {/* ============================================================== */}
          <div
            className={`absolute inset-x-0 top-0 h-[62%] origin-top transition-transform ${
              isFlapOpen ? "pointer-events-none" : ""
            }`}
            style={{
              zIndex: isFlapOpen ? 10 : 35,
              transformStyle: "preserve-3d",
              transform: isFlapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              transitionDuration: "1100ms",
              transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <div
              className="w-full h-full relative flex flex-col items-center pt-3 shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
              style={{
                background:
                  "linear-gradient(180deg, #7A0F17 0%, #630C13 60%, #4D060B 100%)",
                clipPath:
                  "polygon(0 0, 100% 0, 100% 5%, 50% 100%, 0 5%)",
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
                <span className="text-[#FFDF73] text-sm sm:text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  卐 🪷 卐
                </span>
                <span className="font-devanagari text-[10px] sm:text-[11px] font-bold text-[#FFDF73] tracking-widest mt-0.5 drop-shadow">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <div className="w-12 h-0.5 bg-[#D4AF37]/60 mt-0.5 rounded-full" />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* ROYAL GOLD WAX SEAL (Embossed "C & X" with Traditional Motif) */}
          {/* ============================================================== */}
          <div
            className={`absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out cursor-pointer ${
              animStage >= 1
                ? "opacity-0 scale-125 pointer-events-none -translate-y-[70%]"
                : "opacity-100 scale-100"
            }`}
            style={{
              zIndex: 45,
              transitionDuration: "600ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="relative group">
              <div className="absolute -inset-3 rounded-full bg-[#D4AF37]/50 blur-lg animate-pulse" />

              <div
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95 shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, #FFEAA7 0%, #D4AF37 45%, #8C6B1C 80%, #5E460F 100%)",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.7)",
                }}
              >
                <div
                  className="w-full h-full rounded-full border border-[#FFE79A]/80 flex flex-col items-center justify-center shadow-inner"
                  style={{
                    background:
                      "linear-gradient(135deg, #DFB758 0%, #B88E28 50%, #8C6B1C 100%)",
                  }}
                >
                  <span className="font-royal font-bold text-base sm:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-tight">
                    C &amp; X
                  </span>
                  <span className="text-[7px] text-[#FFF6D4] tracking-widest uppercase font-mono leading-none -mt-0.5">
                    🪷 SEAL 🪷
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2 pointer-events-auto z-50 w-full max-w-[320px]">
          {isCardRevealed ? (
            <button
              onClick={handleDirectEnter}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-[#2C070B] font-bold text-xs sm:text-sm tracking-widest uppercase shadow-[0_8px_30px_rgba(212,175,55,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_35px_rgba(212,175,55,0.7)] active:scale-98 flex items-center justify-center gap-2 animate-bounce-soft"
            >
              <span>शुभ विवाह में प्रवेश करें • Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleEnvelopeClick}
              className="px-5 py-2 rounded-full bg-[#3D0A0F]/85 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5E5B8] text-xs font-serif tracking-wider shadow-lg hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>Tap to Open Royal Invitation</span>
            </button>
          )}

          <span className="text-[10px] text-[#D4AF37]/75 font-serif italic tracking-wide">
            {isCardRevealed
              ? "Tap button or anywhere to view full wedding celebrations"
              : "Chandrika & Xudong • 28 November 2026 • The Oberoi Udaivilas"}
          </span>
        </div>
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
            transform: translateY(-4px);
          }
        }
        .animate-bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Envelope;
