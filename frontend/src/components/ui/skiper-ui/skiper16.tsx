import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Skiper 16 Sticky Card Stack Scroll Component — React + Framer Motion
 * Direct faithful implementation of https://skiper-ui.com/v1/preview/skiper16
 * Creates an authentic physical card deck that sticks and scales as you scroll.
 */

export interface StackPhoto {
  id: string;
  title: string;
  tag: string;
  caption: string;
  src: string;
}

interface StickyCardProps {
  i: number;
  item: StackPhoto;
  progress: any;
  range: [number, number];
  targetScale: number;
  totalCards: number;
}

const StickyCard: React.FC<StickyCardProps> = ({
  i,
  item,
  progress,
  range,
  targetScale,
  totalCards,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center pointer-events-auto"
    >
      <motion.div
        style={{
          scale,
          top: `calc(12vh + ${i * 22}px)`,
        }}
        className={cn(
          "rounded-3xl sm:rounded-4xl relative flex flex-col overflow-hidden origin-top",
          "w-[90vw] max-w-[350px] sm:max-w-[460px] md:max-w-[540px]",
          "h-[380px] sm:h-[440px] md:h-[480px]",
          "border border-[#D4AF37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.45)]",
          "bg-[#1A1412] text-white select-none"
        )}
      >
        {/* Full-bleed Photo */}
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover object-center select-none"
          loading="lazy"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 pointer-events-none" />

        {/* Card Header Tag */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md text-[#FFE082] border border-[#D4AF37]/50 shadow-sm">
            {item.tag}
          </span>
          <span className="text-[11px] font-serif font-light text-white/70 italic bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
            {i + 1} / {totalCards}
          </span>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 space-y-1.5">
          <h3 className="font-serif italic text-2xl sm:text-3xl text-[#FFFDF9] font-normal drop-shadow-md">
            {item.title}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-stone-200/90 font-light leading-relaxed drop-shadow-sm max-w-md">
            {item.caption}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const Skiper16CardStack: React.FC<{
  photos?: StackPhoto[];
  className?: string;
}> = ({ photos = DEFAULT_PHOTOS, className }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={container}
      className={cn(
        "relative flex w-full flex-col items-center justify-start pb-[80vh] pt-4",
        className
      )}
    >
      {photos.map((photo, i) => {
        // Faithful Skiper 16 math: each card scales down as the stack accumulates
        const targetScale = Math.max(0.7, 1 - (photos.length - i - 1) * 0.05);
        const step = 1 / Math.max(1, photos.length);
        const range: [number, number] = [i * step * 0.8, 1];

        return (
          <StickyCard
            key={photo.id || `photo_${i}`}
            i={i}
            item={photo}
            progress={scrollYProgress}
            range={range}
            targetScale={targetScale}
            totalCards={photos.length}
          />
        );
      })}
    </div>
  );
};

export const DEFAULT_PHOTOS: StackPhoto[] = [
  {
    id: "photo-1",
    tag: "Chapter 01 • The Beginning",
    title: "The Proposal",
    caption: "Where two separate journeys softly converged into one lifelong path.",
    src: "/couple/proposal_story.jpg",
  },
  {
    id: "photo-2",
    tag: "Chapter 02 • The Promise",
    title: "Ring Reveal & Eternal Yes",
    caption: "A spark of light beneath the starry bridge, sealing tomorrow.",
    src: "/couple/ring_reveal.jpg",
  },
  {
    id: "photo-3",
    tag: "Chapter 03 • Serenity",
    title: "Winter in the Snowy Pines",
    caption: "Warm smiles amidst freezing mountain air and snow-draped evergreens.",
    src: "/couple/snow_winter.jpg",
  },
  {
    id: "photo-4",
    tag: "Chapter 04 • Adventures",
    title: "Wanderlust & Horizons",
    caption: "Exploring vibrant cityscapes, golden sunsets, and distant horizons together.",
    src: "/couple/travel_fun.jpg",
  },
  {
    id: "photo-5",
    tag: "Chapter 05 • Candid Magic",
    title: "Street Joy & Tuk-Tuk Rides",
    caption: "The unscripted laughter and spontaneous joy that brightens every ordinary day.",
    src: "/couple/tuktuk_candid.jpg",
  },
  {
    id: "photo-6",
    tag: "Chapter 06 • Royal Nuptials",
    title: "Chandrika & Xudong",
    caption: "Stepping into forever with open hearts, blessed by family and timeless love.",
    src: "/couple/formal_portrait.jpg",
  },
];

export default Skiper16CardStack;
