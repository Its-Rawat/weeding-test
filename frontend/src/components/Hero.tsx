import React, { useState, useEffect } from "react";
import { ChevronDown, Mail, Sparkles } from "lucide-react";
import type { AppConfig } from "../types";

const Hero: React.FC<{ config: AppConfig }> = ({ config }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGuestName(params.get("to"));

    const timer = setInterval(() => {
      const distance =
        config.events.akad.startDateTime.getTime() - new Date().getTime();
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [config.events.akad.startDateTime]);

  const handleScrollToContent = () => {
    document.getElementById("couple")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-12 md:py-20">
      <div className="absolute inset-0 z-0">
        <img
          src={config.hero.image}
          className="animate-subtle-zoom h-full w-full object-cover"
          alt="Wedding Backdrop"
        />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px] dark:bg-slate-950/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80"></div>
      </div>

      <div className="z-10 container mx-auto flex flex-col items-center px-6 text-center">
        <div className="animate-reveal w-full space-y-4 [animation-delay:200ms] md:space-y-8">
          {/* Host Badge */}
          <div className="flex items-center justify-center">
            <a
              href="mailto:adi2002rawat@gmail.com?subject=Wedding%20Inquiry%20-%20Chandrika%20%26%20Xudong"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-1.5 text-[11px] sm:text-xs font-medium tracking-wider text-amber-200/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-black/65 hover:text-white"
              title="Click to email Host Aditya Rawat (adi2002rawat@gmail.com)"
            >
              <Mail className="h-3.5 w-3.5 text-accent transition-transform group-hover:scale-110" />
              <span>
                Host: <strong className="font-semibold text-white group-hover:text-accent transition-colors">Aditya Rawat</strong>
              </span>
              <span className="text-[10px] text-accent/80 font-mono">✉</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="h-[1px] w-6 bg-white/30 md:w-20"></div>
            <span className="font-sans tracking-luxury text-[9px] font-semibold text-white/90 uppercase md:text-[12px]">
              The Wedding Celebration
            </span>
            <div className="h-[1px] w-6 bg-white/30 md:w-20"></div>
          </div>

          <h1 className="font-script text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-[1.1] text-white text-center mx-auto flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8 py-2 drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <span className="hover:scale-105 transition-transform duration-500">{config.couple.bride.name}</span>
            <span className="text-accent font-script not-italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl mx-2 font-normal">
              &
            </span>
            <span className="hover:scale-105 transition-transform duration-500">{config.couple.groom.name}</span>
          </h1>

          {guestName && (
            <p className="animate-reveal mt-4 font-serif text-xl sm:text-2xl text-white/90 italic">
              Dear {guestName}
            </p>
          )}

          <div className="space-y-3 md:space-y-6">
            <p className="font-serif text-2xl tracking-widest text-white italic opacity-95 sm:text-3xl md:text-5xl">
              {config.events.akad.date}
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <Sparkles className="text-accent h-3 w-3 animate-pulse md:h-4 md:w-4" />
              <p className="font-sans text-accent text-[9px] font-semibold tracking-[0.25em] uppercase md:text-[13px]">
                {config.hero.city}
              </p>
              <Sparkles className="text-accent h-3 w-3 animate-pulse md:h-4 md:w-4" />
            </div>
          </div>
        </div>

        <div className="animate-reveal frosted-glass mt-8 flex items-center justify-center gap-4 rounded-[1.5rem] border border-white/40 px-6 py-5 shadow-2xl [animation-delay:600ms] md:mt-16 md:gap-14 md:rounded-[2.2rem] md:px-10 md:py-8 dark:border-white/10">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div
              key={label}
              className="flex min-w-[50px] flex-col items-center md:min-w-[80px]"
            >
              <span className="font-serif text-2xl leading-none font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
                {String(value).padStart(2, "0")}
              </span>
              <span className="font-sans text-accentDark dark:text-accent mt-1 text-[8px] font-bold tracking-[0.25em] uppercase md:mt-3 md:text-[11px]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handleScrollToContent}
          className="group mt-12 flex flex-col items-center gap-3 text-white/60 transition-all duration-500 hover:text-white md:mt-20 md:gap-4"
        >
          <div className="group-hover:border-accent group-hover:bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 shadow-lg backdrop-blur-sm transition-all md:h-12 md:w-12">
            <ChevronDown className="h-4 w-4 animate-bounce md:h-5 md:w-5" />
          </div>
          <span className="font-sans tracking-luxury text-[8px] font-bold uppercase opacity-75 group-hover:opacity-100 md:text-[9px]">
            View Details
          </span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
