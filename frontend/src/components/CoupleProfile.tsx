import { Heart } from "lucide-react";
import React from "react";
import type { AppConfig } from "../types";

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const CoupleProfile: React.FC<{ config: AppConfig }> = ({ config }) => {
  const { bride, groom } = config.couple;
  return (
    <section
      id="couple"
      className="dark:bg-darkBg relative bg-[#FAF5EB] py-24 transition-colors duration-1000 md:py-36 border-t border-[#D4AF37]/20"
    >
      <div className="relative z-10 container mx-auto max-w-6xl px-6">
        <div className="mb-20 space-y-5 text-center md:mb-28">
          <Heart className="text-[#8C1D24]/60 dark:text-accent/40 mx-auto mb-4 h-6 w-6 animate-pulse" />
          <span className="text-[#8C6B1C] dark:text-accent font-serif text-xl sm:text-2xl italic">
            {config.text.opening.salam}
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#231C18] italic dark:text-white">
            The Happy Couple
          </h2>
          <div className="bg-[#D4AF37]/40 mx-auto h-[1px] w-24"></div>
          <p className="mx-auto max-w-3xl font-serif text-lg sm:text-xl md:text-2xl leading-relaxed font-light text-balance text-[#5A4D43] italic dark:text-slate-300">
            {config.text.quote.ar_rum}
          </p>
          <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-[#8C6B1C] uppercase">
            {config.text.quote.source}
          </p>
        </div>
        <div className="grid items-start gap-16 md:grid-cols-2 md:gap-24">
          <div className="group flex flex-col items-center space-y-8 text-center md:items-end md:text-right">
            <div className="relative">
              <div className="border-[#D4AF37]/40 dark:border-accent/20 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6"></div>
              <img
                src={groom.image}
                className="dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-[#FFFDF9] ring-2 ring-[#D4AF37]/50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-105 md:h-[22rem] md:w-[22rem]"
                alt={groom.name}
              />
            </div>
            <div className="space-y-3 md:space-y-5">
              <h3 className="font-script text-5xl sm:text-7xl md:text-8xl text-[#231C18] py-1 dark:text-white drop-shadow-sm">
                {groom.fullName}
              </h3>
              <p className="font-sans ml-auto max-w-xs text-[11px] font-medium tracking-[0.2em] text-balance text-[#5A4D43] uppercase md:max-w-sm md:text-[13px] dark:text-slate-400">
                {groom.parents}
              </p>
              <a
                href={`https://instagram.com/${groom.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[#8C6B1C] hover:text-[#8C1D24] inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/40 bg-[#FFFDF9] px-6 py-2.5 shadow-2xs transition-all hover:scale-105 dark:border-white/10 dark:bg-white/5 dark:hover:text-white"
              >
                <InstagramIcon className="h-3.5 w-3.5 text-[#8C1D24]" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  @{groom.instagram}
                </span>
              </a>
            </div>
          </div>
          <div className="group flex flex-col items-center space-y-8 text-center md:items-start md:text-left">
            <div className="relative">
              <div className="border-[#D4AF37]/40 dark:border-accent/20 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6"></div>
              <img
                src={bride.image}
                className="dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-[#FFFDF9] ring-2 ring-[#D4AF37]/50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-105 md:h-[22rem] md:w-[22rem]"
                alt={bride.name}
              />
            </div>
            <div className="space-y-3 md:space-y-5">
              <h3 className="font-script text-5xl sm:text-7xl md:text-8xl text-[#231C18] py-1 dark:text-white drop-shadow-sm">
                {bride.fullName}
              </h3>
              <p className="font-sans max-w-xs text-[11px] font-medium tracking-[0.2em] text-balance text-[#5A4D43] uppercase md:max-w-sm md:text-[13px] dark:text-slate-400">
                {bride.parents}
              </p>
              <a
                href={`https://instagram.com/${bride.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[#8C6B1C] hover:text-[#8C1D24] inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/40 bg-[#FFFDF9] px-6 py-2.5 shadow-2xs transition-all hover:scale-105 dark:border-white/10 dark:bg-white/5 dark:hover:text-white"
              >
                <InstagramIcon className="h-3.5 w-3.5 text-[#8C1D24]" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  @{bride.instagram}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleProfile;
