import React, { useState, useEffect } from "react";
import { Sparkles, Clock, Heart } from "lucide-react";
import type { AppConfig } from "../types";

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
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  return (
    <section id="countdown" className="py-12 sm:py-16 px-4 bg-[#F8F9FA] dark:bg-[#12151A] text-center border-y border-[#D4AF37]/25 dark:border-white/10 transition-colors">
      <div className="max-w-xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-[#D4AF37]/40 rounded-full" />
          <Heart className="w-3.5 h-3.5 text-[#8C1D24] fill-[#8C1D24]/20" />
          <div className="w-8 h-0.5 bg-[#D4AF37]/40 rounded-full" />
        </div>

        <h3 className="font-serif italic text-2xl sm:text-3xl text-[#1E242B] dark:text-white font-normal mb-1">
          Countdown to the Royal Nuptials
        </h3>
        <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#967836] dark:text-[#D4AF37] font-semibold mb-6 sm:mb-8">
          Until We Celebrate Under The Mandap • {celebrationSubtitle}
        </p>

        {/* Minimalist 4-Box Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
          {[
            { label: "DAYS", value: timeLeft.days, isCrimson: false },
            { label: "HOURS", value: timeLeft.hours, isCrimson: false },
            { label: "MINS", value: timeLeft.minutes, isCrimson: false },
            { label: "SECS", value: timeLeft.seconds, isCrimson: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] dark:bg-[#1A1F26] rounded-2xl border border-[#D4AF37]/40 dark:border-white/10 p-3 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col items-center justify-center transition-all hover:border-[#D4AF37] hover:scale-105"
            >
              <span className={`font-serif text-2xl sm:text-4xl font-bold leading-none ${item.isCrimson ? "text-[#8C1D24] dark:text-[#FFE082]" : "text-[#1E242B] dark:text-white"}`}>
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#967836] dark:text-[#D4AF37] mt-1.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CountdownSection;
