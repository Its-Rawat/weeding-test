import React from "react";
import { Sparkles, Palette } from "lucide-react";

export default function DressCodePalette() {
  const palettes = [
    {
      ceremony: "Mehndi Carnival",
      date: "Thursday, 26 Nov",
      theme: "Pastel Greens & Vibrant Florals",
      desc: "Breathable pastels, mint greens, and floral printed kurtas or lehengas suited for an afternoon lawn carnival.",
      colors: [
        { name: "Pastel Mint", hex: "#A8D5BA" },
        { name: "Sage Olive", hex: "#7D9D8B" },
        { name: "Blush Rose", hex: "#F7C5CC" },
        { name: "Champagne Cream", hex: "#FAF3E0" },
      ],
    },
    {
      ceremony: "Haldi & Phoolon Ki Holi",
      date: "Friday, 27 Nov",
      theme: "Auspicious Marigold & Sunny Ochre",
      desc: "Joyous shades of yellow and orange designed for fragrant flower petal blessings by the poolside.",
      colors: [
        { name: "Marigold Orange", hex: "#E67E22" },
        { name: "Sunflower Yellow", hex: "#F1C40F" },
        { name: "Turmeric Ochre", hex: "#D4AC0D" },
        { name: "Ivory White", hex: "#FFFDF7" },
      ],
    },
    {
      ceremony: "Sangeet & Cocktails",
      date: "Friday, 27 Nov",
      theme: "Glitz, Shimmer & Evening Glamour",
      desc: "Indo-Western tuxedos, cocktail gowns, and shimmering mirror-work lehengas for high-energy dancing under the chandeliers.",
      colors: [
        { name: "Champagne Gold", hex: "#D4AF37" },
        { name: "Midnight Navy", hex: "#1B263B" },
        { name: "Wine Plum", hex: "#581845" },
        { name: "Charcoal Silver", hex: "#343A40" },
      ],
    },
    {
      ceremony: "Vivah Sanskar & Royal Reception",
      date: "Saturday, 28 Nov",
      theme: "Heritage Banarasi Silks & Black Tie",
      desc: "Regal Indian heritage attire (sherwanis, safas, silk sarees) or black tie formal evening wear for the sacred pheras and gala feast.",
      colors: [
        { name: "Banarasi Rani", hex: "#B73239" },
        { name: "Imperial Gold", hex: "#C5A059" },
        { name: "Royal Maroon", hex: "#641E16" },
        { name: "Heritage Ivory", hex: "#FAF6F0" },
      ],
    },
  ];

  return (
    <section id="dress-code" className="py-16 sm:py-24 px-4 bg-[#FAF5EB] border-t border-[#D4AF37]/20">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#8C6B1C] tracking-widest uppercase font-serif font-medium mb-1">
            <span>🎨</span>
            <span>Guest Attire Guide</span>
            <span>🎨</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#231C18] font-normal">
            Dress Code &amp; Color Palette
          </h2>
          <p className="font-sans text-xs text-[#5A4D43] max-w-md mx-auto mt-2 leading-relaxed">
            To create a visually harmonious atmosphere in our wedding photographs, we invite our cherished guests to take inspiration from these curated royal palettes.
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto mt-3 rounded-full" />
        </div>

        {/* Palette Cards */}
        <div className="space-y-6">
          {palettes.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF9] rounded-3xl border border-[#D4AF37]/45 p-5 sm:p-7 shadow-[0_4px_20px_rgba(140,107,28,0.06)] hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/25 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C1D24] block">
                    {p.date}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#231C18]">
                    {p.ceremony}
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-[#231C18] bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#D4AF37]/35 shadow-2xs">
                  {p.theme}
                </span>
              </div>

              <p className="text-xs text-[#5A4D43] font-light mb-4 leading-relaxed">
                {p.desc}
              </p>

              {/* Color Swatch Circles */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                {p.colors.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 group cursor-pointer">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#FFFDF9] shadow-md transition-transform group-hover:scale-115 ring-1 ring-[#D4AF37]/30"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex})`}
                    />
                    <span className="text-[11px] text-[#231C18] font-medium hidden sm:inline">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
