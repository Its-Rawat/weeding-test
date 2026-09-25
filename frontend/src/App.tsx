import React, { useEffect, useState } from "react";
import EnvelopeOpening from "./components/EnvelopeOpening";
import HeroSection from "./components/HeroSection";
import DestinationSection from "./components/DestinationSection";
import CoastalFrameSection from "./components/CoastalFrameSection";
import DressCodeSection from "./components/DressCodeSection";
import EventSection from "./components/EventSection";
import RSVPSection from "./components/RSVPSection";
import MusicToggle from "./components/MusicToggle";
import FloatingNav from "./components/FloatingNav";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";
import WeddingLoader from "./components/WeddingLoader";
import { useConfig } from "./hooks/useConfig";

const App: React.FC = () => {
  const { config, loading } = useConfig();
  const [isOpened, setIsOpened] = useState(false);
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  useEffect(() => {
    // Quick hand-off to immediate envelope presentation
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpened]);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const coupleNames = "Aditya & Ananya";

  if (loading || !minLoadingDone || !config) {
    return <WeddingLoader />;
  }

  return (
    <div className="relative min-h-screen bg-[#FAF6EE] text-[#2A2F2B] font-serif selection:bg-[#722F37]/20 selection:text-[#722F37] overflow-x-hidden">
      
      {/* Cinematic Organic Scalloped Envelope Opening */}
      {!isOpened && (
        <EnvelopeOpening
          onOpen={handleOpenInvitation}
          coupleNames={coupleNames}
        />
      )}

      {/* Floating Top Navigation */}
      {isOpened && (
        <FloatingNav
          onReopenEnvelope={() => {
            setIsOpened(false);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />
      )}

      {/* Main Luxury Stationery Flow */}
      <main className="relative z-10">
        <HeroSection coupleNames={coupleNames} />
        <DestinationSection />
        <CoastalFrameSection />
        <EventSection />
        <DressCodeSection />
        <RSVPSection />
      </main>

      <Footer coupleNames={coupleNames} />

      {/* Music Audio & Floating Toggle */}
      <MusicPlayer url={config?.music?.url || "https://www.bensound.com/bensound-music/bensound-forever.mp3"} />
      <MusicToggle />
    </div>
  );
};

export default App;
