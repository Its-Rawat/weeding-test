import React from 'react';
import ThreeScene from './ThreeScene';
import { Sparkles, ArrowRight, Calendar, MapPin } from 'lucide-react';

export default function Welcome3DPage({ onNavigate, weddingInfo, onReady, isBuffering }) {
  const coupleTitle = weddingInfo?.coupleTitle || "Chandrika & Xudong";
  const welcomeNote = weddingInfo?.welcomeNote || "With joyful hearts and the blessings of our elders, we invite you to celebrate our union.";
  const hostName = weddingInfo?.hostName || "The Verma & Wang Families";
  const weddingDate = weddingInfo?.weddingDate || "November 28, 2026";
  const locationCity = weddingInfo?.locationCity || "Udaipur, Rajasthan, India";

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6 flex flex-col justify-center">
      
      {/* Split-Screen Main Attraction Container matching BRD Screenshot 3 */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-gold-300/80 shadow-postcard overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* LEFT COLUMN: Couple Portrait (On phone: Top Banner with high-res photo) */}
        <div className="lg:col-span-6 relative h-64 sm:h-80 lg:min-h-[580px] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85"
            alt="Chandrika & Xudong"
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          
          {/* Top badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-gold-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-900 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-600" />
              <span>Royal Wedding • Udaipur</span>
            </span>
          </div>

          {/* Bottom couple caption */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-white">
            <div className="inline-block px-2 py-0.5 rounded bg-gold-600/85 backdrop-blur-sm text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-white mb-1">
              The Celebration
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-md">
              {coupleTitle}
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 text-gold-200 text-xs font-light mt-0.5 drop-shadow">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold-300" />
                {weddingDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-300" />
                The Oberoi Udaivilas
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Sacred Lotus & "WELCOME" Card matching BRD Screenshot 3 */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE4] p-4 sm:p-6 lg:p-7 flex flex-col justify-between relative">
          
          {/* Subtle header accent */}
          <div className="flex items-center justify-between border-b border-gold-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">🌸</span>
              <div>
                <h3 className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-gold-800">
                  Sacred Lotus &amp; Wedding Ring
                </h3>
                <p className="text-[10px] text-stone-500 font-light">Interactive 3D Experience</p>
              </div>
            </div>
            <span className="text-[11px] font-serif italic text-gold-700">
              Udaipur, India
            </span>
          </div>

          {/* Floating "WELCOME • We're so excited you're here!" Card matching BRD Screenshot 3 */}
          <div 
            onClick={() => onNavigate('story')}
            className="my-3 bg-white/95 backdrop-blur-md rounded-2xl border border-gold-300/90 p-3.5 sm:p-5 shadow-md hover:shadow-lg active:scale-98 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-gold-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold-600" /> GUEST WELCOME
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-800 tracking-tight mt-0.5">
                  WELCOME
                </h3>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 group-hover:bg-gold-500 group-hover:text-white transition-colors shadow-xs">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            <p className="text-xs sm:text-sm font-serif italic text-stone-700 mt-1.5 flex items-center justify-between">
              <span>We're so excited you're here!</span>
              <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-gold-800 group-hover:underline">
                Explore Story &gt;
              </span>
            </p>
          </div>

          {/* 3D Blooming Lotus Scene with mobile touch-action pan-y */}
          <div 
            className="relative w-full rounded-2xl border border-gold-300/80 overflow-hidden shadow-inner bg-stone-900/5 my-1.5 h-64 sm:h-72"
            style={{ touchAction: 'pan-y' }}
          >
            <ThreeScene onReady={onReady} isBuffering={isBuffering} />
            <div className="absolute bottom-2 right-2 pointer-events-none bg-black/45 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-white/85">
              Swipe to rotate 3D flower
            </div>
          </div>

          {/* Bottom Navigation Buttons - Thumb friendly */}
          <div className="pt-2.5 border-t border-gold-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('ceremonies')}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-gold-gradient hover:opacity-95 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                style={{ minHeight: '42px' }}
              >
                <span>Ceremonies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('traditions')}
                className="px-3 sm:px-3.5 py-2 rounded-xl border border-gold-400 bg-white hover:bg-gold-50 active:scale-95 text-gold-900 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
                style={{ minHeight: '42px' }}
              >
                <span>Traditions</span>
              </button>
            </div>

            <button
              onClick={() => onNavigate('rsvp')}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
              style={{ minHeight: '42px' }}
            >
              <span>RSVP</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-300" />
            </button>
          </div>

          {/* Host footer credit */}
          <p className="text-[10px] text-stone-500 text-center mt-2 font-serif">
            Hosted with love by {hostName}
          </p>

        </div>

      </div>

    </div>
  );
}
