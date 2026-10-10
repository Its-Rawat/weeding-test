import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, RefreshCcw } from "lucide-react";
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
      className="relative bg-[#FFFBF0] dark:bg-[#151111] py-20 sm:py-32 border-t border-[#374454]/15 dark:border-[#C5A059]/20 transition-colors duration-1000 overflow-hidden"
    >
      <div className="container mx-auto max-w-4xl px-4 md:px-6 relative z-10">
        
        {/* Section Header (Huey Lightshop Style) */}
        <div className="mb-12 space-y-3 text-center md:mb-16">
          <div className="inline-flex items-center gap-2 text-xs text-[#8C1D24] dark:text-[#C5A059] tracking-[0.25em] uppercase font-sans font-semibold">
            <span>🪷</span>
            <span>Attendance &amp; Blessings</span>
            <span>🪷</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl tracking-tight text-[#232B35] dark:text-white font-normal">
            RSVP
          </h2>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
            <span className="text-[#C5A059] text-xs">✦</span>
            <div className="h-px w-12 bg-[#374454]/25 dark:bg-[#C5A059]/40" />
          </div>

          <p className="font-editorial italic text-sm sm:text-base text-[#556272] dark:text-stone-300">
            Kindly confirm your auspicious presence at our royal celebrations
          </p>
        </div>

        {token ? (
          /* Personalized Invitation View */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#FFFBF0] dark:bg-[#1c1716] border border-[#374454]/20 dark:border-[#C5A059]/30 shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C1D24]" />
                <span className="font-editorial italic text-xs sm:text-sm text-[#232B35] dark:text-stone-200">
                  Personalized RSVP Active:{" "}
                  <code className="font-mono font-bold text-[#8C1D24] dark:text-[#E0A899] bg-[#FAF5EB] dark:bg-black/30 px-2 py-0.5 rounded border border-[#374454]/15">
                    {token}
                  </code>
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearToken}
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#374454] dark:text-[#C5A059] hover:underline cursor-pointer ml-auto"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Use Another Code</span>
              </button>
            </div>

            <PersonalizedRSVPSection token={token} />
          </div>
        ) : (
          /* Guest without invite link */
          <div className="max-w-md mx-auto text-center py-6">
            {!showTokenInput ? (
              <button
                type="button"
                onClick={() => setShowTokenInput(true)}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#FFFBF0] hover:bg-[#FAF5EB] dark:bg-[#1c1716] dark:hover:bg-[#251e1c] border border-[#374454]/25 dark:border-[#C5A059]/40 text-xs sm:text-sm font-semibold text-[#374454] dark:text-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059] group-hover:rotate-12 transition-transform" />
                <span>Have a personalized invitation code? Click here</span>
              </button>
            ) : (
              <form
                onSubmit={handleOpenToken}
                className="animate-reveal p-6 sm:p-8 rounded-2xl bg-[#FFFBF0] dark:bg-[#1c1716] border border-[#374454]/25 dark:border-[#C5A059]/40 shadow-md max-w-md mx-auto space-y-4 text-center"
              >
                <div className="flex items-center justify-between text-xs text-[#556272] dark:text-stone-400 font-editorial border-b border-[#374454]/15 pb-2">
                  <span className="font-medium text-[#232B35] dark:text-white">
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
                    className="flex-1 px-4 py-3 rounded-xl border border-[#374454]/25 bg-[#FAF5EB] dark:bg-[#251e1c] text-sm font-mono text-[#232B35] dark:text-white focus:outline-none focus:border-[#374454] text-center uppercase tracking-widest shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#374454] hover:bg-[#232B35] text-[#FFFBF0] text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#556272] dark:text-stone-400 font-editorial italic text-center">
                  *Your unique code was shared on your invitation link or WhatsApp message.
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
