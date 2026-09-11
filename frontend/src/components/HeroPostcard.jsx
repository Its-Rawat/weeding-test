import React from 'react';
import { Calendar, Heart, QrCode, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function HeroPostcard({ weddingInfo, onOpenRsvp, onOpenPass, onNavigate }) {
  const coupleTitle = weddingInfo?.coupleTitle || "Chandrika & Xudong's Wedding";
  const hostName = weddingInfo?.hostName || "The Rawat & Zhang Families";
  const weddingDate = weddingInfo?.weddingDate || "November 28, 2026";
  const eventCode = weddingInfo?.eventCode || "CX2026";
  const locationCity = weddingInfo?.locationCity || "Udaipur, Rajasthan, India";

  return (
    <div className="relative py-4 sm:py-6 px-4 max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      {/* Background Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-gold-200/40 via-rani-100/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Appy Couple Style Floating Postcard Card */}
      <div className="relative bg-[#FFFDF9] rounded-2xl shadow-postcard border border-gold-300/60 p-4 sm:p-7 md:p-8 transition-all duration-300">
        {/* Ornate Gold Filigree Corner Accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-500/70 pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-500/70 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-500/70 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-500/70 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT PANEL: Couple / Bridal Portrait Image (5 Cols) */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-xl shadow-md min-h-[300px] sm:min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80"
              alt="Chandrika & Xudong"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-black/20" />
            
            <div className="absolute top-3.5 left-3.5">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-semibold uppercase tracking-wider text-rani-900 border border-gold-300 shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-600" />
                #ChandrikaWedsXudong
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-gold-600/80 text-white mb-1">
                Private 100-Guest Celebration
              </span>
              <h3 className="text-2xl font-serif font-bold text-white tracking-wide">Chandrika & Xudong</h3>
              <p className="text-xs text-white/90 font-light mt-0.5">{locationCity}</p>
            </div>
          </div>

          {/* MIDDLE PANEL: Host & Invitation Title Card (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3.5">
            {/* Top segment */}
            <div
              onClick={() => onNavigate && onNavigate('welcome')}
              className="bg-[#B8A389] text-white p-5 sm:p-6 rounded-xl shadow-md flex-1 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:bg-[#A9947A] transition-colors"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl" />
              
              <div>
                <div className="flex items-center justify-between text-[11px] tracking-widest uppercase font-semibold text-gold-100">
                  <span>HOST</span>
                  <Sparkles className="w-3.5 h-3.5 text-gold-200" />
                </div>
                <p className="text-xs font-medium mt-0.5 text-white/95">{hostName}</p>
              </div>

              <div className="my-4 text-center">
                <p className="text-[11px] uppercase tracking-widest text-gold-100/90 mb-1">With Joyful Hearts Invite You To</p>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
                  {coupleTitle}
                </h1>
                <div className="w-16 h-0.5 bg-gold-200/60 mx-auto mt-2.5" />
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-medium text-gold-100">
                <span>Official Invitation</span>
                <span className="flex items-center gap-1 text-white font-semibold">
                  Enter Welcome 3D <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Bottom RSVP segment */}
            <button
              onClick={onOpenRsvp}
              className="group bg-[#9C8F79] hover:bg-[#8A7D67] text-white p-4 sm:p-5 rounded-xl shadow-md transition-all duration-300 text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gold-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-gold-200" /> EMAIL VERIFIED RSVP
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white mt-0.5 flex items-center gap-2">
                    Verify & RSVP
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-gold-200" />
                  </h4>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
                <span className="font-semibold text-gold-100">{weddingDate}</span>
                <span className="text-white/80">Confirm attendance</span>
              </div>
            </button>
          </div>

          {/* RIGHT PANEL: Postcard App Code & Digital Pass (3 Cols) */}
          <div className="lg:col-span-3 bg-[#FAF7F2] border border-gold-200/80 rounded-xl p-5 flex flex-col justify-between items-center text-center shadow-sm">
            
            {/* Wedding Monogram */}
            <div className="w-12 h-12 rounded-full border-2 border-gold-500/80 flex items-center justify-center bg-white shadow-sm mt-0.5">
              <span className="font-serif font-bold text-base text-gold-700">C&X</span>
            </div>

            <div className="my-3">
              <p className="text-[11px] uppercase tracking-wider text-charcoal/60 font-medium">Digital Passcode</p>
              <div className="mt-1 px-3 py-1 bg-white border border-dashed border-gold-400 rounded-lg shadow-inner">
                <span className="font-mono text-sm font-bold tracking-widest text-gold-800">{eventCode}</span>
              </div>
              <p className="text-[10px] text-charcoal/60 mt-1.5 leading-relaxed">
                Enter your family email to claim your VIP admission pass.
              </p>
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={onOpenPass}
                className="w-full py-2 px-3 bg-charcoal hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-gold-300" />
                View Wedding Pass
              </button>

              <button
                onClick={() => onNavigate && onNavigate('welcome')}
                className="w-full py-2 px-3 bg-gold-gradient text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-1"
              >
                <span>Enter Wedding Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
