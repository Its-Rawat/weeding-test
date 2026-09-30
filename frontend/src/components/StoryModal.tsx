import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

interface StorySlide {
  image: string;
  chapter: string;
  title: string;
  subtitle: string;
  caption: string;
}

const STORY_SLIDES: StorySlide[] = [
  {
    image: "/couple/snow_winter.jpg",
    chapter: "Chapter 01",
    title: "The Snowy Trails",
    subtitle: "Where our journey began",
    caption:
      "Wrapped in winter warmth, shared laughter, and quiet pine trees that witnessed the start of our story.",
  },
  {
    image: "/couple/tuktuk_candid.jpg",
    chapter: "Chapter 02",
    title: "Joy & Sweet Laughter",
    subtitle: "Finding magic in simple moments",
    caption:
      "From fun rickshaw rides to late-night chats, every ordinary day turned into an extraordinary memory.",
  },
  {
    image: "/couple/travel_fun.jpg",
    chapter: "Chapter 03",
    title: "Adventures Near & Far",
    subtitle: "Exploring the world together",
    caption:
      "Hand in hand through sunny skies and new horizons, discovering that home is wherever we are together.",
  },
  {
    image: "/couple/proposal_story.jpg",
    chapter: "Chapter 04",
    title: "Under Tropical Stars",
    subtitle: "The proposal on the bridge",
    caption:
      "A knee on the wooden bridge, a box opened under the palms, and a question straight from the heart.",
  },
  {
    image: "/couple/ring_reveal.jpg",
    chapter: "Chapter 05",
    title: "She Said YES!",
    subtitle: "A lifetime promise begins",
    caption:
      "With tears of pure happiness, glowing lanterns, and full hearts ready to spend forever as one.",
  },
  {
    image: "/couple/formal_portrait.jpg",
    chapter: "Chapter 06",
    title: "Stepping Into Forever",
    subtitle: "Under the Holy Mandap",
    caption:
      "Chandrika & Xudong warmly welcome you to celebrate their wedding nuptials on February 14 & 15, 2027 in Gurugram.",
  },
];

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % STORY_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + STORY_SLIDES.length) % STORY_SLIDES.length);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    },
    [isOpen, onClose, handleNext, handlePrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const currentSlide = STORY_SLIDES[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md px-3 sm:px-6 py-4 animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Lightbox Container Card */}
      <div
        className="relative w-full max-w-xl max-h-[92dvh] bg-[#FFFDF9] dark:bg-[#1A1512] rounded-3xl border-2 border-[#D4AF37]/80 shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress Story Bars at the top */}
        <div className="absolute top-3 inset-x-4 z-30 flex items-center gap-1.5 pointer-events-none">
          {STORY_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full bg-white/40 overflow-hidden backdrop-blur-xs"
            >
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "bg-[#D4AF37]"
                    : idx < currentIndex
                    ? "bg-[#D4AF37]/90"
                    : "bg-transparent"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Header Controls */}
        <div className="relative z-30 pt-6 px-4 sm:px-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#FAF5EB] dark:bg-black/30 border border-[#D4AF37]/60 flex items-center justify-center text-[#8C1D24]">
              <Heart className="w-3.5 h-3.5 fill-[#8C1D24]/20" />
            </span>
            <div>
              <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#8C6B1C] uppercase block">
                {currentSlide.chapter} • {currentIndex + 1} of {STORY_SLIDES.length}
              </span>
              <h4 className="font-serif italic text-sm sm:text-base font-bold text-[#231C18] dark:text-white leading-tight">
                {currentSlide.title}
              </h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF5EB] dark:bg-black/40 hover:bg-[#F3E7D5] border border-[#D4AF37]/60 flex items-center justify-center text-[#5A4D43] dark:text-stone-300 hover:text-[#8C1D24] transition-all cursor-pointer shadow-xs"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Showcase Stage */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] max-h-[52dvh] w-full bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden mx-auto my-1">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-contain object-center transition-all duration-500 max-h-[52dvh]"
          />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
            title="Previous Photo (←)"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
            title="Next Photo (→)"
          >
            <ChevronRight className="w-5 h-5 -mr-0.5" />
          </button>
        </div>

        {/* Bottom Story Caption & Micro-Thumbnails */}
        <div className="p-4 sm:p-5 text-center bg-[#FAF5EB] dark:bg-[#120F0D] border-t border-[#D4AF37]/30 space-y-2.5">
          <p className="font-serif italic text-xs sm:text-sm text-[#8C6B1C] font-semibold">
            "{currentSlide.subtitle}"
          </p>
          <p className="font-sans text-xs text-[#5A4D43] dark:text-stone-300 max-w-md mx-auto leading-relaxed">
            {currentSlide.caption}
          </p>

          {/* Thumbnail Pill Selector */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {STORY_SLIDES.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "border-[#8C1D24] ring-2 ring-[#D4AF37] scale-105"
                    : "border-[#D4AF37]/40 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
