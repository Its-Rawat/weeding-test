import React from 'react';
import { ArrowDown, Calendar, MapPin, Sparkles } from 'lucide-react';

export default function CinematicCoverPage({ weddingInfo, onNavigate }) {
  const coupleTitle = weddingInfo?.coupleTitle || "Chandrika & Xudong";
  const weddingDate = weddingInfo?.weddingDate || "November 28, 2026";
  const locationCity = weddingInfo?.locationCity || "Udaipur, Rajasthan, India";

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] w-full flex flex-col justify-between items-center text-center overflow-hidden">
      
      {/* Full-Screen Romantic Background Photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=85')`
        }}
      >
        {/* Cinematic Multi-layer Gradient Overlay for crisp typography on any screen */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/45 to-stone-950/55" />
      </div>

      {/* Top Subtle Breadcrumb / Return to Stationery */}
      <div className="relative z-10 pt-4 sm:pt-6 px-4 flex items-center justify-between w-full max-w-6xl mx-auto text-white/80 text-xs">
        <button
          onClick={() => onNavigate('cover')}
          className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 active:scale-95 transition-all flex items-center gap-1 text-[11px] sm:text-xs"
          style={{ minHeight: '38px' }}
        >
          <span>← Stationery</span>
        </button>
        <span className="hidden sm:flex items-center gap-1 text-gold-300 font-medium text-xs">
          <Sparkles className="w-3 h-3" />
          <span>#ChandrikaWedsXudong</span>
        </span>
        <button
          onClick={() => onNavigate('rsvp')}
          className="px-3.5 py-1.5 rounded-full bg-gold-500/90 hover:bg-gold-500 active:scale-95 text-white font-bold transition-all shadow-md text-[11px] sm:text-xs"
          style={{ minHeight: '38px' }}
        >
          RSVP Online
        </button>
      </div>

      {/* Main Centered Cinematic Typography matching BRD Screenshot 2 */}
      <div className="relative z-10 px-4 py-8 sm:py-16 max-w-4xl mx-auto flex flex-col items-center justify-center my-auto">
        
        {/* Elegant Gold Banner Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/25 backdrop-blur-md border border-gold-400/50 text-gold-200 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 shadow-sm">
          <Sparkles className="w-3 h-3 text-gold-300" />
          <span>We're Getting Married!</span>
          <Sparkles className="w-3 h-3 text-gold-300" />
        </div>

        {/* Grand Couple Title - Responsive font size for phones */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight drop-shadow-lg leading-tight mb-2 sm:mb-4">
          Chandrika &amp; Xudong
        </h1>

        {/* Date and Location line */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-gold-200 font-serif text-xs sm:text-base md:text-xl tracking-widest uppercase mb-4 sm:mb-6 drop-shadow">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gold-300" />
            {weddingDate}
          </span>
          <span className="text-gold-400/80">•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold-300" />
            Udaipur, India
          </span>
        </div>

        {/* Romantic sub-quote from BRD */}
        <p className="text-sm sm:text-lg md:text-xl text-white/90 font-light italic max-w-xl mx-auto drop-shadow leading-relaxed mb-6 px-2">
          "We're excited to celebrate this special day with you!"
        </p>

        {/* Decorative gold flourish divider */}
        <div className="w-20 sm:w-28 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      </div>

      {/* Bottom Floating Navigation Arrow matching BRD Screenshot 2 */}
      <div className="relative z-10 pb-6 sm:pb-12 flex flex-col items-center gap-1.5">
        <button
          onClick={() => onNavigate('welcome')}
          className="group flex flex-col items-center gap-1.5 text-white hover:text-gold-200 active:scale-95 transition-all focus:outline-none"
          title="Enter Welcome Portal"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-white/85 group-hover:text-gold-200 transition-colors">
            Enter Welcome Portal
          </span>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 group-hover:border-gold-300 group-hover:bg-gold-500/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg animate-bounce">
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-gold-200 group-hover:text-white" />
          </div>
        </button>
      </div>

    </div>
  );
}
