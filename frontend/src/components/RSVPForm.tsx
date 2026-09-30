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
      className="dark:bg-darkBg bg-[#FAF5EB] py-16 transition-colors duration-1000 md:py-28 border-t border-[#D4AF37]/20"
    >
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
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
          /* Guest without invite link: ONLY show "Have a personalized invitation code? Click here" button */
          <div className="max-w-md mx-auto text-center py-6">
            {!showTokenInput ? (
              <button
                type="button"
                onClick={() => setShowTokenInput(true)}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#FFFDF9] hover:bg-[#F3E7D5] border-2 border-[#D4AF37]/70 text-xs sm:text-sm font-semibold text-[#8C6B1C] hover:text-[#8C1D24] shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
                <span>Have a personalized invitation code? Click here</span>
              </button>
            ) : (
              <form
                onSubmit={handleOpenToken}
                className="animate-reveal p-6 sm:p-7 rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37]/70 shadow-lg max-w-md mx-auto space-y-4 text-center"
              >
                <div className="flex items-center justify-between text-xs text-[#5A4D43] font-serif border-b border-[#D4AF37]/25 pb-2">
                  <span className="font-medium text-[#231C18]">
                    Enter your personal invitation code:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTokenInput(false)}
                    className="text-[10px] text-stone-400 hover:text-stone-600 font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. 7Kx92LmPq8Za"
                    value={manualTokenInput}
                    onChange={(e) => setManualTokenInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl border border-[#D4AF37]/50 bg-[#FAF5EB] text-sm font-mono text-[#231C18] focus:outline-none focus:border-[#8C1D24] text-center uppercase tracking-widest shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#8C1D24] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#8C6B1C] font-serif italic text-center">
                  Please enter the private code provided with your invitation.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RSVPForm;
