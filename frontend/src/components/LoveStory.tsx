import React from "react";
import { Heart, Sparkles } from "lucide-react";
import type { AppConfig } from "../types";

const LoveStory: React.FC<{ config: AppConfig }> = ({ config }) => {
  return (
    <section
      id="story"
      className="dark:bg-darkBg relative overflow-hidden bg-[#FAF5EB] py-24 transition-colors duration-1000 md:py-36 border-t border-[#D4AF37]/20"
    >
      <div className="relative z-10 container mx-auto max-w-5xl px-6">
        <div className="mb-20 space-y-5 text-center md:mb-28">
          <Sparkles className="text-[#8C6B1C] dark:text-accent/30 mx-auto mb-3 h-6 w-6 animate-pulse" />
          <h2 className="font-serif text-5xl tracking-tight text-[#231C18] italic md:text-8xl dark:text-white">
            Our Love Story
          </h2>
          <div className="bg-[#D4AF37]/40 mx-auto h-[1px] w-24"></div>
          <p className="text-[11px] font-bold tracking-[0.5em] text-[#8C6B1C] uppercase dark:text-slate-400">
            Two hearts, one lifelong journey
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 hidden h-full w-[2px] -translate-x-1/2 bg-[#D4AF37]/35 md:block dark:bg-white/10"></div>
          <div className="space-y-14 md:space-y-20">
            {config.loveStory.map((story, index) => (
              <div
                key={index}
                className={`relative flex flex-col items-center gap-10 md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="dark:bg-darkSurface border-[#D4AF37] dark:border-accent absolute left-1/2 z-10 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-[#FFFDF9] shadow-md transition-colors duration-1000 md:flex">
                  <div className="bg-[#8C1D24] dark:bg-accent h-2 w-2 animate-pulse rounded-full"></div>
                </div>
                <div
                  className={`editorial-card w-full rounded-[2.5rem] p-8 shadow-lg md:w-[44%] md:p-12 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <span className="text-[#8C1D24] dark:text-accent mb-4 block text-[11px] font-bold tracking-[0.4em] uppercase">
                    {story.date}
                  </span>
                  <h3 className="mb-4 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#231C18] italic md:text-4xl dark:text-slate-100">
                    {story.title}
                  </h3>
                  <p className="text-base leading-relaxed font-light text-[#5A4D43] italic md:text-lg dark:text-slate-400">
                    {story.desc}
                  </p>
                  <div
                    className={`mt-6 flex ${
                      index % 2 === 0 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Heart className="text-[#8C1D24]/30 h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-[#D4AF37]/5 pointer-events-none absolute top-1/2 left-0 -z-0 translate-x-[-20%] -translate-y-1/2 -rotate-12 font-serif text-[20rem] whitespace-nowrap italic dark:text-white/5">
        Our Story Our Story Our Story
      </div>
    </section>
  );
};

export default LoveStory;
