import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, Menu, X, ChevronLeft, ChevronRight, ChevronDown, Sparkles, LogOut, UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar({
  currentPage,
  onNavigate,
  isPlayingMusic,
  onToggleMusic,
  onNextPage,
  onPrevPage,
  pageList = [],
  weddingInfo,
  verifiedParty,
  onSignOut
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const currentIndex = pageList.findIndex(p => p.id === currentPage);
  const displayIndex = currentIndex >= 0 ? currentIndex + 1 : 1;
  const coupleTitle = weddingInfo?.coupleTitle || "Chandrika & Xudong";

  // Core tabs for top navbar
  const primaryPageIds = ['cover', 'cinematic', 'welcome', 'story', 'ceremonies', 'rsvp'];
  const primaryPages = pageList.filter(p => primaryPageIds.includes(p.id));
  const morePages = pageList.filter(p => !primaryPageIds.includes(p.id));
  const activeMorePage = morePages.find(p => p.id === currentPage);
  const isMoreActive = Boolean(activeMorePage);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-gold-300/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Brand / Monogram */}
          <button
            onClick={() => onNavigate('cover')}
            className="flex items-center gap-2 group text-left shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gold-500/80 flex items-center justify-center bg-gold-50 group-hover:bg-gold-100 transition-colors shrink-0">
              <span className="font-serif font-bold text-xs sm:text-sm text-gold-800 tracking-tighter">C&amp;X</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-charcoal group-hover:text-gold-700 transition-colors leading-tight truncate max-w-[130px] sm:max-w-[190px]">
                {coupleTitle}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest uppercase text-gold-700 font-semibold">
                Udaipur • Nov 28, 2026
              </span>
            </div>
          </button>

          {/* Desktop Nav: Core Buttons + Dropdown for Remaining */}
          <nav className="hidden lg:flex items-center space-x-1 shrink-0">
            {primaryPages.map((page) => {
              const isActive = page.id === currentPage;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onNavigate(page.id);
                  }}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gold-500 text-white shadow-sm font-bold'
                      : 'text-charcoal/75 hover:text-gold-800 hover:bg-gold-50'
                  }`}
                >
                  {page.label}
                </button>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
                  isMoreActive
                    ? 'bg-gold-500 text-white shadow-sm font-bold'
                    : 'text-charcoal/75 hover:text-gold-800 hover:bg-gold-50'
                }`}
              >
                <span>{isMoreActive ? activeMorePage.label : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <>
                  {/* Backdrop to close on click outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />

                  {/* Dropdown Card */}
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white/98 backdrop-blur-xl border border-gold-300 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-gold-800 uppercase tracking-wider border-b border-gold-100 flex items-center justify-between">
                      <span>Celebrations</span>
                      <span className="text-[9px] font-normal text-charcoal/50">Select page</span>
                    </div>
                    {morePages.map((page) => {
                      const isActive = page.id === currentPage;
                      return (
                        <button
                          key={page.id}
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onNavigate(page.id);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                            isActive
                              ? 'bg-gold-500 text-white font-bold shadow-sm'
                              : 'text-charcoal hover:bg-gold-50'
                          }`}
                        >
                          <span>{page.label}</span>
                          <span className={`text-[10px] font-normal ${isActive ? 'text-white/80' : 'text-charcoal/40'}`}>
                            {page.name ? page.name.split(' ')[0] : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Controls: Stepper, Music, Guest Badge, Sign Out, Mobile Drawer */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Slide / Page Stepper Indicator */}
            <div className="hidden xl:flex items-center gap-1 bg-[#F5EFEB] px-2 py-1 rounded-lg border border-gold-300/70 text-xs font-bold text-charcoal shrink-0">
              <button
                onClick={onPrevPage}
                disabled={currentIndex <= 0}
                className="p-0.5 hover:text-gold-800 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                title="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono tracking-wider text-gold-900 px-0.5">
                {String(displayIndex).padStart(2, '0')}/{String(pageList.length).padStart(2, '0')}
              </span>
              <button
                onClick={onNextPage}
                disabled={currentIndex >= pageList.length - 1}
                className="p-0.5 hover:text-gold-800 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                title="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ambient Wedding Music Toggle */}
            <button
              onClick={onToggleMusic}
              title={isPlayingMusic ? "Mute Background Music" : "Play Wedding Sitar & Flute"}
              className="p-1.5 sm:p-2 rounded-lg border border-gold-400 bg-gold-50 hover:bg-gold-100 text-gold-800 transition-all flex items-center gap-1 text-xs shrink-0"
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-rani-600 animate-pulse" />
                  <span className="hidden 2xl:inline text-[10px] uppercase font-bold tracking-wider">Music On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-charcoal/60" />
                  <span className="hidden 2xl:inline text-[10px] uppercase font-bold tracking-wider text-charcoal/60">Music</span>
                </>
              )}
            </button>

            {/* Authenticated Guest Badge OR Unauthenticated Quick RSVP Button */}
            {verifiedParty ? (
              <div className="hidden md:flex flex-col text-right shrink-0 px-2.5 py-1 rounded-lg bg-gold-50/80 border border-gold-200">
                <span className="text-[11px] font-bold text-gold-900 leading-tight truncate max-w-[100px] lg:max-w-[130px]">
                  🌸 {verifiedParty.familyName}
                </span>
                <span className="text-[8px] text-charcoal/60 uppercase tracking-wider font-semibold">
                  {verifiedParty.rsvpStatus === 'ATTENDING' ? 'Confirmed' : 'Verified'}
                </span>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('rsvp')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gold-gradient hover:opacity-95 shadow-sm transition-all uppercase tracking-wider shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RSVP</span>
              </button>
            )}

            {/* Dedicated Sign Out Button */}
            {verifiedParty && onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out of Wedding Portal"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-xs shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Sign Out</span>
              </button>
            )}

            {/* Mobile / Tablet Hamburger Drawer */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-charcoal hover:text-gold-700 transition-colors shrink-0"
              title="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gold-300 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-fade-in">
          {verifiedParty ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gold-50 border border-gold-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gold-700" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gold-900">{verifiedParty.familyName}</span>
                  <span className="text-[10px] text-charcoal/60">{verifiedParty.primaryEmail}</span>
                </div>
              </div>
              {onSignOut && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onSignOut(); }}
                  className="px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-gold-200">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-stone-800">Visiting Guest</span>
                <span className="text-[10px] text-stone-500">Private 100-Guest RSVP</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('rsvp');
                }}
                className="px-3 py-1 text-xs font-bold text-white bg-gold-gradient rounded-lg shadow-sm"
              >
                RSVP Now
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pb-2 border-b border-gold-100 text-xs font-bold text-charcoal/70">
            <span>SELECT CELEBRATION</span>
            <span className="font-mono text-gold-800">{displayIndex} of {pageList.length}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {pageList.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => {
                  onNavigate(page.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                  page.id === currentPage
                    ? 'bg-gold-500 text-white font-bold shadow-sm'
                    : 'bg-gold-50/50 hover:bg-gold-100 text-charcoal'
                }`}
              >
                <span>{page.label}</span>
                <span className="text-[10px] opacity-70">#{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
