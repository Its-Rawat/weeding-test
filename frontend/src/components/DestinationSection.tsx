import React from "react";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import rivieraImg from "../assets/watercolor/venue_cap_dantibes.jpg";

export const DestinationSection: React.FC = () => {
  const mapsUrl = "https://maps.google.com/?q=Plage+Keller,+Chemin+de+la+Garoupe,+06160+Antibes,+France";
  
  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Aditya & Ananya Wedding Celebration");
    const details = encodeURIComponent("Wedding ceremony and evening reception at Plage Keller, Cap d'Antibes, France.");
    const location = encodeURIComponent("Plage Keller, Chemin de la Garoupe, 06160 Antibes, France");
    const dates = "20260926T173000Z/20260926T230000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`, "_blank");
  };

  return (
    <section id="destination" className="py-20 sm:py-28 px-4 bg-[#FAF6EE] text-center border-t border-[#C5A059]/20">
      <div className="max-w-3xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <p className="font-serif italic text-xs tracking-[0.3em] uppercase text-[#7D9D8B] mb-2 font-medium">
            Destination Nuptials
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2A2F2B] font-normal tracking-wide">
            Cap d'Antibes, France
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059]/50 mx-auto mt-4 rounded-full" />
        </div>

        {/* French Riviera Hand-Painted Watercolor Painting */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#C5A059]/40 shadow-[0_15px_45px_rgba(74,47,20,0.06)] p-4 sm:p-8 mb-10 overflow-hidden">
          <div className="relative rounded-2xl overflow-hidden shadow-inner mb-6">
            <img
              src={rivieraImg}
              alt="Plage Keller, Cap d'Antibes Watercolor"
              className="w-full h-auto object-cover max-h-[500px]"
            />
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#FAF6EE]/90 backdrop-blur-md border border-[#8C7355]/30 text-[10px] font-serif italic text-[#5C6B50]">
              Hand-painted watercolor • Côte d'Azur
            </div>
          </div>

          {/* Details lockup */}
          <div className="space-y-4 max-w-lg mx-auto text-center">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2A2F2B] font-medium">
              Plage Keller
            </h3>
            
            <p className="font-serif italic text-stone-600 text-sm sm:text-base leading-relaxed">
              Nestled along the tranquil bay of Chemin de la Garoupe, where turquoise Mediterranean waters meet the pine-scented cliffs of Cap d'Antibes.
            </p>

            <div className="py-4 border-y border-[#C5A059]/30 space-y-1">
              <p className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#5C6B50]">
                Saturday | 26 September 2026
              </p>
              <p className="font-serif italic text-sm text-stone-700">
                5:30 – 8:30 PM &amp; Dinner to follow
              </p>
              <p className="font-sans text-xs text-stone-600 pt-1">
                Chemin de la Garoupe, 06160 Antibes, France
              </p>
            </div>

            {/* Stationery Styled Action Links */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#5C6B50] hover:text-[#722F37] transition-colors py-1 border-b border-[#5C6B50]/40 hover:border-[#722F37]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                <span>Open in Maps</span>
              </a>

              <button
                onClick={handleAddToCalendar}
                className="group inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#5C6B50] hover:text-[#722F37] transition-colors py-1 border-b border-[#5C6B50]/40 hover:border-[#722F37]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                <span>Add to Calendar</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default DestinationSection;
