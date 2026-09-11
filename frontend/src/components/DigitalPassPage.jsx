import React, { useEffect, useState } from 'react';
import { QrCode, Printer, MapPin, Calendar, Users, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import QRCode from 'qrcode';

export default function DigitalPassPage({ verifiedParty, weddingInfo, onNavigate }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  const isVerified = verifiedParty && verifiedParty.isVerified;
  const familyName = verifiedParty?.familyName || "Distinguished Family";
  const guestCount = verifiedParty?.confirmedHeadcount || verifiedParty?.allowedPartySize || 2;
  const passSerial = verifiedParty?.passSerial || "CX-VIP-101";
  const table = verifiedParty?.assignedTable || "Table 1 - Royal Lotus";
  const members = verifiedParty?.attendingMembers || "Registered Family Members";
  const venue = weddingInfo?.mainVenue || "The Oberoi Udaivilas, Udaipur";
  const dates = weddingInfo?.weddingDatesRange || "November 26 – 28, 2026";

  useEffect(() => {
    const qrContent = JSON.stringify({
      passSerial: passSerial,
      party: familyName,
      headcount: guestCount,
      table: table,
      wedding: "Chandrika & Xudong Shubh Vivah 2026",
      status: "VIP VERIFIED ENTRY (100-GUEST LIST)"
    });

    QRCode.toDataURL(qrContent, {
      width: 170,
      margin: 1,
      color: {
        dark: '#23201E',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [familyName, passSerial, guestCount, table]);

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center items-center min-h-[calc(100vh-6rem)]">
      
      {!isVerified ? (
        /* Not verified warning card */
        <div className="w-full bg-white rounded-2xl border-2 border-gold-300 p-6 sm:p-8 text-center shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold-100 border border-gold-300 mx-auto flex items-center justify-center text-gold-800">
            <ShieldAlert className="w-7 h-7 text-rani-600" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-gold-700">Strictly Private 100-Guest Event</span>
            <h3 className="text-2xl font-serif font-bold text-charcoal mt-1">
              Verified Invitation Required
            </h3>
            <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
              To preserve an intimate experience for 100 guests, entrance passes are exclusive to verified invitees. Please verify your family's email to unlock your official pass and table assignment.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('rsvp')}
              className="px-6 py-2.5 bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Family Email & Get Pass</span>
            </button>
          </div>
        </div>
      ) : (
        /* VERIFIED PASS CARD */
        <div className="w-full bg-[#FFFDF9] rounded-2xl shadow-2xl border-2 border-gold-400 overflow-hidden text-charcoal">
          
          {/* Top Gold Header */}
          <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 px-6 py-3.5 text-center text-white relative">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gold-100">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100-Guest Verified</span>
              <span className="font-mono">{passSerial}</span>
            </div>
            <h2 className="text-xl font-serif font-bold tracking-wide mt-0.5">Chandrika & Xudong</h2>
            <p className="text-[11px] text-gold-100 font-light">Shubh Vivah Mahotsav • Udaipur</p>
          </div>

          {/* Ticket Body */}
          <div className="p-5 sm:p-7 space-y-3.5">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-widest text-gold-700 font-bold">Family Admission Pass</span>
              <h3 className="text-2xl font-serif font-bold text-charcoal mt-0.5">{familyName}</h3>
              <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-gold-100 text-gold-900 border border-gold-300">
                <Users className="w-3.5 h-3.5 text-gold-700" />
                Admit: {guestCount} Family Member(s)
              </span>
            </div>

            {/* Assigned Table & Members */}
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gold-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal/60 text-[10px] uppercase font-bold">Assigned Seating:</span>
                <span className="font-bold text-gold-900">{table}</span>
              </div>
              <div className="pt-1.5 border-t border-gold-200/60">
                <span className="text-charcoal/60 text-[10px] uppercase font-bold block mb-0.5">Registered Attendees:</span>
                <span className="font-medium text-charcoal leading-tight block text-[11px]">{members}</span>
              </div>
            </div>

            {/* Venue & Dates */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-charcoal/80 bg-white p-2.5 rounded-lg border border-gold-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                <span>{dates}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rani-600 shrink-0" />
                <span className="truncate">The Oberoi Udaivilas</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-dashed border-gold-400">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Wedding Pass QR" className="w-32 h-32 rounded-lg shadow-sm" />
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-xs text-charcoal/50">
                  Generating QR...
                </div>
              )}
              <span className="mt-1 text-[11px] font-mono tracking-widest text-gold-900 font-bold">
                PASS: {passSerial}
              </span>
              <p className="text-[10px] text-charcoal/60 mt-0.5">Scan this QR pass at the hospitality welcome gate</p>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 bg-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-gold-300" />
                Print / Save Pass
              </button>
              <button
                onClick={() => onNavigate('traditions')}
                className="py-2.5 px-4 border border-gold-400 hover:bg-gold-50 text-gold-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1"
              >
                <span>Traditions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
