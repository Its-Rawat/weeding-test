import React, { useState } from "react";
import { Gift, Copy, Check, MapPin, CreditCard, Sparkles } from "lucide-react";
import type { AppConfig } from "../types";

const GiftInfo: React.FC<{ config: AppConfig }> = ({ config }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="gift"
      className="dark:bg-darkBg bg-[#FAF5EB] py-16 transition-colors duration-1000 md:py-36 border-t border-[#D4AF37]/20"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 space-y-4 text-center md:mb-20 md:space-y-5">
          <div className="text-[#8C1D24] dark:text-accent mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#FFFDF9] shadow-md md:mb-10 md:h-18 md:w-18 md:rounded-[2rem] dark:border-white/10 dark:bg-white/5">
            <Gift className="h-6 w-6 md:h-9 md:w-9" />
          </div>
          <h2 className="font-serif text-4xl tracking-tight text-[#231C18] italic md:text-8xl dark:text-white">
            {config.text.gift.title}
          </h2>
          <div className="bg-[#D4AF37]/40 mx-auto h-[1px] w-20"></div>
          <p className="mx-auto max-w-xl text-base leading-relaxed font-light text-balance text-[#5A4D43] italic md:text-xl dark:text-slate-400">
            {config.text.gift.desc}
          </p>
        </div>
        <div className="mb-10 grid grid-cols-1 gap-5 md:mb-16 md:grid-cols-2 md:gap-10">
          {config.bankAccounts.map((acc, idx) => (
            <div
              key={idx}
              className="editorial-card group relative space-y-6 overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/35 bg-[#FFFDF9] p-8 shadow-sm transition-all hover:shadow-lg md:space-y-10 md:rounded-[3.5rem] md:p-14 dark:border-white/5"
            >
              <CreditCard className="text-[#D4AF37]/10 dark:text-accent/5 pointer-events-none absolute -top-10 -right-10 h-32 w-32 rotate-12 transition-transform duration-[3s] group-hover:scale-110 md:-top-16 md:-right-16 md:h-64 md:w-64" />
              <div className="relative z-10 space-y-6 text-center md:space-y-10 md:text-left">
                <div className="space-y-3 md:space-y-5">
                  <div className="flex items-center justify-center gap-2.5 md:justify-start">
                    <div className="bg-[#8C1D24] h-1.5 w-1.5 animate-pulse rounded-full"></div>
                    <p className="text-[#8C6B1C] dark:text-accent tracking-luxury text-[9px] font-bold uppercase md:text-[11px]">
                      {acc.bank}
                    </p>
                  </div>
                  <p className="font-serif text-2xl leading-none tracking-tighter break-all text-[#231C18] md:text-6xl dark:text-white">
                    {acc.number}
                  </p>
                  <p className="tracking-editorial text-[10px] font-medium text-[#5A4D43] uppercase italic md:text-[13px] dark:text-slate-500">
                    Account Name: {acc.name}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(acc.number, `bank-${idx}`)}
                  className={`tracking-editorial inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[9px] font-bold uppercase shadow-sm transition-all md:w-auto md:gap-4 md:px-10 md:py-4 md:text-[11px] cursor-pointer ${
                    copiedId === `bank-${idx}`
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#9A1616] text-white active:scale-95"
                  }`}
                >
                  {copiedId === `bank-${idx}` ? (
                    <Check className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  )}
                  {copiedId === `bank-${idx}` ? "Copied!" : "Copy Details"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="editorial-card group relative flex flex-col items-center gap-6 overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/35 bg-[#FFFDF9] p-6 text-center shadow-md transition-all duration-1000 md:flex-row md:gap-10 md:rounded-[4rem] md:p-14 md:text-left dark:border-white/5">
          <div className="from-[#D4AF37]/10 absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
          <div className="text-[#8C1D24] dark:text-accent animate-float flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#FAF5EB] shadow-sm md:h-24 md:w-24 dark:border-white/10 dark:bg-white/5">
            <MapPin className="h-6 w-6 md:h-10 md:w-10" />
          </div>
          <div className="relative z-10 flex-grow space-y-1.5 md:space-y-3">
            <div className="text-[#8C6B1C] dark:text-accent flex items-center justify-center gap-2 md:justify-start">
              <Sparkles className="h-3.5 w-3.5 md:h-5 md:w-5 text-[#8C1D24]" />
              <h4 className="font-serif text-xl tracking-tight text-[#231C18] italic md:text-4xl">
                Gift Delivery Address
              </h4>
            </div>
            <p className="text-sm leading-relaxed font-light text-balance text-[#5A4D43] italic md:text-xl dark:text-slate-400">
              {config.venue.address}
            </p>
          </div>
          <button
            onClick={() =>
              copyToClipboard(config.venue.address, "address-gift")
            }
            className={`tracking-luxury relative z-10 inline-flex w-full items-center justify-center gap-3 rounded-xl px-8 py-3.5 text-[9px] font-bold uppercase shadow-sm transition-all md:w-auto md:rounded-[2.5rem] md:px-10 md:py-4 md:text-[11px] cursor-pointer ${
              copiedId === "address-gift"
                ? "bg-green-600 text-white"
                : "bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#9A1616] text-white active:scale-95"
            }`}
          >
            {copiedId === "address-gift" ? (
              <Check className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Copy className="h-4 w-4 md:h-5 md:w-5" />
            )}
            {copiedId === "address-gift" ? "Copied!" : "Copy Address"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default GiftInfo;
