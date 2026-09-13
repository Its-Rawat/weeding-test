import { MailOpen, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { AppConfig } from "../types";

interface EnvelopeProps {
  onOpen: () => void;
  config: AppConfig;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, config }) => {
  const [guestName, setGuestName] = useState<string>("");
  const [isAnimate, setIsAnimate] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) setGuestName(to);
    setTimeout(() => setIsAnimate(true), 300);
  }, []);

  const handleOpenClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onOpen();
    }, 800);
  };

  return (
    <div
      className={`bg-darkBg fixed inset-0 z-[2000] flex flex-col items-center overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 transition-all duration-1000 ease-in-out ${
        isExiting ? "pointer-events-none scale-110 opacity-0" : "opacity-100"
      }`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="fixed inset-0 scale-110 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
          className="animate-subtle-zoom h-full w-full object-cover opacity-30"
          alt="Wedding Backdrop"
        />
        <div className="from-darkBg/80 via-darkBg/20 to-darkBg/90 absolute inset-0 bg-gradient-to-b"></div>
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-accent/5 animate-pulse-soft absolute top-[10%] left-[5%] h-32 w-32 rounded-full blur-3xl"></div>
        <div className="bg-accentDark/10 animate-pulse-soft absolute right-[5%] bottom-[10%] h-48 w-48 rounded-full blur-3xl [animation-delay:2s]"></div>
      </div>
      <div
        className={`relative z-10 w-full max-w-xl transform my-auto py-6 sm:py-8 text-center transition-all duration-1000 ${
          isAnimate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="to-accent/40 h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent"></div>
              <Sparkles className="text-accent/60 animate-spin-slow h-4 w-4 sm:h-5 sm:w-5" />
              <div className="to-accent/40 h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent"></div>
            </div>
            <div className="space-y-1 sm:space-y-2 text-center">
              <span className="font-sans block text-[10px] font-semibold tracking-[0.4em] text-accent/90 uppercase sm:text-[12px]">
                The Wedding of
              </span>
              <h1 className="font-script text-5xl sm:text-7xl md:text-8xl leading-tight text-white text-center mx-auto flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1 py-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                <span>{config.couple.bride.name}</span>
                <span className="text-accent font-script text-4xl sm:text-6xl md:text-7xl mx-1.5 font-normal">
                  &
                </span>
                <span>{config.couple.groom.name}</span>
              </h1>
            </div>
          </div>
          <div className="group relative">
            <div className="from-accent/20 to-accentDark/20 absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r opacity-30 blur transition duration-1000 group-hover:opacity-60"></div>
            <div className="frosted-glass relative space-y-4 sm:space-y-6 overflow-hidden rounded-[2.2rem] border border-white/20 p-6 sm:p-8 md:p-10 shadow-2xl dark:border-white/10">
              <div className="relative z-10 space-y-2 text-center">
                <p className="font-sans text-accentDark dark:text-accent text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 sm:text-[11px]">
                  Cordially Invited:
                </p>
                <div className="dark:via-accent/30 mx-auto h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-50"></div>
              </div>
              <div className="relative z-10 py-1 text-center">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight break-words text-slate-900 italic drop-shadow-sm transition-colors duration-500 dark:text-white">
                  {guestName || "Honored Guest"}
                </h2>
              </div>
              <div className="relative z-10 text-center">
                <p className="font-sans mx-auto max-w-sm text-[12px] sm:text-[13px] leading-relaxed font-normal text-slate-600 transition-colors duration-500 dark:text-slate-300">
                  We joyfully invite you to celebrate our union as we begin our lifelong journey together.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 pt-2">
            <button
              onClick={handleOpenClick}
              className="font-sans group text-primary hover:bg-accent hover:text-white relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 sm:px-10 sm:py-5 text-[11px] sm:text-[12px] font-bold tracking-[0.25em] uppercase shadow-[0_15px_40px_-10px_rgba(212,175,55,0.4)] transition-all duration-700 active:scale-95 animate-pulse hover:animate-none cursor-pointer"
            >
              <div className="relative z-10 flex items-center gap-2.5">
                <MailOpen className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 group-hover:scale-110" />
                Open Invitation
              </div>
              <div className="bg-accent absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0"></div>
            </button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/5 md:inset-8 md:rounded-[4rem]"></div>
      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Envelope;
