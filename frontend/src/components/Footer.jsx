import React from 'react';
import { Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ onOpenRsvp, weddingInfo }) {
  const coupleTitle = weddingInfo?.coupleTitle || "Chandrika & Xudong";
  const venue = weddingInfo?.mainVenue || "The Oberoi Udaivilas, Udaipur";

  return (
    <footer className="bg-charcoal text-[#F5EFEB] border-t-2 border-gold-500/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Monogram Seal */}
        <div className="w-16 h-16 rounded-full border-2 border-gold-400 flex items-center justify-center bg-gold-900/40 mb-4 shadow-md">
          <span className="font-serif font-bold text-2xl text-gold-300">C&X</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-1">
          #ChandrikaWedsXudong • Udaipur 2026
        </p>

        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
          {coupleTitle}
        </h3>

        <p className="mt-3 text-sm text-[#F5EFEB]/70 max-w-md italic font-serif">
          "Thank you for being an indispensable part of our lives, our family, and our celebrations. We cannot wait to welcome you in Udaipur!"
        </p>

        <div className="w-24 h-0.5 bg-gold-500/60 my-6" />

        {/* Info Grid */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#F5EFEB]/80 mb-8">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-gold-400" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-gold-400" />
            <span>hospitality@didiwedding.in</span>
          </div>
        </div>

        {/* RSVP button */}
        <button
          onClick={onOpenRsvp}
          className="mb-8 px-8 py-3 rounded-xl bg-gold-gradient text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Confirm Your Attendance (RSVP)</span>
        </button>

        <div className="pt-6 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50">
          <p>© 2026 {coupleTitle} Wedding. All celebrations and memories reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-rani-500 fill-rani-500" /> for dearest Didi
          </p>
        </div>

      </div>
    </footer>
  );
}
