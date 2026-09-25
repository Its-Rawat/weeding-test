import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
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
  // Animation Sequence:
  // 0: 'closed' - Full-screen envelope held shut by sacred Hindu Mauli / Kalawa thread (NO auto-open, NO skip button)
  // 1: 'untying_mauli' - Knot loosens, sacred red-yellow Kalawa threads pull away left & right (500ms)
  // 2: 'opening_envelope' - Top & bottom envelope halves part open smoothly (850ms)
  // 3: 'revealing_site' - Seamless scale-dissolve into the website hero with petal shower (650ms)
  // 4: 'done' - Completed, onOpen() called and scroll unlocked
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

    // Floating celebratory marigold & rose petals (गेंदा और गुलाब की पंखुड़ियाँ)
    const generatedPetals: PetalParticle[] = Array.from({ length: 26 }, (_, i) => ({
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

    // Strictly user-initiated: No auto-opening timer, no skip button
    return () => {
      clearAllTimers();
      window.removeEventListener("wedding-music-state", handleAudioState);
    };
  }, []);

  // When user clicks the Sacred Mauli / Kalawa knot or envelope to untie it
  const handleUntieMauli = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (animStage === 0) {
      // Step 1: Untie sacred Mauli thread & play wedding shehnai
      window.dispatchEvent(new CustomEvent("play-wedding-music"));
      setAnimStage(1);

      // Step 2: Part envelope flaps open in 3D
      const t1 = setTimeout(() => {
        setAnimStage(2);
      }, 500);

      // Step 3: Smooth dissolve into new page
      const t2 = setTimeout(() => {
        setAnimStage(3);
      }, 1350);

      // Step 4: Finish and trigger onOpen
      const t3 = setTimeout(() => {
        setAnimStage(4);
        onOpen();
      }, 1950);

      timerRefs.current = [t1, t2, t3];
    }
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioMuted((prev) => !prev);
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const isMauliUntied = animStage >= 1;
  const isEnvelopeOpening = animStage >= 2;
  const isRevealingSite = animStage >= 3;
  const isDone = animStage >= 4;

  const brideName = config?.couple?.bride?.name || "Chandrika";
  const groomName = config?.couple?.groom?.name || "Xudong";

  if (isDone) return null;

  return (
    <div
      onClick={animStage === 0 ? handleUntieMauli : undefined}
      className={`fixed inset-0 z-[2000] w-full h-[100dvh] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out cursor-pointer ${
        isRevealingSite
          ? "opacity-0 scale-105 pointer-events-none filter blur-xs"
          : "opacity-100 scale-100"
      }`}
      style={{
        perspective: "1600px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* AUSPICIOUS MARIGOLD & ROSE PETALS (गेंदे और गुलाब के फूल) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
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
        {/* Shehnai / Music Toggle Button */}
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

        {/* Empty placeholder on right to keep center badge balanced (No Skip button) */}
        <div className="w-10 sm:w-20" />
      </header>

      {/* ========================================================================= */}
      {/* FULL-SCREEN HINDU WEDDING ENVELOPE (कनकोत्री / लग्न पत्रिका का लिफाफा)     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-[100dvh] overflow-hidden pointer-events-none">
        
        {/* UPPER HALF: TOP ENVELOPE FLAP (with Lord Ganesha & Sacred Vedic Shloka) */}
        <div
          className={`absolute inset-x-0 top-0 h-[52%] origin-top transition-transform duration-[850ms] ${
            isEnvelopeOpening ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          }`}
          style={{
            zIndex: 25,
            transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="w-full h-full relative flex flex-col items-center justify-center p-6 border-b-2 border-[#D4AF37] shadow-[0_15px_35px_rgba(140,107,28,0.2)]"
            style={{
              // Warm Ivory & Champagne Raw Silk Stationery Texture
              background: "linear-gradient(175deg, #FAF5EE 0%, #F5ECE0 60%, #EBE0D0 100%)",
            }}
          >
            {/* Outer Gold Foil Jaali Border Inset */}
            <div className="absolute inset-3 sm:inset-5 rounded-2xl border-2 border-[#D4AF37]/50 pointer-events-none">
              <div className="absolute top-2 left-2 text-[#8C6B1C] text-sm">✦</div>
              <div className="absolute top-2 right-2 text-[#8C6B1C] text-sm">✦</div>
            </div>

            {/* Sacred Lord Ganesha Header */}
            <div className="relative z-10 flex flex-col items-center text-center mt-6 sm:mt-8">
              {/* Golden Lord Ganesha Silhouette with Tilak and Modak */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 rounded-full border border-[#D4AF37]/60 bg-white/70 shadow-sm p-1.5 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-[0_2px_4px_rgba(140,107,28,0.3)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path
                    d="M42 22 L50 12 L58 22 L50 25 Z"
                    fill="url(#goldGradMauli)"
                    stroke="#8C6B1C"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M34 32 C26 32 24 42 29 46 C34 49 37 45 38 41"
                    stroke="url(#goldGradMauli)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M66 32 C74 32 76 42 71 46 C66 49 63 45 62 41"
                    stroke="url(#goldGradMauli)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M38 32 C38 27 62 27 62 32 C62 42 50 42 50 48"
                    stroke="url(#goldGradMauli)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line x1="50" y1="28" x2="50" y2="35" stroke="#8C1D24" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="37" r="1.2" fill="#8C1D24" />
                  <path
                    d="M50 45 C50 56 42 66 35 63 C29 60 32 52 38 52 C44 52 46 59 41 62"
                    stroke="url(#goldGradMauli)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle cx="33" cy="53" r="3" fill="#D4AF37" stroke="#8C6B1C" strokeWidth="0.5" />
                  <circle cx="50" cy="18" r="1.5" fill="#D4AF37" />
                  <defs>
                    <linearGradient id="goldGradMauli" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2B2" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#8C6B1C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h2 className="font-devanagari font-bold text-base sm:text-lg text-[#8C1D24] tracking-wider leading-tight">
                ॥ ॐ श्री गणेशाय नमः ॥
              </h2>
              <p className="font-serif italic text-[9px] sm:text-[11px] text-[#8C6B1C] tracking-wide mt-1 max-w-[320px]">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-2" />
            </div>
          </div>
        </div>

        {/* LOWER HALF: BOTTOM ENVELOPE POCKET (with Shubh Vivah Calligraphy & Couple Names) */}
        <div
          className={`absolute inset-x-0 bottom-0 h-[52%] origin-bottom transition-transform duration-[850ms] ${
            isEnvelopeOpening ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          }`}
          style={{
            zIndex: 25,
            transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="w-full h-full relative flex flex-col items-center justify-center p-6 border-t-2 border-[#D4AF37] shadow-[0_-15px_35px_rgba(140,107,28,0.2)]"
            style={{
              background: "linear-gradient(5deg, #FAF5EE 0%, #F5ECE0 60%, #EBE0D0 100%)",
            }}
          >
            {/* Outer Gold Foil Jaali Border Inset */}
            <div className="absolute inset-3 sm:inset-5 rounded-2xl border-2 border-[#D4AF37]/50 pointer-events-none">
              <div className="absolute bottom-2 left-2 text-[#8C6B1C] text-sm">✦</div>
              <div className="absolute bottom-2 right-2 text-[#8C6B1C] text-sm">✦</div>
            </div>

            {/* Couple Calligraphy on Lower Envelope Face */}
            <div className="relative z-10 flex flex-col items-center text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 mb-2">
                <span className="text-[#8C6B1C] text-xs">🪷</span>
                <span className="font-devanagari text-xs sm:text-sm font-bold text-[#8C1D24] tracking-widest uppercase">
                  शुभ विवाह
                </span>
                <span className="text-[#8C6B1C] text-xs">🪷</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
                {brideName}
              </h1>
              <span className="font-script text-3xl sm:text-4xl text-[#d4af37] block my-0.5">
                &amp;
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
                {groomName}
              </h1>

              <div className="mt-2 text-center">
                <p className="font-royal text-[10px] sm:text-xs tracking-[0.25em] text-[#8C6B1C] uppercase font-semibold">
                  Saturday • 28 November 2026
                </p>
                <p className="font-serif italic text-stone-600 text-xs sm:text-sm mt-0.5">
                  The Oberoi Udaivilas • Lake Pichola, Udaipur
                </p>
                <p className="font-serif italic text-[10px] text-[#8C1D24] font-semibold mt-1">
                  Warmly Hosted by Aditya Rawat &amp; Family
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SACRED HINDU MAULI / KALAWA / RAKSHA SUTRA THREAD (कलावा / मौली धागा)     */}
        {/* Red & Yellow twisted sacred ritual thread holding the envelope closed      */}
        {/* ========================================================================= */}
        <div
          className={`absolute top-1/2 inset-x-0 -translate-y-1/2 flex items-center justify-between pointer-events-none transition-all duration-500 ${
            isMauliUntied ? "opacity-0 scale-y-50" : "opacity-100 scale-y-100"
          }`}
          style={{ zIndex: 40 }}
        >
          {/* LEFT MAULI THREADS - Unravels to the left when untied */}
          <div
            className={`w-1/2 flex flex-col gap-1.5 transition-transform duration-700 ease-out ${
              isMauliUntied ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Strand 1: Top Twisted Mauli Cord */}
            <div
              className="w-full h-2 sm:h-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #B71C1C 0px, #B71C1C 6px, #FBC02D 6px, #FBC02D 12px, #E65100 12px, #E65100 14px)",
                borderRadius: "2px",
              }}
            />
            {/* Strand 2: Center Twisted Mauli Cord */}
            <div
              className="w-full h-2.5 sm:h-3 shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #FBC02D 0px, #FBC02D 6px, #C62828 6px, #C62828 12px, #FF8F00 12px, #FF8F00 14px)",
                borderRadius: "2px",
              }}
            />
            {/* Strand 3: Bottom Twisted Mauli Cord */}
            <div
              className="w-full h-2 sm:h-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #B71C1C 0px, #B71C1C 6px, #FBC02D 6px, #FBC02D 12px, #E65100 12px, #E65100 14px)",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* RIGHT MAULI THREADS - Unravels to the right when untied */}
          <div
            className={`w-1/2 flex flex-col gap-1.5 transition-transform duration-700 ease-out ${
              isMauliUntied ? "translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Strand 1 */}
            <div
              className="w-full h-2 sm:h-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #B71C1C 0px, #B71C1C 6px, #FBC02D 6px, #FBC02D 12px, #E65100 12px, #E65100 14px)",
                borderRadius: "2px",
              }}
            />
            {/* Strand 2 */}
            <div
              className="w-full h-2.5 sm:h-3 shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #FBC02D 0px, #FBC02D 6px, #C62828 6px, #C62828 12px, #FF8F00 12px, #FF8F00 14px)",
                borderRadius: "2px",
              }}
            />
            {/* Strand 3 */}
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

        {/* ========================================================================= */}
        {/* SACRED KALAWA KNOT & AUSPICIOUS SHAGUN SEAL (पवित्र कलावा गांठ और मंगल मुहर)*/}
        {/* TAP ON IT TO UNTIE MAULI & UNBOX THE INVITATION                             */}
        {/* ========================================================================= */}
        <div
          onClick={handleUntieMauli}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out cursor-pointer pointer-events-auto ${
            isMauliUntied
              ? "opacity-0 scale-125 pointer-events-none -translate-y-[80%]"
              : "opacity-100 scale-100 hover:scale-108 active:scale-95"
          }`}
          style={{
            zIndex: 45,
            transitionDuration: "450ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative group flex flex-col items-center">
            {/* Sacred Haldi & Kumkum Radiance Glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#E65100]/50 via-[#FBC02D]/60 to-[#B71C1C]/50 blur-lg animate-pulse" />

            {/* Sacred Mauli Knot Frayed Cotton Ends (लाल-पीले धागे के लच्छे) */}
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
              className="w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1.5 flex items-center justify-center shadow-[0_14px_35px_rgba(183,28,28,0.5)] border-2 border-[#FFD54F] transition-transform group-hover:scale-105"
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
                पवित्र कलावा खोलें • Tap Mauli to Open
              </span>
            </div>
          </div>
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
