import React, { useState } from 'react';
import { Plane, Train, Hotel, Phone, Mail, MapPin } from 'lucide-react';

export default function TravelAccommodation({ weddingInfo }) {
  const [selectedHotelIndex, setSelectedHotelIndex] = useState(0);

  const hotels = [
    {
      name: "The Oberoi Udaivilas",
      category: "Primary Wedding Venue & Host Stay",
      location: "Haridas Ji Ki Magri, Mulla Talai, Udaipur",
      tag: "Wedding Venue",
      bookingNote: "Special wedding rate reserved for core family and ceremony guests.",
      mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
    },
    {
      name: "Trident Hotel Udaipur",
      category: "Partner Luxury Hotel (Adjacent to Udaivilas)",
      location: "Haridas Ji Ki Magri, Udaipur",
      tag: "Wedding Block Code: DIDIWED26",
      bookingNote: "Complimentary royal golf cart and shuttle service between Trident & Udaivilas.",
      mapUrl: "https://maps.google.com/?q=Trident+Udaipur"
    },
    {
      name: "Radisson Blu Udaipur Palace Resort",
      category: "Lake Facing Boutique Stay",
      location: "Near Fateh Sagar Lake, Udaipur",
      tag: "Wedding Block Code: DIDIWED26",
      bookingNote: "10 mins scenic lake-side drive to the main wedding venue.",
      mapUrl: "https://maps.google.com/?q=Radisson+Blu+Udaipur"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      <div className="text-center max-w-xl mx-auto mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
          <Plane className="w-3 h-3 text-gold-700" />
          Guest Logistics & Stay
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-1">
          Travel & Accommodations
        </h2>
      </div>

      {/* Transit Quick Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gold-300 p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-800 shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-charcoal">Air: Maharana Pratap Airport (UDR)</h4>
            <p className="text-[11px] text-charcoal/70">~40 min drive to Udaivilas. Shuttles provided on Nov 26 & 27.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gold-300 p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-800 shrink-0">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-charcoal">Train: Udaipur City Station (UDZ)</h4>
            <p className="text-[11px] text-charcoal/70">~15 min drive to venue resorts. Station pickup on prior intimation.</p>
          </div>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {hotels.map((hotel, idx) => (
          <div
            key={hotel.name}
            className="bg-white rounded-xl border-2 border-gold-200 p-4 shadow-sm flex flex-col justify-between hover:border-gold-400 transition-colors"
          >
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-rani-600 block">
                {hotel.category}
              </span>
              <h4 className="font-serif font-bold text-base text-charcoal mt-0.5">{hotel.name}</h4>
              
              <div className="mt-2 p-1.5 bg-gold-50 rounded text-[10px] font-semibold text-gold-900 border border-gold-200">
                {hotel.tag}
              </div>

              <p className="text-[11px] text-charcoal/70 mt-2 leading-relaxed">
                {hotel.bookingNote}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-gold-100">
              <a
                href={hotel.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-3 rounded-lg border border-gold-300 hover:bg-gold-50 text-gold-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                View Map
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Hospitality Desk */}
      <div className="bg-[#FAF7F2] rounded-xl border border-gold-300 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div>
          <h4 className="text-sm font-serif font-bold text-charcoal">Family Hospitality Desk</h4>
          <p className="text-[11px] text-charcoal/70">Need assistance with airport pickup or early check-in?</p>
        </div>

        <div className="flex gap-2 text-xs">
          <a
            href="tel:+919876543210"
            className="px-3 py-1.5 bg-charcoal text-white rounded-lg font-semibold flex items-center gap-1.5"
          >
            <Phone className="w-3 h-3 text-gold-300" />
            +91 98765 43210
          </a>
          <a
            href="mailto:hospitality@didiwedding.in"
            className="px-3 py-1.5 border border-gold-400 text-gold-900 bg-white rounded-lg font-semibold flex items-center gap-1.5"
          >
            <Mail className="w-3 h-3 text-rani-600" />
            Email Helpdesk
          </a>
        </div>
      </div>

    </div>
  );
}
