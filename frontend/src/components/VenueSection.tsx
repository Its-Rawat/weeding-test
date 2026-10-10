import React from "react";
import { MapPin, Plane, Car } from "lucide-react";
import type { AppConfig } from "../types";
import { EtchingFrameCorners } from "./ui/EtchingCorner";

export default function VenueSection({ config }: { config: AppConfig }) {
  const venueTitle = config.venue.name || "The Club International";
  const venueAddress =
    config.venue.address ||
    "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)";

  return (
    <section
      id="venue"
      className="relative py-20 sm:py-32 px-4 bg-[#FFFBF0] dark:bg-[#151111] border-t border-[#374454]/15 dark:border-[#C5A059]/20 overflow-hidden transition-colors duration-1000"
    >
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Section Header (Huey Lightshop Editorial Style) */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-[#8C1D24] dark:text-[#C5A059] tracking-[0.25em] uppercase font-sans font-semibold">
            <span>🏰</span>
            <span>Royal Destination</span>
            <span>🏰</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl text-[#232B35] dark:text-white font-normal tracking-tight">
            The Venue &amp; Grounds
          </h2>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
            <span className="text-[#C5A059] text-xs">✦</span>
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
          </div>

          <p className="font-editorial italic text-sm sm:text-base text-[#556272] dark:text-stone-300 max-w-md mx-auto leading-relaxed">
            An exquisite luxury destination in Delhi NCR with lush green landscapes, majestic pavilions, and royal Indian hospitality.
          </p>
        </div>

        {/* Illustrated Venue Card */}
        <div className="relative bg-[#FFFBF0] dark:bg-[#1c1716] rounded-2xl border border-[#374454]/20 dark:border-[#C5A059]/30 shadow-[0_12px_45px_-10px_rgba(55,68,84,0.08)] overflow-hidden p-6 sm:p-8">
          <EtchingFrameCorners color="#374454" size={24} className="opacity-35 dark:opacity-20" />

          {/* Architectural Venue Image */}
          <div className="relative rounded-xl overflow-hidden h-64 sm:h-80 mb-6 group border border-[#374454]/15">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              alt="The Club International Gurgaon"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-104"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#C5A059] text-[#232B35] mb-1 font-sans">
                Royal Wedding Grounds
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal">{venueTitle}</h3>
              <p className="text-xs text-stone-200 mt-0.5 flex items-center gap-1 font-editorial italic">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                Sector 109, Palam Vihar, Gurgaon, Delhi NCR
              </p>
            </div>
          </div>

          {/* Details & Transit Info */}
          <div className="space-y-4 text-xs sm:text-sm text-[#232B35] dark:text-stone-200">
            <div className="p-4 rounded-xl bg-[#FAF5EB] dark:bg-[#251e1c] border border-[#374454]/15 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#8C1D24] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#232B35] dark:text-white">Address</span>
                <span className="text-[#556272] dark:text-stone-300 font-editorial italic leading-relaxed block">{venueAddress}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#FAF5EB] dark:bg-[#251e1c] border border-[#374454]/15 flex items-center gap-3">
                <Plane className="w-4 h-4 text-[#C5A059] shrink-0" />
                <div>
                  <span className="font-bold block text-xs text-[#232B35] dark:text-white">Indira Gandhi Intl Airport (DEL)</span>
                  <span className="text-[11px] text-[#556272] dark:text-stone-400 font-editorial italic">18 km (~30 mins via Dwarka Exp)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF5EB] dark:bg-[#251e1c] border border-[#374454]/15 flex items-center gap-3">
                <Car className="w-4 h-4 text-[#C5A059] shrink-0" />
                <div>
                  <span className="font-bold block text-xs text-[#232B35] dark:text-white">Gurgaon Railway Station</span>
                  <span className="text-[11px] text-[#556272] dark:text-stone-400 font-editorial italic">7 km (~15 mins by car)</span>
                </div>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="pt-2 text-center">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(venueTitle + " " + venueAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#374454] hover:bg-[#232B35] text-[#FFFBF0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-98"
              >
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
