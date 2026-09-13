import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import BufferLoader from './components/BufferLoader';
import HeroPostcard from './components/HeroPostcard';
import CinematicCoverPage from './components/CinematicCoverPage';
import Welcome3DPage from './components/Welcome3DPage';
import Countdown from './components/Countdown';
import CoupleStory from './components/CoupleStory';
import EventsTimeline from './components/EventsTimeline';
import TraditionsGuidePage from './components/TraditionsGuidePage';
import VerifiedRsvpPage from './components/VerifiedRsvpPage';
import DigitalPassPage from './components/DigitalPassPage';
import WishesWall from './components/WishesWall';
import TravelAccommodation from './components/TravelAccommodation';
import Gallery from './components/Gallery';
import AudioPlayer from './components/AudioPlayer';
import InvitationAuthPage from './components/InvitationAuthPage';
import { WeddingService } from './services/api';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

export default function App() {
  const [weddingInfo, setWeddingInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [currentPage, setCurrentPage] = useState('cover');
  const [isBufferLoading, setIsBufferLoading] = useState(true);
  const [bufferPageName, setBufferPageName] = useState('Royal Wedding Portal');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Extract invitation token from URL path (/invite/:token) or search params (?token=... or ?invite=...)
  const [initialInviteToken] = useState(() => {
    try {
      const path = window.location.pathname;
      if (path.startsWith('/invite/')) {
        return path.replace('/invite/', '').trim();
      }
      const params = new URLSearchParams(window.location.search);
      return params.get('token') || params.get('invite') || '';
    } catch (e) {
      return '';
    }
  });
  
  // 100-Guest Invitation Authentication & Session State
  const [verifiedParty, setVerifiedParty] = useState(() => {
    try {
      const saved = sessionStorage.getItem('didi_wedding_verified_party');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleUpdateVerifiedParty = useCallback((party) => {
    setVerifiedParty(party);
    try {
      if (party) {
        sessionStorage.setItem('didi_wedding_verified_party', JSON.stringify(party));
      } else {
        sessionStorage.removeItem('didi_wedding_verified_party');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSignOut = useCallback(() => {
    WeddingService.clearAuthToken();
    handleUpdateVerifiedParty(null);
    setCurrentPage('cover');
  }, [handleUpdateVerifiedParty]);

  const pageList = [
    { id: 'cover', label: 'Cover', name: 'Invitation Postcard' },
    { id: 'cinematic', label: 'Photo', name: 'Cinematic Wedding Cover' },
    { id: 'welcome', label: 'Welcome', name: '3D Wedding Rings & Welcome' },
    { id: 'story', label: 'Stories', name: 'Love Story & Milestones' },
    { id: 'ceremonies', label: 'Events', name: 'Wedding Functions' },
    { id: 'rsvp', label: 'RSVP', name: 'Private 100-Guest RSVP' },
    { id: 'traditions', label: 'Traditions', name: 'Cultural Traditions & Etiquette' },
    { id: 'travel', label: 'Hotels', name: 'Logistics & Hotels' },
    { id: 'wishes', label: 'Wishes', name: 'Guest Blessings Wall' },
    { id: 'gallery', label: 'Gallery', name: 'Photo Album' },
    { id: 'pass', label: 'Pass', name: 'VIP Digital Pass & QR' },
    { id: 'countdown', label: 'Countdown', name: 'Auspicious Muhurat' },
  ];

  const currentIndex = pageList.findIndex(p => p.id === currentPage);

  // Initial load: verify active session & load wedding metadata
  useEffect(() => {
    async function loadInitial() {
      const sessionUser = await WeddingService.getCurrentUser();
      if (sessionUser) {
        handleUpdateVerifiedParty(sessionUser);
      }

      const [info, evts, wshs] = await Promise.all([
        WeddingService.getWeddingInfo(),
        WeddingService.getEvents(),
        WeddingService.getWishes()
      ]);
      setWeddingInfo(info);
      setEvents(evts);
      setWishes(wshs);

      setTimeout(() => {
        setIsBufferLoading(false);
      }, 600);
    }
    loadInitial();
  }, [handleUpdateVerifiedParty]);

  const navStartTimeRef = React.useRef(Date.now());

  // 3D Model Readiness Handler
  const handle3DSceneReady = useCallback(() => {
    const elapsed = Date.now() - navStartTimeRef.current;
    const remaining = Math.max(350, 850 - elapsed);
    setTimeout(() => {
      setIsBufferLoading(false);
    }, remaining);
  }, []);

  // Smooth Page Navigation with Buffer Loader
  const navigateToPage = useCallback((targetPageId) => {
    if (targetPageId === currentPage) return;

    const targetPage = pageList.find(p => p.id === targetPageId);
    setBufferPageName(targetPage ? targetPage.name : 'Wedding Celebrations');
    
    setIsBufferLoading(true);
    navStartTimeRef.current = Date.now();

    if (targetPageId === 'welcome') {
      setTimeout(() => {
        setCurrentPage('welcome');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 90);

      const fallbackTimer = setTimeout(() => {
        setIsBufferLoading(false);
      }, 5000);
      return () => clearTimeout(fallbackTimer);
    }

    setTimeout(() => {
      setCurrentPage(targetPageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setIsBufferLoading(false);
      }, 250);
    }, 350);
  }, [currentPage, pageList]);

  const handleNextPage = useCallback(() => {
    if (currentIndex < pageList.length - 1) {
      navigateToPage(pageList[currentIndex + 1].id);
    }
  }, [currentIndex, pageList, navigateToPage]);

  const handlePrevPage = useCallback(() => {
    if (currentIndex > 0) {
      navigateToPage(pageList[currentIndex - 1].id);
    }
  }, [currentIndex, pageList, navigateToPage]);

  // Keyboard navigation support for desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  return (
    <div className="min-h-[100dvh] w-full bg-[#FDFBF7] text-[#23201E] flex flex-col selection:bg-gold-500 selection:text-white relative">
      
      {/* Royal Buffer Loader Modal */}
      <BufferLoader pageName={bufferPageName} isVisible={isBufferLoading} />

      {/* Procedural Web Audio Player */}
      <AudioPlayer isPlaying={isPlayingMusic} onToggle={() => setIsPlayingMusic(!isPlayingMusic)} />

      {/* Sticky Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateToPage}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={() => setIsPlayingMusic(!isPlayingMusic)}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        pageList={pageList}
        weddingInfo={weddingInfo}
        verifiedParty={verifiedParty}
        onSignOut={handleSignOut}
      />

      {/* Mobile-Friendly Main Content Area (with safe bottom padding for MobileBottomNav) */}
      <main className="flex-1 w-full overflow-y-auto pb-24 sm:pb-28 lg:pb-12 relative scroll-smooth">
        
        {currentPage === 'cover' && (
          <HeroPostcard
            weddingInfo={weddingInfo}
            onOpenRsvp={() => navigateToPage('rsvp')}
            onOpenPass={() => navigateToPage('pass')}
            onNavigate={navigateToPage}
          />
        )}

        {currentPage === 'cinematic' && (
          <CinematicCoverPage
            weddingInfo={weddingInfo}
            onNavigate={navigateToPage}
          />
        )}

        {currentPage === 'welcome' && (
          <Welcome3DPage
            onNavigate={navigateToPage}
            weddingInfo={weddingInfo}
            onReady={handle3DSceneReady}
            isBuffering={isBufferLoading}
          />
        )}

        {currentPage === 'countdown' && (
          <div className="flex flex-col justify-center min-h-[calc(100dvh-10rem)] px-4">
            <Countdown targetDate={weddingInfo?.targetCountdownDate || "2026-11-28T18:00:00"} />
            <div className="text-center mt-6">
              <button
                onClick={() => navigateToPage('story')}
                className="px-6 py-3 bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Discover Our Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentPage === 'story' && (
          <CoupleStory onNavigate={navigateToPage} />
        )}

        {currentPage === 'traditions' && (
          <TraditionsGuidePage onNavigate={navigateToPage} />
        )}

        {currentPage === 'ceremonies' && (
          <EventsTimeline events={events} />
        )}

        {currentPage === 'rsvp' && (
          !verifiedParty ? (
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full bg-gold-100 text-gold-900 border border-gold-300 text-xs font-bold uppercase tracking-wider">
                  🔒 Strictly Private 100-Guest RSVP
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                  Verify Invitation to RSVP
                </h2>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  Please enter your invitation passcode (e.g. CX2026) or registered family email to unlock attendance confirmation and VIP pass.
                </p>
              </div>
              <InvitationAuthPage
                initialToken={initialInviteToken}
                onAuthenticated={(party) => {
                  handleUpdateVerifiedParty(party);
                  navigateToPage('rsvp');
                }}
              />
            </div>
          ) : (
            <VerifiedRsvpPage
              verifiedParty={verifiedParty}
              setVerifiedParty={handleUpdateVerifiedParty}
              onRsvpSubmitted={(party) => {
                handleUpdateVerifiedParty(party);
              }}
              onViewPass={(party) => {
                handleUpdateVerifiedParty(party);
                navigateToPage('pass');
              }}
              onNavigate={navigateToPage}
            />
          )
        )}

        {currentPage === 'pass' && (
          <DigitalPassPage
            verifiedParty={verifiedParty}
            weddingInfo={weddingInfo}
            onNavigate={navigateToPage}
          />
        )}

        {currentPage === 'wishes' && (
          <WishesWall initialWishes={wishes} />
        )}

        {currentPage === 'travel' && (
          <TravelAccommodation weddingInfo={weddingInfo} />
        )}

        {currentPage === 'gallery' && (
          <Gallery />
        )}

      </main>

      {/* Mobile-Centric Bottom Navigation Dock (Phones & Tablets < 1024px) */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={navigateToPage}
        pageList={pageList}
      />

      {/* Desktop-Only Slide Stepper Controls (Screens >= 1024px) */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-30 items-center gap-2">
        {currentIndex > 0 && (
          <button
            onClick={handlePrevPage}
            className="px-3.5 py-2.5 bg-white/90 hover:bg-white text-charcoal border border-gold-300 rounded-xl shadow-lg backdrop-blur-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-all hover:scale-105"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4 text-gold-700" />
            <span>Prev</span>
          </button>
        )}

        {currentIndex < pageList.length - 1 ? (
          <button
            onClick={handleNextPage}
            className="px-5 py-2.5 bg-gold-gradient hover:opacity-95 text-white rounded-xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105"
            title="Next Page (Right Arrow)"
          >
            <span>Next: {pageList[currentIndex + 1].label}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigateToPage('cover')}
            className="px-4 py-2.5 bg-charcoal hover:bg-black text-white rounded-xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all hover:scale-105"
            title="Back to Beginning"
          >
            <span>Back to Cover</span>
          </button>
        )}
      </div>

    </div>
  );
}
