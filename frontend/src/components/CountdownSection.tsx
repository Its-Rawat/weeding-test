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
    <section id="countdown" className="py-12 sm:py-16 px-4 bg-[#FFFDF9] text-center border-y border-[#d4af37]/20">
      <div className="max-w-xl mx-auto">
        
        {/* Subtle Section Header matching video frame 00:07 */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-[#d4af37]/40" />
          <Heart className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]/20" />
          <div className="w-8 h-0.5 bg-[#d4af37]/40" />
        </div>

        <h3 className="font-serif italic text-2xl sm:text-3xl text-stone-800 font-normal mb-1">
          Countdown to the Big Day
        </h3>
        <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9e7241] font-semibold mb-6 sm:mb-8">
          Until We Say "I Do" In Udaipur
        </p>

        {/* Minimalist 4-Box Grid matching video frame 00:07 */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINS", value: timeLeft.minutes },
            { label: "SECS", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] rounded-2xl border border-[#d4af37]/40 p-3 sm:p-4 shadow-sm flex flex-col items-center justify-center transition-all hover:border-[#d4af37]"
            >
              <span className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-none">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#9e7241] mt-1.5">
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
