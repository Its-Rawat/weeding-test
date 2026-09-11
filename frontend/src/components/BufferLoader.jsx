import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function BufferLoader({ pageName, isVisible }) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [animatingIn, setAnimatingIn] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Next tick to trigger CSS opacity transition
      const t = requestAnimationFrame(() => {
        setAnimatingIn(true);
      });
      return () => cancelAnimationFrame(t);
    } else {
      setAnimatingIn(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 350); // Match fade-out duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const is3DPage = pageName && (pageName.toLowerCase().includes('3d') || pageName.toLowerCase().includes('welcome') || pageName.toLowerCase().includes('lotus'));

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 ${
        animatingIn ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-98 pointer-events-none'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        
        {/* Animated Blooming Lotus & Gold Ring Loading Emblem */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Pulsing golden aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold-200/50 via-rani-200/40 to-gold-300/50 rounded-full animate-ping [animation-duration:3s]" />
          
          {/* Rotating halo ring */}
          <div className="absolute inset-1.5 border border-dashed border-gold-400/80 rounded-full animate-spin [animation-duration:12s]" />

          {/* Blooming Lotus Petals SVG */}
          <svg className="w-28 h-28 animate-pulse" viewBox="0 0 100 100" fill="none">
            {/* Outer Petals */}
            <path d="M50 85 C22 80 12 48 50 18 C88 48 78 80 50 85 Z" fill="url(#lotusPinkGrad)" opacity="0.9" />
            <path d="M50 85 C14 68 8 36 38 14 C68 36 56 68 50 85 Z" fill="url(#lotusSoftPink)" opacity="0.8" />
            <path d="M50 85 C86 68 92 36 62 14 C32 36 44 68 50 85 Z" fill="url(#lotusSoftPink)" opacity="0.8" />
            <defs>
              <linearGradient id="lotusPinkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="65%" stopColor="#FFB6C1" />
                <stop offset="100%" stopColor="#FF69B4" />
              </linearGradient>
              <linearGradient id="lotusSoftPink" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFF5F8" />
                <stop offset="100%" stopColor="#FFAEC9" />
              </linearGradient>
            </defs>
          </svg>

          {/* Golden Wedding Ring in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full border-[3.5px] border-[#F2BA49] bg-white/95 shadow-md flex items-center justify-center relative">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-sm border border-white animate-ping absolute -top-2" />
              <span className="font-serif font-bold text-xs text-gold-900">C&X</span>
            </div>
          </div>
        </div>

        {/* Auspicious Sanskrit Subtitle */}
        <p className="mt-5 text-xs font-serif italic text-gold-800 tracking-wider">
          ॥ ॐ श्री गणेशाय नमः ॥
        </p>

        {/* Transitioning Page Name */}
        <h3 className="text-lg font-serif font-bold text-charcoal mt-1 tracking-wide flex items-center justify-center gap-1.5">
          <span>🌸</span>
          <span>{pageName ? `Unfolding ${pageName}...` : "Chandrika & Xudong's Wedding"}</span>
        </h3>

        {/* Shimmering Progress Bar */}
        <div className="w-48 h-1 bg-gold-100 rounded-full mt-4 overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-gold-400 via-gold-600 to-rani-500 rounded-full animate-shimmer" />
        </div>

        <p className="text-[11px] text-charcoal/60 mt-2 font-light">
          {is3DPage
            ? "Loading 3D sacred lotus & water ripples... Bloom will reveal momentarily"
            : "Sacred lotus blooming • Unveiling royal celebrations..."}
        </p>

      </div>
    </div>
  );
}
