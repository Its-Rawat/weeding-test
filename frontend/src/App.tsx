import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import CountdownSection from "./components/CountdownSection";
import DressCodePalette from "./components/DressCodePalette";
import VenueSection from "./components/VenueSection";
import CoupleProfile from "./components/CoupleProfile";
import EventDetails from "./components/EventDetails";
import Gallery from "./components/Gallery";
import LoveStory from "./components/LoveStory";
import RSVPForm from "./components/RSVPForm";
import Wishes from "./components/Wishes";
import GiftInfo from "./components/GiftInfo";
import MusicPlayer from "./components/MusicPlayer";
import Navbar from "./components/Navbar";
import FloatingPetals from "./components/FloatingPetals";
import VideoLanding from "./components/VideoLanding";
import InstallPrompt from "./components/InstallPrompt";
import WeddingLoader from "./components/WeddingLoader";
import { useConfig } from "./hooks/useConfig";
import { Heart, Quote, Mail } from "lucide-react";

const App: React.FC = () => {
  const { config, loading } = useConfig();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as "light" | "dark";
      if (saved === "dark") return "dark";
      return "light";
    }
    return "light";
  });

  const [bufferProgress, setBufferProgress] = useState(15);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  useEffect(() => {
    let videoReady = false;
    let windowReady = false;

    const checkComplete = () => {
      if (videoReady && (windowReady || document.readyState === "complete") && !loading && config) {
        setBufferProgress(100);
        setTimeout(() => {
          setIsFullyLoaded(true);
        }, 400);
      }
    };

    // 1. Buffer the full-screen video
    const testVideo = document.createElement("video");
    testVideo.src = "/wedding_invitation.mp4";
    testVideo.preload = "auto";
    testVideo.muted = true;

    if (testVideo.readyState >= 3) {
      videoReady = true;
      setBufferProgress((p) => Math.max(p, 75));
      checkComplete();
    } else {
      testVideo.onloadeddata = () => {
        setBufferProgress((p) => Math.max(p, 50));
      };
      testVideo.oncanplay = () => {
        videoReady = true;
        setBufferProgress((p) => Math.max(p, 80));
        checkComplete();
      };
      testVideo.oncanplaythrough = () => {
        videoReady = true;
        setBufferProgress((p) => Math.max(p, 95));
        checkComplete();
      };
      testVideo.onerror = () => {
        videoReady = true;
        checkComplete();
      };
    }

    // 2. Buffer window resources (images, fonts, stylesheets)
    if (document.readyState === "complete") {
      windowReady = true;
      setBufferProgress((p) => Math.max(p, 60));
      checkComplete();
    } else {
      window.addEventListener(
        "load",
        () => {
          windowReady = true;
          setBufferProgress((p) => Math.max(p, 85));
          checkComplete();
        },
        { once: true }
      );
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setBufferProgress((p) => Math.max(p, 70));
      });
    }

    // Safety timeout: max 6.5s to ensure guest is never permanently blocked
    const timeout = setTimeout(() => {
      videoReady = true;
      windowReady = true;
      setBufferProgress(100);
      setIsFullyLoaded(true);
    }, 6500);

    return () => {
      clearTimeout(timeout);
      testVideo.src = "";
    };
  }, [loading, config]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!isFullyLoaded) return;
    document.body.style.overflow = "unset";

    const observerOptions = {
      threshold: 0.08,
      rootMargin: "0px 0px -60px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          entry.target.classList.remove("opacity-0");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section:not(#video-hero)");
    sections.forEach((section) => {
      section.classList.add(
        "opacity-0",
        "transition-all",
        "duration-[1.2s]",
        "ease-out"
      );
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [isFullyLoaded]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (!isFullyLoaded || loading || !config) {
    return <WeddingLoader progress={bufferProgress} />;
  }

  const footerDate = (() => {
    const d = config.events.akad.startDateTime;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day} • ${month} • ${year}`;
  })();

  return (
    <div className="selection:bg-accent/30 selection:text-primary relative min-h-screen overflow-x-hidden bg-[#FAF5EB] text-[#2D2520] dark:bg-darkBg dark:text-[#FAF5EB]">
      {/* 1. FIRST LANDING SITE: 100% FULL-SCREEN CINEMATIC VIDEO (ZERO CLUTTER) */}
      <VideoLanding config={config} />

      {/* 2. DOCK NAVBAR: MINIMIZED ON VIDEO, APPEARS AT BOTTOM UPON SCROLLING */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <InstallPrompt />
      <FloatingPetals />

      {/* 3. FORMAL ARCHED INVITATION CARD */}
      <Hero config={config} />

      {/* 4. WEDDING DETAILS & INTERACTIVE SECTIONS */}
      <main className="relative z-10 space-y-0">
        <CountdownSection config={config} />
        <EventDetails config={config} />
        <DressCodePalette />
        <VenueSection config={config} />
        <CoupleProfile config={config} />
        <LoveStory config={config} />
        <Gallery config={config} />
        <RSVPForm config={config} />
        <Wishes config={config} />
        <GiftInfo config={config} />
      </main>

      <MusicPlayer url={config.music.url} />

      {/* 5. FOOTER WITH ADITYA RAWAT HOST CREDIT */}
      <footer className="dark:bg-darkSurface relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#FAF5EB] px-6 transition-colors duration-1000 border-t border-[#D4AF37]/30">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10 dark:opacity-[0.05]">
          <Heart className="animate-pulse-soft h-[85vw] w-[85vw] stroke-[0.3] text-[#8C1D24]" />
        </div>

        <div className="relative z-10 container mx-auto flex max-w-4xl flex-col items-center gap-12 md:gap-24 py-16">
          <div className="space-y-4 text-center md:space-y-6">
            <span className="font-sans block text-[10px] sm:text-xs font-bold tracking-[0.4em] text-[#8C6B1C] uppercase">
              Save The Date
            </span>
            <h2 className="font-script text-6xl sm:text-8xl md:text-[10rem] leading-none text-[#231C18] py-2 drop-shadow-xl dark:text-white flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8 text-center mx-auto">
              <span>{config.couple.bride.name}</span>
              <span className="text-[#D4AF37] font-script font-normal text-5xl sm:text-7xl md:text-8xl">&amp;</span>
              <span>{config.couple.groom.name}</span>
            </h2>
            <div className="flex items-center justify-center gap-4 md:gap-6">
              <div className="bg-[#D4AF37]/40 h-[1px] w-10 md:w-20"></div>
              <p className="font-sans text-[#8C6B1C] dark:text-accent text-[12px] font-bold tracking-[0.4em] uppercase md:text-[18px]">
                {footerDate}
              </p>
              <div className="bg-[#D4AF37]/40 h-[1px] w-10 md:w-20"></div>
            </div>
          </div>

          <div className="space-y-12 text-center md:space-y-16">
            <div className="group relative inline-block px-4">
              <Quote className="text-[#8C6B1C] absolute -top-10 -left-2 h-12 w-12 rotate-180 opacity-[0.08] transition-transform duration-1000 md:-top-16 md:-left-12 md:h-24 md:w-24 dark:opacity-[0.12]" />
              <div className="space-y-6">
                <p className="mx-auto max-w-2xl font-serif text-lg leading-relaxed text-balance text-[#5A4D43] italic md:text-3xl dark:text-slate-400">
                  "{config.text.closing.text}"
                </p>
                <p className="font-serif text-xl font-medium text-[#231C18] dark:text-white">
                  {config.text.closing.salam}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 border-t border-[#D4AF37]/20 pt-16 md:gap-8 md:pt-24 dark:border-white/5">
              <p className="font-sans tracking-luxury text-[9px] font-bold uppercase text-[#8C6B1C] md:text-[13px]">
                {config.text.closing.signature}
              </p>
              <p className="font-script text-3xl sm:text-4xl md:text-5xl text-[#231C18] dark:text-white py-1">
                {config.couple.bride.name} &amp; {config.couple.groom.name}
              </p>
              <p className="font-sans text-[11px] text-[#5A4D43] uppercase tracking-widest">{config.text.closing.family}</p>

              {/* Host Credit & Contact */}
              <div className="pt-4">
                <a
                  href="mailto:adi2002rawat@gmail.com?subject=Wedding%20Inquiry%20-%20Chandrika%20%26%20Xudong"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FFFDF9] px-4 py-2 text-xs text-[#231C18] dark:text-slate-300 transition-all duration-300 hover:border-[#8C1D24] hover:shadow-md shadow-sm"
                  title="Contact Host: Aditya Rawat (adi2002rawat@gmail.com)"
                >
                  <Mail className="h-3.5 w-3.5 text-[#8C1D24] group-hover:scale-110 transition-transform" />
                  <span>
                    Host: <strong className="font-semibold text-[#8C1D24] transition-colors">Aditya Rawat</strong> (adi2002rawat@gmail.com)
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
