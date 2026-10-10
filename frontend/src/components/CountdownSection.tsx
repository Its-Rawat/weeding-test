import React, { useState, useEffect } from "react";
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
    <section
      id="countdown"
      className="relative py-14 sm:py-20 px-4 bg-[#FFFBF0] dark:bg-[#151111] text-center border-t border-[#374454]/15 dark:border-[#C5A059]/20 transition-colors duration-1000 overflow-hidden"
    >
      <div className="max-w-xl mx-auto relative z-10">
        
        {/* Section Header (Huey Lightshop Minimalist Style) */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-8 h-px bg-[#374454]/25 dark:bg-[#C5A059]/40" />
          <span className="text-[#C5A059] text-xs">✦</span>
          <div className="w-8 h-px bg-[#374454]/25 dark:bg-[#C5A059]/40" />
        </div>

        <h3 className="font-editorial italic text-2xl sm:text-3xl text-[#232B35] dark:text-white font-normal mb-1">
          Countdown to the Sacred Vows
        </h3>
        <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#556272] dark:text-[#C5A059] font-medium mb-6 sm:mb-8">
          Under The Holy Mandap • {celebrationSubtitle}
        </p>

        {/* Minimalist 4-Box Grid with Fine Hairline Borders */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
          {[
            { label: "DAYS", value: timeLeft.days, isCrimson: false },
            { label: "HOURS", value: timeLeft.hours, isCrimson: false },
            { label: "MINS", value: timeLeft.minutes, isCrimson: false },
            { label: "SECS", value: timeLeft.seconds, isCrimson: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFFBF0] dark:bg-[#1c1716] rounded-xl border border-[#374454]/20 dark:border-[#C5A059]/30 p-3 sm:p-4 shadow-2xs flex flex-col items-center justify-center transition-all hover:border-[#374454]/40"
            >
              <span
                className={`font-editorial text-2xl sm:text-4xl font-normal leading-none ${
                  item.isCrimson ? "text-[#8C1D24] dark:text-[#E0A899]" : "text-[#232B35] dark:text-white"
                }`}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#556272] dark:text-[#C5A059] mt-2">
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
