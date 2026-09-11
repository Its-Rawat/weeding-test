import React, { useState, useEffect } from 'react';

export default function Countdown({ targetDate = "2026-11-28T18:00:00" }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-[#FFFDF9] to-[#F7F2E9] border-y border-gold-300/40 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Sanskrit Auspicious Blessing */}
        <p className="text-xs md:text-sm font-serif italic text-gold-800 tracking-wider mb-2">
          ॥ ॐ श्री गणेशाय नमः ॥
        </p>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-charcoal tracking-wide mb-1">
          Counting Down to the Auspicious Muhurat
        </h2>
        <p className="text-xs uppercase tracking-widest text-gold-700 font-semibold mb-8">
          The Wedding Celebration Begins In
        </p>

        {/* Timer Blocks */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-6 max-w-2xl mx-auto">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="bg-white/90 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-gold-300/80 shadow-md flex flex-col items-center justify-center transform transition-transform hover:-translate-y-1"
            >
              <span className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl text-gold-800">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-charcoal/60 mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Shloka caption */}
        <p className="mt-8 text-xs text-charcoal/60 max-w-lg mx-auto italic font-serif">
          "Where there is love, there is life. Blessed with the holy seven vows, bound by faith and eternity."
        </p>
      </div>
    </section>
  );
}
