import React from 'react';
import ThreeScene from './ThreeScene';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export default function Welcome3DPage({ onNavigate, weddingInfo, onReady, isBuffering }) {
  const coupleTitle = weddingInfo?.coupleTitle || "Chandrika & Xudong";
  const welcomeNote = weddingInfo?.welcomeNote || "With the blessings of our elders and immense joy in our hearts, we invite you to celebrate with us.";
  const hostName = weddingInfo?.hostName || "The Rawat & Zhang Families";

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col justify-center items-center min-h-[calc(100vh-6rem)]">
      
      {/* Top Welcome Title */}
      <div className="text-center max-w-xl mx-auto mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
          <span className="text-xs">🌸</span>
          <span>Sacred Lotus & Royal Wedding Ring</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-charcoal mt-1 tracking-tight">
          Welcome to {coupleTitle}'s Wedding
        </h2>
        <p className="text-xs text-charcoal/70 mt-1 font-light italic">
          "{welcomeNote}"
        </p>
      </div>

      {/* 3D Three.js Wedding Rings Canvas */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-2xl border-2 border-gold-300/80 p-3 shadow-postcard relative overflow-hidden">
        <ThreeScene onReady={onReady} isBuffering={isBuffering} />
      </div>

      {/* Bottom Actions Row */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('ceremonies')}
          className="px-6 py-2.5 rounded-xl bg-gold-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>View Ceremonies Itinerary</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigate('story')}
          className="px-5 py-2.5 rounded-xl border border-gold-400 hover:bg-gold-50 text-gold-900 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5 text-rani-600 fill-rani-600" />
          <span>Our Love Story</span>
        </button>
      </div>

      <p className="text-[11px] text-charcoal/50 mt-2 font-serif">
        Hosted with love by {hostName} • Udaipur, India
      </p>

    </div>
  );
}
