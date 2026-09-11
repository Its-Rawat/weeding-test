import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Sun, Music, Crown, Flame, Wine, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Sun: Sun,
  Music: Music,
  Crown: Crown,
  Flame: Flame,
  Wine: Wine,
};

export default function EventsTimeline({ events = [] }) {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);

  if (!events.length) return null;

  const currentEvent = events[selectedEventIndex] || events[0];
  const IconComponent = iconMap[currentEvent.icon] || Sparkles;

  const handleNext = () => {
    setSelectedEventIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    setSelectedEventIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const createGoogleCalendarUrl = (event) => {
    const title = encodeURIComponent(`Chandrika & Xudong Wedding: ${event.title}`);
    const details = encodeURIComponent(`${event.description}\nDress Code: ${event.dressCode}\nVenue: ${event.venueName}`);
    const location = encodeURIComponent(`${event.venueName}, ${event.venueAddress}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
          <Calendar className="w-3 h-3 text-gold-700" />
          Ceremony Itinerary
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-1">
          Wedding Functions & Ceremonies
        </h2>
        <p className="text-xs text-charcoal/60 max-w-md mx-auto mt-0.5">
          Select a ceremony below or use the arrows to view schedule, attire, and venue details.
        </p>
      </div>

      {/* Function Tabs Bar (Numbered 1-6) */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {events.map((evt, idx) => {
          const isSelected = idx === selectedEventIndex;
          const TabIcon = iconMap[evt.icon] || Sparkles;

          return (
            <button
              key={evt.id || idx}
              onClick={() => setSelectedEventIndex(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 ${
                isSelected
                  ? 'bg-gold-500 text-white border-gold-600 shadow-md scale-105'
                  : 'bg-white text-charcoal/70 border-gold-200 hover:border-gold-400 hover:bg-gold-50/50'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{idx + 1}. {evt.title.split('&')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Spotlight Card for Selected Ceremony */}
      <div className="bg-white rounded-2xl border-2 border-gold-300/80 shadow-xl overflow-hidden flex flex-col lg:grid lg:grid-cols-12 relative">
        
        {/* Left Visual Banner (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#B8A389] via-[#9C8F79] to-[#7D6F5B] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-gold-200">
                Function {selectedEventIndex + 1} of {events.length}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-gold-100">
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-4 leading-tight">
              {currentEvent.title}
            </h3>

            {currentEvent.subtitle && (
              <p className="text-xs italic font-serif text-gold-100/90 mt-1">
                "{currentEvent.subtitle}"
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-200 shrink-0" />
              <span className="font-bold text-white text-sm">{currentEvent.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-200 shrink-0" />
              <span className="font-medium text-white/90">{currentEvent.time}</span>
            </div>
          </div>
        </div>

        {/* Right Details Panel (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#FFFDF9]">
          
          <div className="space-y-4">
            {/* Attire / Dress Code Box */}
            <div className="p-3.5 rounded-xl bg-gold-50 border border-gold-300">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-800 block">
                Recommended Attire / Dress Code
              </span>
              <p className="text-xs font-semibold text-charcoal mt-0.5">
                {currentEvent.dressCode}
              </p>
            </div>

            {/* Venue Details */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-rani-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-charcoal">{currentEvent.venueName}</h4>
                <p className="text-xs text-charcoal/60 mt-0.5">{currentEvent.venueAddress}</p>
              </div>
            </div>

            {/* Narrative Description */}
            <p className="text-xs text-charcoal/75 leading-relaxed font-light border-t border-gold-100 pt-3">
              {currentEvent.description}
            </p>
          </div>

          {/* Action Row & Function Navigation */}
          <div className="mt-6 pt-4 border-t border-gold-200 flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex gap-2">
              {currentEvent.mapUrl && (
                <a
                  href={currentEvent.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-white hover:bg-gold-50 border border-gold-300 rounded-lg text-gold-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-rani-600" />
                  Google Maps
                </a>
              )}
              <a
                href={createGoogleCalendarUrl(currentEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-charcoal hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-gold-300" />
                Add to Calendar
              </a>
            </div>

            {/* Prev / Next Function Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg border border-gold-300 hover:bg-gold-50 text-gold-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Previous Function"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev Function</span>
              </button>

              <button
                onClick={handleNext}
                className="py-2 px-3 rounded-lg bg-gold-gradient hover:opacity-95 text-white transition-colors flex items-center gap-1 text-xs font-semibold shadow-sm"
                title="Next Function"
              >
                <span className="hidden sm:inline">Next Function</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
