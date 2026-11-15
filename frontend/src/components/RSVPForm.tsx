import React, { useState, useEffect } from "react";
import { Heart, Sparkles, ArrowRight, RefreshCcw } from "lucide-react";
import type { AppConfig } from "../types";
import { PersonalizedRSVPSection } from "./PersonalizedRSVPSection";

const extractTokenFromUrl = (): string | null => {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/\/rsvp\/([a-zA-Z0-9_-]+)/);
  if (match && match[1] && match[1].toLowerCase() !== "stats") {
    return match[1];
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("token") || params.get("rsvp") || null;
};

const RSVPForm: React.FC<{ config?: AppConfig }> = () => {
  const [token, setToken] = useState<string | null>(extractTokenFromUrl());
  const [manualTokenInput, setManualTokenInput] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setToken(extractTokenFromUrl());
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const handleOpenToken = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualTokenInput.trim();
    if (clean) {
      setToken(clean);
      window.history.pushState({}, "", `/rsvp/${clean}`);
      setShowTokenInput(false);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const handleClearToken = () => {
    setToken(null);
    setManualTokenInput("");
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <section
      id="rsvp"
      className="relative dark:bg-darkBg bg-[#FAF5EB] py-16 transition-colors duration-1000 md:py-28 border-t border-[#D4AF37]/20 overflow-hidden"
    >
      {/* 2026 Ambient Gradient Lighting */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-[#D4AF37]/15 via-[#F7D8A5]/10 to-transparent blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-28 right-10 w-96 h-96 rounded-full bg-gradient-to-tl from-[#8C1D24]/10 via-transparent to-transparent blur-3xl -z-10" />

      <div className="container mx-auto max-w-4xl px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-10 space-y-3 text-center md:mb-14">
          <Heart className="text-[#8C1D24] dark:text-accent mx-auto mb-2 h-5 w-5 animate-pulse" />
          <h2 className="font-serif text-4xl tracking-tight text-[#231C18] italic md:text-7xl dark:text-white">
            RSVP
          </h2>
          <p className="tracking-luxury text-[9px] font-bold text-[#8C6B1C] uppercase md:text-[11px] dark:text-slate-400">
            Kindly confirm your auspicious presence
          </p>
        </div>

        {token ? (
          /* Personalized Invitation View (No Guest List) */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C1D24]" />
                <span className="font-serif italic text-xs sm:text-sm text-[#231C18]">
                  Personalized RSVP Active:{" "}
                  <code className="font-mono font-bold text-[#8C1D24] bg-[#FAF5EB] px-2 py-0.5 rounded border border-[#D4AF37]/40">
                    {token}
                  </code>
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearToken}
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8C6B1C] hover:text-[#8C1D24] hover:underline cursor-pointer ml-auto"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Use Another Code</span>
              </button>
            </div>

            <PersonalizedRSVPSection token={token} />
          </div>
        ) : (
          /* Guest without invite link: Elevated Luxury Arched Stationery Card */
          <div className="max-w-lg mx-auto">
            <div className="rounded-3xl sm:rounded-4xl p-7 sm:p-10 bg-white/85 dark:bg-darkSurface/90 border border-pink-200/80 dark:border-white/10 shadow-[0_16px_45px_rgba(236,72,153,0.08)] backdrop-blur-md text-center space-y-6 relative overflow-hidden">
              {/* Subtle Ambient Card Glow */}
              <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#FDE047]/15 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#EC4899]/15 blur-2xl" />

              {/* Decorative Envelope Emblem */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[#FEF08A]/80 via-[#FCE7F3] to-[#FDE68A]/80 flex items-center justify-center mx-auto shadow-xs border border-pink-200/60 text-xl">
                💌
              </div>

              {/* Card Heading */}
              <div className="relative z-10 space-y-1.5">
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#191410] dark:text-[#FAF5EB] tracking-wide">
                  Guest Verification
                </h3>
                <p className="font-serif italic text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
                  Please enter your personal invitation code to confirm your attendance and ceremony schedule.
                </p>
              </div>

              {!showTokenInput ? (
                <div className="relative z-10 space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTokenInput(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#F59E0B] text-white text-xs sm:text-sm font-sans font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:opacity-95 transition-all cursor-pointer group active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                    <span>Enter Invitation Code</span>
                  </button>

                  <div className="pt-2">
                    <a
                      href="mailto:rsvp@chandrikawedsxudong.com?subject=Wedding%20RSVP%20Assistance%20-%20Chandrika%20%26%20Xudong"
                      className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#8C6B1C] dark:text-[#D4AF37] hover:text-[#8C1D24] font-medium tracking-wide hover:underline cursor-pointer"
                    >
                      <span>Need help with your code? Contact Host</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleOpenToken}
                  className="relative z-10 animate-reveal pt-2 space-y-4 text-center"
                >
                  <div className="flex items-center justify-between text-xs text-[#5A4D43] font-serif border-b border-pink-200/50 pb-2">
                    <span className="font-medium text-[#231C18] dark:text-white">
                      Enter your private code:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTokenInput(false)}
                      className="text-[10.5px] text-stone-400 hover:text-stone-600 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. 7Kx92LmPq8Za"
                      value={manualTokenInput}
                      onChange={(e) => setManualTokenInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl border border-pink-200/80 bg-white dark:bg-black/30 text-sm font-mono text-[#231C18] dark:text-white focus:outline-none focus:border-[#EC4899] text-center uppercase tracking-widest shadow-inner"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#F59E0B] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8C6B1C] dark:text-[#D4AF37] font-serif italic text-center">
                    Check your digital invitation or WhatsApp message for your unique link.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RSVPForm;
