import React, { useEffect, useState } from 'react';
import { X, QrCode, Printer, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

export default function DigitalInvitePass({ isOpen, onClose, guestRsvp, weddingInfo }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  const guestName = guestRsvp?.guestName || "Distinguished Guest";
  const guestCount = guestRsvp?.guestCount || 2;
  const eventCode = guestRsvp?.inviteCode || weddingInfo?.eventCode || "DIDI2026";
  const venue = weddingInfo?.mainVenue || "The Oberoi Udaivilas, Udaipur";
  const dates = weddingInfo?.weddingDatesRange || "November 26 – 28, 2026";

  useEffect(() => {
    if (!isOpen) return;

    const qrContent = JSON.stringify({
      guest: guestName,
      code: eventCode,
      headcount: guestCount,
      wedding: "Aditi & Rohan Shubh Vivah 2026",
      status: "VIP Confirmed"
    });

    QRCode.toDataURL(qrContent, {
      width: 180,
      margin: 1,
      color: {
        dark: '#23201E',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [isOpen, guestName, eventCode, guestCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl shadow-2xl border-2 border-gold-400 overflow-hidden text-charcoal">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-charcoal/60 hover:text-charcoal bg-white/80 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Gold Foil Ribbon */}
        <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 px-6 py-4 text-center text-white relative">
          <p className="text-[10px] tracking-widest uppercase font-bold text-gold-100">Royal Invitation Pass</p>
          <h2 className="text-xl font-serif font-bold tracking-wide mt-0.5">Aditi & Rohan</h2>
          <p className="text-[11px] text-gold-100 font-light mt-0.5">Shubh Vivah Mahotsav • Udaipur</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-gold-700 font-bold">Guest Admission</span>
            <h3 className="text-2xl font-serif font-bold text-charcoal mt-1">{guestName}</h3>
            <span className="inline-flex items-center gap-1 mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-gold-100 text-gold-800 border border-gold-300">
              <Users className="w-3 h-3 text-gold-700" />
              Admit: {guestCount} Guest(s)
            </span>
          </div>

          {/* Details Box */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold-200 space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-700 shrink-0" />
              <div>
                <span className="text-charcoal/60 block text-[10px] uppercase font-bold">Dates</span>
                <span className="font-semibold text-charcoal">{dates}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-gold-200/60">
              <MapPin className="w-4 h-4 text-rani-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-charcoal/60 block text-[10px] uppercase font-bold">Palace Venue</span>
                <span className="font-semibold text-charcoal">{venue}</span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-dashed border-gold-400">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Wedding Pass QR" className="w-36 h-36 rounded-lg shadow-sm" />
            ) : (
              <div className="w-36 h-36 bg-gray-100 flex items-center justify-center text-xs text-charcoal/50">
                Generating QR...
              </div>
            )}
            <span className="mt-2 text-[11px] font-mono tracking-widest text-gold-800 font-bold">
              PASSCODE: {eventCode}
            </span>
            <p className="text-[10px] text-charcoal/60 mt-1">Show this digital QR pass at the hospitality desk</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 bg-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-gold-300" />
              Print / Save Pass
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-5 border border-gold-400 hover:bg-gold-50 text-gold-800 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
