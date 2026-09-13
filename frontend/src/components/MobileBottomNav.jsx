import React, { useState } from 'react';
import { Mail, Camera, Flower2, Calendar, CheckSquare, MoreHorizontal, X, Heart, Sparkles, MapPin, MessageSquare, Image, QrCode, Clock } from 'lucide-react';

export default function MobileBottomNav({ currentPage, onNavigate, pageList = [] }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  // 5 primary thumb buttons
  const navItems = [
    { id: 'cover', label: 'Cover', icon: Mail },
    { id: 'cinematic', label: 'Photo', icon: Camera },
    { id: 'welcome', label: 'Welcome', icon: Flower2 },
    { id: 'ceremonies', label: 'Events', icon: Calendar },
    { id: 'rsvp', label: 'RSVP', icon: CheckSquare, isRsvp: true },
  ];

  // Secondary items shown in the "More" bottom sheet
  const moreItems = [
    { id: 'story', label: 'Our Story', subtitle: 'Milestones & Journey', icon: Heart },
    { id: 'traditions', label: 'Traditions', subtitle: 'Cultural Etiquette', icon: Sparkles },
    { id: 'travel', label: 'Hotels & Stay', subtitle: 'Udaipur Accommodations', icon: MapPin },
    { id: 'wishes', label: 'Wishes Wall', subtitle: 'Guest Blessings', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', subtitle: 'Photo Album', icon: Image },
    { id: 'pass', label: 'Digital Pass', subtitle: 'VIP QR Pass', icon: QrCode },
    { id: 'countdown', label: 'Countdown', subtitle: 'Auspicious Muhurat', icon: Clock },
  ];

  const handleNav = (pageId) => {
    onNavigate(pageId);
    setSheetOpen(false);
  };

  const isMoreActive = moreItems.some(item => item.id === currentPage);

  return (
    <>
      {/* Mobile Bottom Navigation Dock */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-xl border-t border-gold-300/70 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            if (item.isRsvp) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-gold-gradient text-white shadow-md font-bold scale-105'
                      : 'bg-gold-500/15 hover:bg-gold-500/25 text-gold-900 border border-gold-400/60 font-semibold'
                  }`}
                  style={{ minWidth: '56px', minHeight: '44px' }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gold-800'}`} />
                  <span className="text-[10px] uppercase tracking-wider mt-0.5 leading-none">
                    RSVP
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 relative ${
                  isActive
                    ? 'text-gold-700 font-bold scale-105'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                style={{ minWidth: '48px', minHeight: '44px' }}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-gold-600 stroke-[2.5]' : 'text-stone-500'}`} />
                <span className={`text-[10px] tracking-tight mt-0.5 leading-none ${isActive ? 'text-gold-900 font-bold' : 'text-stone-600'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gold-600" />
                )}
              </button>
            );
          })}

          {/* "More" Trigger */}
          <button
            onClick={() => setSheetOpen(!sheetOpen)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
              isMoreActive || sheetOpen
                ? 'text-gold-700 font-bold scale-105'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            style={{ minWidth: '48px', minHeight: '44px' }}
          >
            <MoreHorizontal className={`w-4 h-4 ${isMoreActive || sheetOpen ? 'text-gold-600 stroke-[2.5]' : 'text-stone-500'}`} />
            <span className={`text-[10px] tracking-tight mt-0.5 leading-none ${isMoreActive || sheetOpen ? 'text-gold-900 font-bold' : 'text-stone-600'}`}>
              More
            </span>
          </button>

        </div>
      </nav>

      {/* "More" Bottom Sheet Drawer */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet Container */}
          <div className="relative bg-[#FFFDF9] border-t-2 border-gold-400 rounded-t-3xl shadow-2xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[80vh] overflow-y-auto">
            
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gold-200">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gold-700">Royal Celebrations</span>
                <h4 className="text-lg font-serif font-bold text-stone-900">Explore Wedding Details</h4>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of secondary items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 active:scale-98 ${
                      isActive
                        ? 'bg-gold-500 text-white border-gold-600 shadow-md'
                        : 'bg-white text-stone-800 border-gold-200/80 hover:bg-gold-50/50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gold-50 text-gold-700 border border-gold-300/50'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className={`text-[10px] block font-light ${isActive ? 'text-white/80' : 'text-stone-500'}`}>
                        {item.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Couple Title in Sheet */}
            <div className="pt-4 text-center text-[11px] text-stone-400 font-serif border-t border-gold-100 mt-4">
              Chandrika &amp; Xudong • Udaipur, November 28, 2026
            </div>

          </div>

        </div>
      )}
    </>
  );
}
