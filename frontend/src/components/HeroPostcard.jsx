import React from 'react';
import { Calendar, Heart, QrCode, ArrowRight, Sparkles, ShieldCheck, Mail } from 'lucide-react';

export default function HeroPostcard({ weddingInfo, onOpenRsvp, onOpenPass, onNavigate }) {
  const coupleTitle = weddingInfo?.coupleTitle || "Chandrika & Xudong";
  const hostName = weddingInfo?.hostName || "The Verma & Wang Families";
  const weddingDate = weddingInfo?.weddingDate || "November 28, 2026";
  const eventCode = weddingInfo?.eventCode || "CX2026";
  const locationCity = weddingInfo?.locationCity || "Udaipur, Rajasthan, India";
  const rsvpDeadline = weddingInfo?.rsvpDeadline || "November 10, 2026";

  return (
    <div className="relative py-6 sm:py-10 px-4 max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-5rem)]">
      
      {/* Background Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold-200/30 via-stone-200/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Appy Couple Stationery Desk Container */}
      <div className="relative bg-[#F9F6F0] rounded-3xl shadow-2xl border border-stone-300/80 p-4 sm:p-7 md:p-8 transition-all duration-300">
        
        {/* Ornate Gold Filigree Corner Accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-500/70 pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-500/70 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-500/70 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-500/70 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* CARD 1 (LEFT): White Floral Stationery Card with Portrait & Date Seal (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-md border border-stone-200 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
            
            {/* Floral garland header accent */}
            <div className="text-center pt-1 pb-3">
              <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 tracking-widest uppercase font-serif font-medium">
                <span>🌸</span>
                <span>The Royal Celebration</span>
                <span>🌸</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 tracking-tight mt-1">
                Chandrika &amp; Xudong's Wedding
              </h2>
            </div>

            {/* Couple / Bridal Portrait Image with circular date seal */}
            <div className="relative overflow-hidden rounded-xl shadow-inner min-h-[260px] sm:min-h-[320px] my-2">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80"
                alt="Chandrika & Xudong"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              {/* Circular Gold Date Seal matching BRD Screenshot 1 */}
              <div className="absolute top-3 right-3 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gold-gradient p-0.5 shadow-lg flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full bg-stone-900/90 border border-gold-300 flex flex-col items-center justify-center p-1 text-white">
                  <span className="text-[7px] tracking-widest uppercase text-gold-300 font-medium">WEDDING</span>
                  <span className="text-[9px] font-bold tracking-tight text-white leading-tight">NOV 28</span>
                  <span className="text-[7px] text-gold-300 font-medium">2026</span>
                </div>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] text-gold-200 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>The Oberoi Udaivilas</span>
                </p>
                <p className="text-xs text-white/90 font-light">{locationCity}</p>
              </div>
            </div>

            {/* Quick Link to Cinematic Screen */}
            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigate && onNavigate('cinematic')}
                className="text-xs font-semibold text-gold-800 hover:text-gold-900 tracking-wider uppercase inline-flex items-center gap-1 transition-all"
              >
                <span>View Full Screen Photo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 2 (CENTER): Middle Stack matching BRD Screenshot 1 (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            
            {/* Top Taupe Card: Host & Invitation Title */}
            <div
              onClick={() => onNavigate && onNavigate('cinematic')}
              className="bg-[#B5A48F] hover:bg-[#A6937C] text-white p-5 sm:p-6 rounded-2xl shadow-md flex-1 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-300 group"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between text-[10px] tracking-widest uppercase font-semibold text-stone-200">
                  <span>HOST</span>
                  <Sparkles className="w-3.5 h-3.5 text-stone-200" />
                </div>
                <p className="text-xs font-medium mt-0.5 text-white/95">{hostName}</p>
              </div>

              <div className="my-5 text-center">
                <p className="text-[10px] uppercase tracking-widest text-stone-200/90 mb-1">Joyfully Invite You To</p>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
                  {coupleTitle}'s Wedding
                </h3>
                <div className="w-16 h-0.5 bg-stone-200/60 mx-auto mt-2.5" />
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-medium text-stone-200">
                <span>Official Invitation</span>
                <span className="flex items-center gap-1 text-white font-bold group-hover:translate-x-1 transition-transform">
                  Invitation &gt;
                </span>
              </div>
            </div>

            {/* Bottom Warm Taupe Card: RSVP */}
            <div
              onClick={onOpenRsvp}
              className="bg-[#8A7D69] hover:bg-[#7D6E58] text-white p-4 sm:p-5 rounded-2xl shadow-md transition-all duration-300 text-left cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-stone-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-stone-200" /> GUEST RSVP
                  </span>
                  <h4 className="text-xl font-serif font-bold text-white mt-0.5 flex items-center gap-2">
                    RSVP
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-stone-200" />
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs text-stone-200">
                <span className="font-semibold text-white">Deadline {rsvpDeadline}</span>
                <span className="text-white/80 group-hover:text-white flex items-center gap-0.5">
                  Respond &gt;
                </span>
              </div>
            </div>

          </div>

          {/* CARD 3 (RIGHT): Event Code & Digital Pass Card (3 Cols) */}
          <div className="lg:col-span-3 bg-white border border-stone-200/90 rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-md">
            
            {/* Wedding Monogram */}
            <div className="w-13 h-13 rounded-full border-2 border-gold-500/80 flex items-center justify-center bg-stone-50 shadow-sm mt-1">
              <span className="font-serif font-bold text-base text-gold-800 tracking-tight">C&amp;X</span>
            </div>

            <div className="my-3">
              <h4 className="text-sm font-serif font-bold text-stone-800 tracking-wide uppercase">
                {coupleTitle}
              </h4>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed px-1">
                Use this portal to access wedding details, schedule, traditions, and share wishes.
              </p>
              
              {/* Event Passcode Box */}
              <div className="mt-3 px-3 py-2 bg-stone-50 border border-dashed border-gold-400/90 rounded-xl shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">Event Code</span>
                <span className="font-mono text-base font-bold tracking-widest text-gold-800">{eventCode}</span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={onOpenRsvp}
                className="w-full py-2.5 px-3 bg-gold-gradient hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>RSVP Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate && onNavigate('welcome')}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 shadow-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span>Enter Welcome 3D</span>
                <ArrowRight className="w-3 h-3 text-gold-700" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
