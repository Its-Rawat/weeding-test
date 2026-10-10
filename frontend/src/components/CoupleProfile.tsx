import React, { useState } from "react";
import { Heart, PenTool, Image as ImageIcon } from "lucide-react";
import type { AppConfig } from "../types";
import { EtchingFrameCorners } from "./ui/EtchingCorner";

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const CoupleProfile: React.FC<{ config: AppConfig }> = ({ config }) => {
  const { bride, groom } = config.couple;
  const [brideMode, setBrideMode] = useState<"etching" | "photo">("etching");
  const [groomMode, setGroomMode] = useState<"etching" | "photo">("etching");

  return (
    <section
      id="couple"
      className="relative bg-[#FFFBF0] dark:bg-[#151111] py-20 md:py-32 border-t border-[#374454]/15 dark:border-[#C5A059]/20 transition-colors duration-1000 overflow-hidden"
    >
      <div className="relative z-10 container mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Editorial Section Header (Huey Lightshop Style) */}
        <div className="mb-16 md:mb-24 space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs text-[#8C1D24] dark:text-[#C5A059] tracking-[0.25em] uppercase font-sans font-semibold">
            <span>🪷</span>
            <span>Artistic Portraiture</span>
            <span>🪷</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#232B35] dark:text-white tracking-tight">
            The Bride &amp; Groom
          </h2>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
            <span className="text-[#C5A059] text-xs">✦</span>
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
          </div>

          <p className="font-editorial italic text-lg sm:text-xl text-[#556272] dark:text-stone-300 leading-relaxed font-light">
            "{config.text.quote?.ar_rum || "Two souls united under sacred stars, embarking on a timeless voyage of love, harmony, and shared dreams."}"
          </p>

          <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-[#374454] dark:text-[#C5A059] uppercase">
            {config.text.quote?.source || "Sacred Vedic Nuptials"}
          </p>
        </div>

        {/* 2-Column Editorial Spread: Groom & Bride */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          
          {/* 1. GROOM CARD (Xudong) */}
          <div className="relative bg-[#FFFBF0] dark:bg-[#1c1716] rounded-2xl border border-[#374454]/20 dark:border-[#C5A059]/30 p-6 sm:p-8 shadow-[0_12px_40px_-10px_rgba(55,68,84,0.08)] flex flex-col items-center text-center overflow-hidden">
            <EtchingFrameCorners color="#374454" size={24} className="opacity-35 dark:opacity-20" />

            {/* Toggle Switch */}
            <div className="inline-flex items-center p-1 rounded-full bg-[#FAF5EB] dark:bg-black/30 border border-[#374454]/15 mb-4 shadow-2xs">
              <button
                type="button"
                onClick={() => setGroomMode("etching")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider transition-all ${
                  groomMode === "etching"
                    ? "bg-[#374454] text-[#FFFBF0] shadow-xs"
                    : "text-[#556272] hover:text-[#374454] dark:text-stone-300"
                }`}
              >
                <PenTool className="w-3 h-3" />
                <span>Etching Art</span>
              </button>
              <button
                type="button"
                onClick={() => setGroomMode("photo")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider transition-all ${
                  groomMode === "photo"
                    ? "bg-[#374454] text-[#FFFBF0] shadow-xs"
                    : "text-[#556272] hover:text-[#374454] dark:text-stone-300"
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Photo</span>
              </button>
            </div>

            {/* Architectural Arched Portrait */}
            <div className="relative w-48 h-64 sm:w-56 sm:h-74 rounded-t-[110px] rounded-b-xl overflow-hidden border border-[#374454]/25 dark:border-[#C5A059]/40 bg-[#FFFBF0] shadow-md my-2 group">
              <img
                src={groomMode === "etching" ? "/illustrations/groom_etching.jpg" : groom.image}
                alt={groom.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50" />
            </div>

            {/* Groom Details */}
            <div className="mt-5 space-y-2">
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059]">
                The Groom
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl text-[#232B35] dark:text-white font-normal">
                {groom.fullName}
              </h3>
              <p className="font-editorial italic text-xs sm:text-sm text-[#556272] dark:text-stone-300 max-w-xs mx-auto leading-relaxed">
                {groom.parents}
              </p>

              {groom.instagram && (
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${groom.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#374454]/20 dark:border-[#C5A059]/30 bg-[#FAF5EB] dark:bg-black/30 px-4 py-1.5 text-xs text-[#374454] dark:text-stone-300 hover:border-[#8C1D24] transition-all hover:scale-105"
                  >
                    <InstagramIcon className="h-3 w-3 text-[#8C1D24]" />
                    <span className="text-[10px] font-sans font-bold tracking-widest uppercase">
                      @{groom.instagram}
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 2. BRIDE CARD (Chandrika) */}
          <div className="relative bg-[#FFFBF0] dark:bg-[#1c1716] rounded-2xl border border-[#374454]/20 dark:border-[#C5A059]/30 p-6 sm:p-8 shadow-[0_12px_40px_-10px_rgba(55,68,84,0.08)] flex flex-col items-center text-center overflow-hidden">
            <EtchingFrameCorners color="#374454" size={24} className="opacity-35 dark:opacity-20" />

            {/* Toggle Switch */}
            <div className="inline-flex items-center p-1 rounded-full bg-[#FAF5EB] dark:bg-black/30 border border-[#374454]/15 mb-4 shadow-2xs">
              <button
                type="button"
                onClick={() => setBrideMode("etching")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider transition-all ${
                  brideMode === "etching"
                    ? "bg-[#374454] text-[#FFFBF0] shadow-xs"
                    : "text-[#556272] hover:text-[#374454] dark:text-stone-300"
                }`}
              >
                <PenTool className="w-3 h-3" />
                <span>Etching Art</span>
              </button>
              <button
                type="button"
                onClick={() => setBrideMode("photo")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider transition-all ${
                  brideMode === "photo"
                    ? "bg-[#374454] text-[#FFFBF0] shadow-xs"
                    : "text-[#556272] hover:text-[#374454] dark:text-stone-300"
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Photo</span>
              </button>
            </div>

            {/* Architectural Arched Portrait */}
            <div className="relative w-48 h-64 sm:w-56 sm:h-74 rounded-t-[110px] rounded-b-xl overflow-hidden border border-[#374454]/25 dark:border-[#C5A059]/40 bg-[#FFFBF0] shadow-md my-2 group">
              <img
                src={brideMode === "etching" ? "/illustrations/bride_etching.jpg" : bride.image}
                alt={bride.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50" />
            </div>

            {/* Bride Details */}
            <div className="mt-5 space-y-2">
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059]">
                The Bride
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl text-[#232B35] dark:text-white font-normal">
                {bride.fullName}
              </h3>
              <p className="font-editorial italic text-xs sm:text-sm text-[#556272] dark:text-stone-300 max-w-xs mx-auto leading-relaxed">
                {bride.parents}
              </p>

              {bride.instagram && (
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${bride.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#374454]/20 dark:border-[#C5A059]/30 bg-[#FAF5EB] dark:bg-black/30 px-4 py-1.5 text-xs text-[#374454] dark:text-stone-300 hover:border-[#8C1D24] transition-all hover:scale-105"
                  >
                    <InstagramIcon className="h-3 w-3 text-[#8C1D24]" />
                    <span className="text-[10px] font-sans font-bold tracking-widest uppercase">
                      @{bride.instagram}
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleProfile;
