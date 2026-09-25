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
    <section id="dress-code" className="py-16 sm:py-24 px-4 bg-[#FFFDF9] border-t border-[#d4af37]/20">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Title matching video frame 00:08 */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#9e7241] tracking-widest uppercase font-serif font-medium mb-1">
            <span>🎨</span>
            <span>Guest Attire Guide</span>
            <span>🎨</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-stone-900 font-normal">
            Dress Code &amp; Color Palette
          </h2>
          <p className="font-sans text-xs text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
            To create a visually harmonious atmosphere in our wedding photographs, we invite our cherished guests to take inspiration from these curated palettes.
          </p>
          <div className="w-16 h-0.5 bg-[#d4af37]/50 mx-auto mt-3 rounded-full" />
        </div>

        {/* Palette Cards matching video frame 00:08 */}
        <div className="space-y-6">
          {palettes.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] rounded-3xl border border-[#d4af37]/40 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e7241] block">
                    {p.date}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                    {p.ceremony}
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-stone-700 bg-white px-3 py-1 rounded-full border border-[#d4af37]/30 shadow-xs">
                  {p.theme}
                </span>
              </div>

              <p className="text-xs text-stone-600 font-light mb-4 leading-relaxed">
                {p.desc}
              </p>

              {/* Color Swatch Circles matching video frame 00:08 */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                {p.colors.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 group cursor-pointer">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex})`}
                    />
                    <span className="text-[11px] text-stone-700 font-medium hidden sm:inline">
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
