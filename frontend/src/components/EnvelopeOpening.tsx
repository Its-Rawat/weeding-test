import React, { useState, useEffect } from "react";
import { Sparkles, Volume2, VolumeX } from "lucide-react";

interface EnvelopeOpeningProps {
  onOpen: () => void;
  coupleNames?: string;
}

export const EnvelopeOpening: React.FC<EnvelopeOpeningProps> = ({
  onOpen,
  coupleNames = "Aditya & Ananya",
}) => {
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [guestName, setGuestName] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);

    const t1 = setTimeout(() => setAnimationStep(1), 700);
    const t2 = setTimeout(() => {
      setAnimationStep(2);
      window.dispatchEvent(new CustomEvent("play-wedding-music"));
    }, 1300);
    const t3 = setTimeout(() => setAnimationStep(3), 2100);
    const t4 = setTimeout(() => {
      setAnimationStep(4);
      setTimeout(() => onOpen(), 700);
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onOpen]);

  const handleSkipOrOpen = () => {
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setAnimationStep(4);
    setTimeout(() => onOpen(), 300);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  const isFlapOpen = animationStep >= 2;
  const isCardElevating = animationStep >= 3;
  const isFinished = animationStep >= 4;

  return (
    <div
      onClick={handleSkipOrOpen}
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#F7F2EB] select-none transition-all duration-1000 overflow-hidden ${
        isFinished ? "opacity-0 pointer-events-none scale-102" : "opacity-100"
      }`}
      style={{ perspective: "1500px" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF5EE] via-[#F4ECE2] to-[#ECE1D5] opacity-95">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#8C7355_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {guestName && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF5EE]/90 backdrop-blur-md border border-[#8C7355]/30 text-[#4A4238] text-xs font-serif italic shadow-sm tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Delivered for {guestName}
          </span>
        </div>
      )}

      <div
        className="relative w-full max-w-[390px] sm:max-w-[440px] h-[86vh] sm:h-[82vh] max-h-[740px] flex flex-col items-center justify-end px-3 transition-transform duration-700"
        style={{ perspective: "1500px" }}
      >
        <div className="absolute inset-x-4 -bottom-3 top-12 bg-[#2C241B]/15 rounded-3xl blur-2xl pointer-events-none" />

        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#FAF4EC] via-[#F3EADE] to-[#EBE0D2] border border-[#8C7355]/30 shadow-2xl overflow-hidden flex flex-col justify-end">
          
          <div className="absolute inset-x-2 top-2 bottom-16 rounded-xl bg-[#FAF6EE] overflow-hidden border border-[#C5A059]/30">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#7D9D8B_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-6 inset-x-0 flex flex-col items-center text-center opacity-75">
              <span className="text-3xl filter drop-shadow-xs">🌿 🕊️ 🌿</span>
              <p className="font-serif italic text-xs text-[#5C6B50] tracking-widest mt-1 uppercase">
                Cap d'Antibes • France
              </p>
              <div className="w-24 h-0.5 bg-[#7D9D8B]/40 mt-1 rounded-full" />
            </div>
          </div>

          {/* THE DECKLED INVITATION CARD */}
          <div
            className={`absolute inset-x-4 bottom-4 h-[94%] bg-[#FAF6EE] rounded-t-[120px] sm:rounded-t-[160px] rounded-b-xl border border-[#C5A059]/40 shadow-xl p-6 flex flex-col items-center justify-between text-center transition-all duration-[1600ms] ease-out ${
              isCardElevating
                ? "-translate-y-[88%] sm:-translate-y-[80%] scale-[1.03] shadow-2xl"
                : "translate-y-0"
            }`}
            style={{ zIndex: 15 }}
          >
            <div className="absolute inset-2 rounded-t-[112px] sm:rounded-t-[152px] rounded-b-lg border border-[#7D9D8B]/25 pointer-events-none" />

            <div className="pt-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#8C7355] bg-white/90 shadow-xs flex items-center justify-center mb-1">
                <span className="font-serif font-bold text-sm text-[#722F37] tracking-tight">A &amp; A</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-[#5C6B50] font-semibold">
                Destination Nuptials
              </span>
            </div>

            <div className="my-auto py-2 space-y-1">
              <p className="font-serif italic text-[#6B6155] text-xs">
                Request the pleasure of your company
              </p>
              <p className="font-serif italic text-[#6B6155] text-xs">
                as they celebrate their wedding
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2A2F2B] tracking-tight font-medium pt-2">
                {coupleNames}
              </h2>
            </div>

            <div className="py-2.5 border-y border-[#C5A059]/40 w-full max-w-[220px]">
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#5C6B50] uppercase block">
                SATURDAY
              </span>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2A2F2B] leading-none my-1 block">
                26
              </span>
              <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[#5C6B50] uppercase block">
                SEPTEMBER 2026
              </span>
            </div>

            <div className="pb-1">
              <span className="text-[11px] font-serif font-semibold text-[#2A2F2B] tracking-widest uppercase block">
                Plage Keller • Cap d'Antibes
              </span>
              <span className="text-[9px] text-[#7D9D8B] font-sans uppercase tracking-[0.2em] block mt-0.5">
                French Riviera • France
              </span>
            </div>
          </div>

          {/* FRONT POCKET */}
          <div
            className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#E9DECة] via-[#F2E8DC] to-[#FAF3EA] border-t border-[#8C7355]/30 shadow-inner flex flex-col justify-end p-6 text-center"
            style={{
              zIndex: 25,
              clipPath: "polygon(0 0, 50% 28%, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="relative z-10 mb-6 sm:mb-8">
              <p className="font-serif italic text-[#3E3831] text-sm sm:text-base tracking-wide font-normal">
                Requests the pleasure
              </p>
              <p className="font-serif italic text-[#3E3831] text-sm sm:text-base tracking-wide font-normal -mt-1">
                of your company
              </p>
              <div className="w-16 h-0.5 bg-[#C5A059]/50 mx-auto mt-2 rounded-full" />
            </div>
          </div>

          {/* TOP FLAP */}
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
              className="w-full h-full bg-gradient-to-b from-[#F2E5D8] via-[#EDE0D2] to-[#E3D3C3] shadow-lg relative border-b border-[#8C7355]/40"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            >
              <div
                className="absolute inset-0 border-b-2 border-[#C5A059]/50"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
            </div>
          </div>

          {/* BURGUNDY WAX SEAL */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
              animationStep >= 1 ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
            }`}
            style={{ zIndex: 45 }}
          >
            <div className="relative group">
              <div className="absolute -inset-2.5 rounded-full bg-[#722F37]/30 blur-md animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8C3B43] via-[#722F37] to-[#4A1D23] p-0.5 shadow-[0_10px_25px_rgba(74,29,35,0.5)] flex items-center justify-center border-2 border-[#FAF4EC]/80">
                <div className="w-full h-full rounded-full border border-[#4A1D23]/60 flex flex-col items-center justify-center bg-gradient-to-br from-[#7A333B] to-[#5C232A] text-[#FAF4EC] shadow-inner">
                  <span className="font-serif font-bold text-sm tracking-tight text-[#FAF4EC] drop-shadow-sm">
                    A &amp; A
                  </span>
                  <span className="text-[6px] uppercase tracking-widest text-[#E8C4C4] font-mono leading-none mt-0.5">
                    SEAL
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between pointer-events-auto z-50">
          <button
            onClick={handleToggleSound}
            className="w-10 h-10 rounded-full bg-[#FAF5EE]/90 backdrop-blur-md border border-[#8C7355]/30 shadow-md flex items-center justify-center text-[#4A4238] active:scale-95 transition-all"
            title="Toggle Wedding Music"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#722F37] animate-pulse" />
            )}
          </button>

          <button
            onClick={handleSkipOrOpen}
            className="px-4 py-1.5 rounded-full bg-[#FAF5EE]/90 backdrop-blur-md border border-[#8C7355]/30 text-[#4A4238] text-[10px] font-sans font-semibold uppercase tracking-widest shadow-sm hover:bg-white active:scale-95 transition-all"
          >
            Open Invitation
          </button>
        </div>

      </div>
    </div>
  );
};

export default EnvelopeOpening;
