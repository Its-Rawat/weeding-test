import React, { useState, useEffect } from "react";
import { Sparkles, Clock, Heart } from "lucide-react";
import type { AppConfig } from "../types";

interface CountdownProps {
  config: AppConfig;
}

const CountdownSection: React.FC<CountdownProps> = ({ config }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = config.events.akad.startDateTime.getTime();

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
  }, [config.events.akad.startDateTime]);

  return (
    <section id="countdown" className="py-12 sm:py-16 px-4 bg-[#FAF5EB] text-center border-y border-[#D4AF37]/30">
      <div className="max-w-xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-[#D4AF37]/50" />
          <Heart className="w-3.5 h-3.5 text-[#8C1D24] fill-[#8C1D24]/20" />
          <div className="w-8 h-0.5 bg-[#D4AF37]/50" />
        </div>

        <h3 className="font-serif italic text-2xl sm:text-3xl text-[#231C18] font-normal mb-1">
          Countdown to the Royal Nuptials
        </h3>
        <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C6B1C] font-semibold mb-6 sm:mb-8">
          Until We Say "I Do" At The Oberoi Udaivilas
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
              className="bg-[#FFFDF9] rounded-2xl border border-[#D4AF37]/50 p-3 sm:p-4 shadow-[0_4px_16px_rgba(140,107,28,0.06)] flex flex-col items-center justify-center transition-all hover:border-[#D4AF37] hover:scale-105"
            >
              <span className={`font-serif text-2xl sm:text-4xl font-bold leading-none ${item.isCrimson ? "text-[#8C1D24]" : "text-[#231C18]"}`}>
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6B1C] mt-1.5">
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
