import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const MusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleState = (e: any) => {
      if (e.detail?.isPlaying !== undefined) {
        setIsPlaying(e.detail.isPlaying);
      }
    };
    window.addEventListener("wedding-music-state", handleState);
    return () => window.removeEventListener("wedding-music-state", handleState);
  }, []);

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] pointer-events-auto">
      <button
        onClick={handleToggle}
        className="w-12 h-12 rounded-full bg-[#FAF6EE]/90 backdrop-blur-md border border-[#8C7355]/40 shadow-lg flex items-center justify-center text-[#4A4238] hover:text-[#722F37] active:scale-95 transition-all group relative"
        title={isPlaying ? "Mute Music" : "Play Wedding Music"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-[#722F37] animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-stone-400 group-hover:text-stone-600" />
        )}

        {/* Minimal sound wave pulse effect */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full border border-[#722F37]/30 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};

export default MusicToggle;
