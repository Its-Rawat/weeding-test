import React from "react";
import { Mail, Calendar, Palette, MapPin, CheckSquare, Volume2, VolumeX } from "lucide-react";

interface FloatingNavDockProps {
  onReopenEnvelope: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export default function FloatingNavDock({
  onReopenEnvelope,
  isPlayingMusic,
  onToggleMusic,
}: FloatingNavDockProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-sm w-[92%] sm:w-auto">
      <div className="bg-[#FFFDF9]/95 backdrop-blur-xl border border-[#d4af37]/60 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.18)] px-3 py-1.5 flex items-center justify-between gap-1 sm:gap-2">
        
        {/* Reopen Envelope */}
        <button
          onClick={onReopenEnvelope}
          className="p-2 rounded-full hover:bg-[#FAF5EE] text-stone-600 hover:text-stone-900 active:scale-95 transition-all flex flex-col items-center"
          title="Re-open Invitation Envelope"
        >
          <Mail className="w-4 h-4 text-[#9e7241]" />
          <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">Envelope</span>
        </button>

        {/* Celebrations */}
        <button
          onClick={() => scrollTo("event")}
          className="p-2 rounded-full hover:bg-[#FAF5EE] text-stone-600 hover:text-stone-900 active:scale-95 transition-all flex flex-col items-center"
          title="Events Itinerary"
        >
          <Calendar className="w-4 h-4 text-[#9e7241]" />
          <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">Events</span>
        </button>

        {/* Dress Code */}
        <button
          onClick={() => scrollTo("dress-code")}
          className="p-2 rounded-full hover:bg-[#FAF5EE] text-stone-600 hover:text-stone-900 active:scale-95 transition-all flex flex-col items-center"
          title="Dress Code & Colors"
        >
          <Palette className="w-4 h-4 text-[#9e7241]" />
          <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">Attire</span>
        </button>

        {/* Venue */}
        <button
          onClick={() => scrollTo("venue")}
          className="p-2 rounded-full hover:bg-[#FAF5EE] text-stone-600 hover:text-stone-900 active:scale-95 transition-all flex flex-col items-center"
          title="Venue & Directions"
        >
          <MapPin className="w-4 h-4 text-[#9e7241]" />
          <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">Venue</span>
        </button>

        {/* RSVP (Gold Pill Highlight) */}
        <button
          onClick={() => scrollTo("rsvp")}
          className="py-1.5 px-3.5 rounded-full bg-gradient-to-r from-[#DFBE68] via-[#D4AF37] to-[#B89328] text-white shadow-md active:scale-95 transition-all flex items-center gap-1 font-bold text-xs"
          title="RSVP Online"
        >
          <CheckSquare className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] uppercase tracking-wider">RSVP</span>
        </button>

        {/* Music Audio Toggle */}
        <button
          onClick={onToggleMusic}
          className="p-2 rounded-full hover:bg-[#FAF5EE] text-stone-600 hover:text-stone-900 active:scale-95 transition-all"
          title={isPlayingMusic ? "Mute Background Music" : "Play Wedding Sitar & Flute"}
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4 text-[#b73239] animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-400" />
          )}
        </button>

      </div>
    </div>
  );
}
