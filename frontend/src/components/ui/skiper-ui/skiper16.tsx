import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Skiper 16 Card Stack Scroll Component — React + Framer Motion
 * Adapted from Skiper UI (@skiper-ui/skiper16: Card stack scroll)
 * Features stacked cards with scroll-triggered sticky reveal and depth scaling.
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
      className="sticky top-20 sm:top-24 md:top-28 flex items-center justify-center pointer-events-auto"
    >
      <motion.div
        style={{
          scale,
          top: `calc(${i * 22}px)`,
        }}
        className={cn(
          "relative flex flex-col overflow-hidden origin-top",
          "w-[90vw] max-w-[360px] sm:max-w-[460px] md:max-w-[540px]",
          "h-[400px] sm:h-[460px] md:h-[500px]",
          "rounded-3xl border border-[#D4AF37]/60 shadow-[0_25px_60px_rgba(0,0,0,0.35)]",
          "bg-[#1A1412] dark:bg-[#120F0E] transition-shadow duration-500"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />

        {/* Golden Hairline Corner Accents */}
        <div className="absolute top-3 left-3 text-[10px] text-[#D4AF37]/70 font-serif select-none pointer-events-none">
          ✦
        </div>
        <div className="absolute top-3 right-3 text-[10px] text-[#D4AF37]/70 font-serif select-none pointer-events-none">
          ✦
        </div>

        {/* Card Header Tag */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] bg-black/50 backdrop-blur-md text-[#FFE082] border border-[#D4AF37]/50 shadow-sm">
            {item.tag}
          </span>
          <span className="text-[11px] font-serif font-light text-white/70 italic bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
            {i + 1} / {totalCards}
          </span>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white space-y-1.5">
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
      className={cn("relative flex w-full flex-col items-center justify-start pb-24", className)}
    >
      {photos.map((photo, i) => {
        // Calculate progressive scaling for each card in the stack
        const targetScale = Math.max(0.78, 1 - (photos.length - i - 1) * 0.045);
        const step = 1 / Math.max(1, photos.length);
        const start = i * step * 0.7;

        return (
          <StickyCard
            key={photo.id || `photo_${i}`}
            i={i}
            item={photo}
            progress={scrollYProgress}
            range={[start, 1]}
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
