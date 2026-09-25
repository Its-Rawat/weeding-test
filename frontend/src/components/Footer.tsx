import React from "react";
import { Heart, ChevronUp, Mail } from "lucide-react";

export const Footer: React.FC<{ coupleNames?: string }> = ({
  coupleNames = "Aditya & Ananya",
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-20 px-4 bg-[#FAF6EE] text-center border-t border-[#C5A059]/30 relative overflow-hidden">
      <div className="max-w-xl mx-auto space-y-8">
        
        <button
          onClick={scrollToTop}
          className="inline-flex flex-col items-center gap-2 group text-[#5C6B50] hover:text-[#722F37] transition-colors"
        >
          <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 flex items-center justify-center group-hover:bg-[#C5A059]/10 transition-colors">
            <ChevronUp className="w-4 h-4" />
          </div>
          <span className="font-serif italic text-xs tracking-widest uppercase">
            Back to Top
          </span>
        </button>

        {/* Monogram Seal */}
        <div className="w-16 h-16 rounded-full border-2 border-[#722F37] bg-[#FAF6EE] shadow-sm flex items-center justify-center mx-auto">
          <span className="font-serif font-bold text-lg text-[#722F37]">
            A &amp; A
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-3xl sm:text-4xl text-[#2A2F2B]">
            {coupleNames}
          </h3>
          <p className="font-serif italic text-stone-600 text-xs tracking-[0.25em] uppercase">
            26 September 2026 • Cap d'Antibes, France
          </p>
        </div>

        <p className="font-serif italic text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
          "Two souls with but a single thought, two hearts that beat as one."
        </p>

        <div className="pt-6 border-t border-[#C5A059]/20 flex flex-col items-center gap-2 text-[11px] text-stone-500 font-serif">
          <span>Host: <strong>Aditya Rawat</strong> (adi2002rawat@gmail.com)</span>
          <a
            href="mailto:adi2002rawat@gmail.com?subject=Wedding%20Inquiry%20-%20Aditya%20%26%20Ananya"
            className="inline-flex items-center gap-1.5 text-[#5C6B50] hover:text-[#722F37] transition-colors"
          >
            <Mail className="w-3 h-3 text-[#C5A059]" />
            <span>Contact Host</span>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
