import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import type { AppConfig } from "../types";
import { Link001, Link003 } from "./ui/skiper-ui/skiper40";

interface CountdownProps {
  config: AppConfig;
  allowedEvents?: string[] | null;
}

const CountdownSection: React.FC<CountdownProps> = ({ config, allowedEvents }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const hasMehendi = Boolean(
    allowedEvents && allowedEvents.some((e) => e.toUpperCase().includes("MEH"))
  );

  const weddingCeremony =
    config.celebrations?.find(
      (c) => c.key === "WEDDING" || c.title.toLowerCase().includes("wedding")
    ) || config.celebrations?.[config.celebrations.length - 1];

  const targetIso =
    weddingCeremony?.startIso ||
    (config.events?.akad?.startDateTime
      ? new Date(config.events.akad.startDateTime).toISOString()
      : "2027-02-15T19:00:00+05:30");

  const celebrationSubtitle = hasMehendi
    ? "14 & 15 February 2027"
    : weddingCeremony?.dayDate
    ? weddingCeremony.dayDate.replace(/^[A-Za-z]+,\s*/, "")
    : "15 February 2027";

  useEffect(() => {
    const target = new Date(targetIso).getTime();

    const updateCountdown = () => {
      const distance = target - new Date().getTime();
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  return (
    <section id="countdown" className="relative py-12 sm:py-16 px-4 bg-gradient-to-b from-[#FAF5EB] via-[#FFFDF9] to-[#FAF5EB] dark:from-[#151111] dark:via-[#1F1718] dark:to-[#151111] text-center border-y border-[#D4AF37]/30 dark:border-white/10 transition-colors duration-700 overflow-hidden">
      {/* 2026 Ambient Gradient Lighting */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#EC4899]/15 via-[#FBBF24]/10 to-transparent dark:from-[#EC4899]/10 dark:via-transparent dark:to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#FBBF24]" />
          <Heart className="w-4 h-4 text-[#EC4899] dark:text-[#F472B6] fill-[#EC4899]/30 dark:fill-[#F472B6]/30 animate-pulse" />
          <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-[#F472B6]" />
        </div>

        <h3 className="font-serif italic text-2xl sm:text-3xl text-[#231C18] dark:text-[#FAF5EB] font-normal mb-1">
          Counting Down to Our Wedding Day
        </h3>
        <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D97706] dark:text-[#FBBF24] font-semibold mb-6 sm:mb-8">
          Until We Celebrate Together • {celebrationSubtitle}
        </p>

        {/* Festive Pearl White & Rose-Gold Countdown Tiles */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-md mx-auto py-2 mb-4">
          {[
            { label: "Days", value: timeLeft.days, color: "text-[#D97706] dark:text-[#FBBF24]" },
            { label: "Hours", value: timeLeft.hours, color: "text-[#D97706] dark:text-[#FBBF24]" },
            { label: "Mins", value: timeLeft.minutes, color: "text-[#DB2777] dark:text-[#F472B6]" },
            { label: "Secs", value: timeLeft.seconds, color: "text-[#E11D48] dark:text-[#FB7185]" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-white/5 border border-pink-100/90 dark:border-white/10 shadow-[0_4px_16px_rgba(236,72,153,0.06)] backdrop-blur-xs transition-transform hover:scale-105"
            >
              <span className={`font-serif text-2xl sm:text-4xl font-semibold leading-none block ${item.color}`}>
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6B1C] dark:text-stone-300 block mt-1.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Skiper UI (skiper40) Micro-interaction Action Links */}
        <div className="pt-5 flex items-center justify-center gap-6 sm:gap-8 text-xs font-sans uppercase tracking-wider">
          <Link001
            href="#event"
            className="text-[#D97706] dark:text-[#FBBF24] font-semibold hover:text-[#EC4899] dark:hover:text-white transition-colors cursor-pointer"
          >
            Ceremony Schedule
          </Link001>
          <span className="text-pink-300/60 dark:text-white/20 select-none">&bull;</span>
          <Link003
            href="#rsvp"
            className="text-[#DB2777] dark:text-[#F472B6] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Confirm RSVP
          </Link003>
        </div>

      </div>
    </section>
  );
};

export default CountdownSection;
