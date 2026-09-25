import React from "react";
import fashionImg from "../assets/watercolor/black_tie_fashion.jpg";

export const DressCodeSection: React.FC = () => {
  return (
    <section id="details" className="py-20 sm:py-28 px-4 bg-[#FAF6EE] text-center border-t border-[#C5A059]/20">
      <div className="max-w-2xl mx-auto">
        
        {/* Irregular hand-drawn botanical border container */}
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-dashed border-[#C5A059]/50 shadow-[0_15px_45px_rgba(74,47,20,0.06)] p-6 sm:p-12 relative overflow-hidden">
          
          <p className="font-serif italic text-xs tracking-[0.3em] uppercase text-[#7D9D8B] mb-2 font-medium">
            Attire Guidance
          </p>
          
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2A2F2B] font-normal mb-2">
            Dress Code
          </h2>
          
          <div className="w-16 h-0.5 bg-[#C5A059]/50 mx-auto my-3 rounded-full" />
          
          <p className="font-serif text-2xl sm:text-3xl text-[#722F37] font-medium tracking-wide my-3">
            Black Tie
          </p>
          
          <p className="font-serif italic text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-8">
            Gentlemen are kindly requested to wear classic black-tie tuxedos or dark formal evening suits. Ladies are invited to wear floor-length evening gowns or elegant French cocktail couture in soft romantic hues.
          </p>

          {/* Vintage Fashion Watercolor Artwork */}
          <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-md max-w-sm mx-auto">
            <img
              src={fashionImg}
              alt="Vintage Fashion Watercolor of Elegantly Dressed Couple"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-[#FAF6EE]/90 backdrop-blur-md border border-[#8C7355]/30 text-[9px] font-serif italic text-[#5C6B50]">
              Riviera Evening Elegance
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default DressCodeSection;
