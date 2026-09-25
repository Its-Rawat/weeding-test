import React from "react";
import coastalFrameImg from "../assets/watercolor/coastal_botanical_frame.jpg";

export const CoastalFrameSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#FAF6EE] text-center border-t border-[#C5A059]/20">
      <div className="max-w-2xl mx-auto">
        
        {/* Coastal Botanical Framed Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-xl bg-[#FFFDF9] p-4 sm:p-8">
          
          <div className="relative w-full overflow-hidden rounded-2xl">
            <img
              src={coastalFrameImg}
              alt="Coastal Botanical Wedding Watercolor Frame"
              className="w-full h-auto object-cover"
            />

            {/* Central Editorial Inset Letter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-14 text-center">
              <div className="bg-[#FAF6EE]/92 backdrop-blur-md rounded-2xl border border-[#C5A059]/40 p-6 sm:p-8 max-w-md shadow-md">
                
                <span className="font-serif italic text-xs text-[#7D9D8B] tracking-widest uppercase block mb-1">
                  A Love Letter to our Guests
                </span>
                
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2A2F2B] font-normal mb-3">
                  Under the Mediterranean Skies
                </h3>
                
                <p className="font-serif italic text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  "Surrounded by fragrant olive groves, hummingbirds, and the quiet rhythm of the Riviera tides, we cannot wait to share these unforgettable moments with the people who mean the world to us."
                </p>

                <div className="w-12 h-0.5 bg-[#C5A059]/50 mx-auto mb-2 rounded-full" />
                
                <span className="font-serif font-bold text-xs tracking-wider text-[#722F37] uppercase">
                  With All Our Love
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CoastalFrameSection;
