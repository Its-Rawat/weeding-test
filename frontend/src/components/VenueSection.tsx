import React from "react";
import { MapPin, Navigation, Phone, Mail, Sparkles, Plane, Car } from "lucide-react";
import type { AppConfig } from "../types";

export default function VenueSection({ config }: { config: AppConfig }) {
  const venueTitle = config.venue.name || "The Club International";
  const venueAddress = config.venue.address || "The Club, International City, Sector 109, B3 Ln, Babupur Village, Palam Vihar, Gurgaon, Haryana 122017";

  return (
    <section id="venue" className="py-16 sm:py-24 px-4 bg-[#FAF5EB] border-t border-[#D4AF37]/20">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#8C6B1C] tracking-widest uppercase font-serif font-medium mb-1">
            <span>🏰</span>
            <span>Royal Destination</span>
            <span>🏰</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#231C18] font-normal">
            The Venue
          </h2>
          <p className="font-sans text-xs text-[#5A4D43] max-w-md mx-auto mt-2 leading-relaxed">
            An exquisite luxury destination in Delhi NCR with lush green landscapes, majestic pavilions, and royal Indian hospitality.
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto mt-3 rounded-full" />
        </div>

        {/* Illustrated Venue Card */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#D4AF37]/50 shadow-[0_10px_35px_rgba(140,107,28,0.08)] overflow-hidden p-6 sm:p-8">
          
          {/* Architectural Venue Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-inner h-64 sm:h-80 mb-6 group">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              alt="The Club International Gurgaon"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#D4AF37] text-[#231C18] mb-1 font-sans">
                Royal Wedding Grounds
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{venueTitle}</h3>
              <p className="text-xs text-stone-200 mt-0.5 flex items-center gap-1 font-serif italic">
                <MapPin className="w-3.5 h-3.5 text-[#FFE082]" />
                Sector 109, Palam Vihar, Gurgaon, Delhi NCR
              </p>
            </div>
          </div>

          {/* Details & Transit Info */}
          <div className="space-y-4 text-xs sm:text-sm text-[#231C18]">
            <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#D4AF37]/35 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#8C1D24] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#231C18]">Address</span>
                <span className="text-[#5A4D43] leading-relaxed block">{venueAddress}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#D4AF37]/35 flex items-center gap-3">
                <Plane className="w-4 h-4 text-[#8C6B1C] shrink-0" />
                <div>
                  <span className="font-bold block text-xs text-[#231C18]">Indira Gandhi Intl Airport (DEL)</span>
                  <span className="text-[11px] text-[#5A4D43]">18 km (~30 mins via Dwarka Exp)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#D4AF37]/35 flex items-center gap-3">
                <Car className="w-4 h-4 text-[#8C6B1C] shrink-0" />
                <div>
                  <span className="font-bold block text-xs text-[#231C18]">Gurgaon Railway Station</span>
                  <span className="text-[11px] text-[#5A4D43]">7 km (~15 mins by car)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com/?q=The+Club+International+City+Sector+109+Gurgaon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#9A1616] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#FFE082]" />
                <span>Get Directions via Google Maps</span>
              </a>

              <a
                href="tel:+919876543210"
                className="py-3 px-4 bg-[#FAF5EB] hover:bg-[#F3E7D5] text-[#231C18] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#D4AF37]/60 flex items-center justify-center gap-2 transition-colors active:scale-98 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#8C6B1C]" />
                <span>Hospitality Desk</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
