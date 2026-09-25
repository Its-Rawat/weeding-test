import React from "react";
import { MapPin, Navigation, Phone, Mail, Sparkles, Plane, Car } from "lucide-react";
import type { AppConfig } from "../types";

export default function VenueSection({ config }: { config: AppConfig }) {
  const venueTitle = config.venue.name || "The Oberoi Udaivilas";
  const venueAddress = config.venue.address || "Haridas Ji Ki Magri, Udaipur, Rajasthan 313001, India";

  return (
    <section id="venue" className="py-16 sm:py-24 px-4 bg-[#FBF8F3] border-t border-[#d4af37]/20">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Header matching video frame 00:09 */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#9e7241] tracking-widest uppercase font-serif font-medium mb-1">
            <span>🏰</span>
            <span>Royal Destination</span>
            <span>🏰</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-stone-900 font-normal">
            The Venue
          </h2>
          <p className="font-sans text-xs text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
            Nestled on the tranquil banks of Lake Pichola, The Oberoi Udaivilas stands as an architectural marvel of courtyards, domes, and fountains.
          </p>
          <div className="w-16 h-0.5 bg-[#d4af37]/50 mx-auto mt-3 rounded-full" />
        </div>

        {/* Illustrated Venue Card matching video frame 00:09 */}
        <div className="bg-white rounded-3xl border border-[#d4af37]/40 shadow-sm overflow-hidden p-6 sm:p-8">
          
          {/* Architectural Venue Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-inner h-64 sm:h-80 mb-6 group">
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80"
              alt="The Oberoi Udaivilas"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#d4af37]/90 text-white mb-1">
                Luxury Palace Sanctuary
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{venueTitle}</h3>
              <p className="text-xs text-stone-200 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                Lake Pichola, Udaipur, Rajasthan
              </p>
            </div>
          </div>

          {/* Details & Transit Info */}
          <div className="space-y-4 text-xs sm:text-sm text-stone-700">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#d4af37]/30 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#9e7241] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-stone-900">Address</span>
                <span className="text-stone-600 leading-relaxed block">{venueAddress}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#d4af37]/30 flex items-center gap-3">
                <Plane className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <span className="font-bold block text-xs text-stone-900">Maharana Pratap Airport</span>
                  <span className="text-[11px] text-stone-500">27 km (~45 mins by car)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#d4af37]/30 flex items-center gap-3">
                <Car className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <span className="font-bold block text-xs text-stone-900">Udaipur City Station</span>
                  <span className="text-[11px] text-stone-500">8 km (~20 mins by car)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Navigation className="w-4 h-4 text-[#d4af37]" />
                <span>Get Directions via Google Maps</span>
              </a>

              <a
                href="tel:+919876543210"
                className="py-3 px-4 bg-[#FAF5EE] hover:bg-[#F3EBE0] text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#d4af37]/50 flex items-center justify-center gap-2 transition-colors active:scale-98"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>Hospitality Desk</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
