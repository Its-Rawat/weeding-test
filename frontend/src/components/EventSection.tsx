import React from "react";
import { Clock, MapPin, Calendar } from "lucide-react";

export const EventSection: React.FC = () => {
  const events = [
    {
      title: "Welcome Dinner & Cocktails",
      date: "Friday, 25 September 2026",
      time: "6:30 – 10:00 PM",
      venue: "Villa La Garoupe Terrace",
      desc: "An intimate seaside aperitivo welcoming guests arriving in Antibes with French wines and hors d'oeuvres.",
      attire: "Riviera Chic / Linen & Pastels",
      mapsQuery: "Villa+La+Garoupe,+Antibes",
    },
    {
      title: "The Wedding Ceremony",
      date: "Saturday, 26 September 2026",
      time: "5:30 PM (Prompt)",
      venue: "The Seaside Balustrade, Plage Keller",
      desc: "Exchanging our vows overlooking the Mediterranean blue, accompanied by classical harp & strings.",
      attire: "Black Tie Formal",
      mapsQuery: "Plage+Keller,+Antibes",
    },
    {
      title: "Cocktail Hour & Sunset Toasts",
      date: "Saturday, 26 September 2026",
      time: "6:30 – 7:30 PM",
      venue: "The Pine Grove Lawn",
      desc: "Champagne toasts, freshly shucked oysters, and delicate canapés as twilight settles over the bay.",
      attire: "Black Tie Formal",
      mapsQuery: "Plage+Keller,+Antibes",
    },
    {
      title: "The Wedding Reception & Gala Dinner",
      date: "Saturday, 26 September 2026",
      time: "7:30 PM – Midnight",
      venue: "Le César Ballroom, Plage Keller",
      desc: "A multi-course gourmet Provencal feast, heartfelt speeches, dancing under crystal chandeliers by the water.",
      attire: "Black Tie Formal",
      mapsQuery: "Plage+Keller,+Antibes",
    },
    {
      title: "Farewell Riviera Brunch",
      date: "Sunday, 27 September 2026",
      time: "11:30 AM – 2:30 PM",
      venue: "Garden Courtyard, Cap d'Antibes",
      desc: "Relaxed farewell gathering with fresh pastries, mimosa bar, and gentle sea breezes before departures.",
      attire: "Casual Resort Chic",
      mapsQuery: "Cap+d'Antibes,+France",
    },
  ];

  return (
    <section id="events" className="py-20 sm:py-28 px-4 bg-[#FAF6EE] text-center border-t border-[#C5A059]/20">
      <div className="max-w-3xl mx-auto">
        
        <p className="font-serif italic text-xs tracking-[0.3em] uppercase text-[#7D9D8B] mb-2 font-medium">
          Weekend Itinerary
        </p>
        
        <h2 className="font-serif text-3xl sm:text-5xl text-[#2A2F2B] font-normal mb-3">
          Wedding Celebrations
        </h2>
        
        <p className="font-serif italic text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-12">
          We invite you to join us across three days of celebrations on the Côte d'Azur.
        </p>

        <div className="space-y-8">
          {events.map((evt, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/35 shadow-xs p-6 sm:p-8 text-left relative overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Thin decorative hand-drawn side border */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#C5A059]/60" />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                <h3 className="font-serif text-2xl text-[#2A2F2B] font-medium">
                  {evt.title}
                </h3>
                <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#722F37] uppercase">
                  {evt.date}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-stone-600 mb-3 font-serif">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  {evt.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  {evt.venue}
                </span>
              </div>

              <p className="font-serif italic text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                {evt.desc}
              </p>

              <div className="pt-3 border-t border-[#C5A059]/20 flex flex-wrap items-center justify-between text-xs gap-3">
                <span className="font-serif italic text-[#5C6B50]">
                  Attire: <strong>{evt.attire}</strong>
                </span>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(evt.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase font-sans tracking-[0.2em] text-[#5C6B50] hover:text-[#722F37] transition-colors border-b border-[#5C6B50]/30"
                >
                  <MapPin className="w-3 h-3 text-[#C5A059]" />
                  <span>Map Location</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventSection;
