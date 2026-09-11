import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import BufferLoader from './components/BufferLoader';
import HeroPostcard from './components/HeroPostcard';
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
    { id: 'welcome', label: 'Welcome 3D', name: '3D Wedding Rings & Welcome' },
    { id: 'countdown', label: 'Countdown', name: 'Auspicious Muhurat' },
    { id: 'story', label: 'Our Story', name: 'Love Story & Milestones' },
    { id: 'traditions', label: 'Traditions', name: 'Cultural Traditions & Etiquette' },
    { id: 'ceremonies', label: 'Ceremonies', name: 'Wedding Functions' },
    { id: 'rsvp', label: 'RSVP', name: 'Private 100-Guest RSVP' },
    { id: 'pass', label: 'Wedding Pass', name: 'Digital Pass & QR' },
    { id: 'wishes', label: 'Wishes Wall', name: 'Guest Blessings' },
    { id: 'travel', label: 'Travel & Stay', name: 'Logistics & Hotels' },
    { id: 'gallery', label: 'Gallery', name: 'Photo Album' },
  ];

  const currentIndex = pageList.findIndex(p => p.id === currentPage);

  // Initial load: verify active session & load wedding metadata
  useEffect(() => {
    async function loadInitial() {
      // Validate session with backend if auth token exists
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

      // Dismiss initial buffer loader after brief royal intro
      setTimeout(() => {
        setIsBufferLoading(false);
      }, 600);
    }
    loadInitial();
  }, [handleUpdateVerifiedParty]);

  const navStartTimeRef = React.useRef(Date.now());

  // 3D Model Readiness Handler (Keeps buffering active until ThreeScene is compiled and ready to bloom)
  const handle3DSceneReady = useCallback(() => {
    // Keep loader on screen for at least 850ms total from click so user experiences smooth royal buffer
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
    
    // 1. Immediately activate loading screen for instant visual feedback
    setIsBufferLoading(true);
    navStartTimeRef.current = Date.now();

    if (targetPageId === 'welcome') {
      // Yield to browser layout/paint so the loading screen appears INSTANTLY on click
      // before mounting the heavy ThreeScene component in background
      setTimeout(() => {
        setCurrentPage('welcome');
        window.scrollTo(0, 0);
      }, 90);

      // Safeguard timeout (5s) to guarantee page opens even on low-end devices
      const fallbackTimer = setTimeout(() => {
        setIsBufferLoading(false);
      }, 5000);
      return () => clearTimeout(fallbackTimer);
    }

    // Regular pages: keep loading screen visible while page mounts, then smoothly dismiss
    setTimeout(() => {
      setCurrentPage(targetPageId);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setIsBufferLoading(false);
      }, 250);
    }, 400);
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

  // Keyboard navigation support (ArrowRight / ArrowLeft)
  useEffect(() => {
    if (!verifiedParty) return; // Only enable keyboard navigation when authenticated

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [verifiedParty, handleNextPage, handlePrevPage]);

  // =========================================================================
  // GATEKEEPER: If user is not authenticated, show the royal Invitation screen
  // =========================================================================
  if (!verifiedParty) {
    return (
      <div className="h-screen w-screen overflow-y-auto bg-[#FAF7F2] text-[#23201E]">
        <InvitationAuthPage
          initialToken={initialInviteToken}
          onAuthenticated={(party) => {
            handleUpdateVerifiedParty(party);
            navigateToPage('cover');
          }}
        />
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED GUEST: Full access to the royal wedding website
  // =========================================================================
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDFBF7] text-[#23201E] flex flex-col selection:bg-gold-500 selection:text-white relative">
      
      {/* Royal Buffer Loader Modal */}
      <BufferLoader pageName={bufferPageName} isVisible={isBufferLoading} />

      {/* Procedural Web Audio Player */}
      <AudioPlayer isPlaying={isPlayingMusic} onToggle={() => setIsPlayingMusic(!isPlayingMusic)} />

      {/* Sticky Top Navbar with Page Controls */}
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

      {/* Viewport-Fitted Slide Container */}
      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-4.5rem)] relative scroll-smooth">
        
        {currentPage === 'cover' && (
          <HeroPostcard
            weddingInfo={weddingInfo}
            onOpenRsvp={() => navigateToPage('rsvp')}
            onOpenPass={() => navigateToPage('pass')}
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
          <div className="flex flex-col justify-center min-h-[calc(100vh-6rem)]">
            <Countdown targetDate={weddingInfo?.targetCountdownDate || "2026-11-28T18:00:00"} />
            <div className="text-center mt-6">
              <button
                onClick={() => navigateToPage('story')}
                className="px-6 py-2.5 bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
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

      {/* Floating Bottom Navigation Controls */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2">
        {currentIndex > 0 && (
          <button
            onClick={handlePrevPage}
            className="px-3.5 py-2.5 bg-white/90 hover:bg-white text-charcoal border border-gold-300 rounded-xl shadow-lg backdrop-blur-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-all hover:scale-105"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4 text-gold-700" />
            <span className="hidden sm:inline">Prev</span>
          </button>
        )}

        {currentIndex < pageList.length - 1 ? (
          <button
            onClick={handleNextPage}
            className="px-4 sm:px-5 py-2.5 bg-gold-gradient hover:opacity-95 text-white rounded-xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105"
            title="Next Page (Right Arrow)"
          >
            <span>Next: {pageList[currentIndex + 1].label}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigateToPage('cover')}
            className="px-4 py-2.5 bg-charcoal hover:bg-black text-white rounded-xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>Back to Cover</span>
          </button>
        )}
      </div>

      {/* Slide Dots Indicator (Bottom Center) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-gold-200/80 shadow-sm">
        {pageList.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => navigateToPage(p.id)}
            title={p.name}
            className={`transition-all rounded-full ${
              idx === currentIndex
                ? 'w-6 h-2 bg-gold-500'
                : 'w-2 h-2 bg-gold-200 hover:bg-gold-400'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
