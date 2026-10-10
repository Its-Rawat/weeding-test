import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  MapPin,
  Clock,
  Shirt,
  Mail,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: {
    type: "maps" | "escalate" | "quick_replies";
    data?: any;
  };
  timestamp: string;
}

interface WeddingAIChatbotProps {
  guestName?: string | null;
}

const BUSINESS_EMAIL = "rsvp@chandrikawedsxudong.com";

export const WeddingAIChatbot: React.FC<WeddingAIChatbotProps> = ({ guestName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Escalation form state
  const [escalateName, setEscalateName] = useState(guestName || "");
  const [escalateContact, setEscalateContact] = useState("");
  const [escalateQuery, setEscalateQuery] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Visibility: Only appear AFTER user has scrolled past the video hero page
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      const invitationEl = document.getElementById("invitation");
      // Appears once user reaches or scrolls towards the invitation section (Page 2)
      const threshold = invitationEl ? invitationEl.offsetTop - 80 : window.innerHeight * 0.7;
      setIsVisible(window.scrollY >= threshold);
    };

    checkScrollPosition();
    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialMessages: Message[] = [
    {
      id: "welcome-1",
      sender: "bot",
      text: `Namaste & Welcome${guestName ? ` ${guestName}` : ""}! 🐾✨ I am here to bring good fortune and help you with anything for Chandrika & Xudong's wedding celebration.`,
      timestamp: "Just now",
    },
    {
      id: "welcome-2",
      sender: "bot",
      text: "How can I help you today? You can ask me about venue directions, timings, dress codes, or any last-minute questions!",
      action: { type: "quick_replies" },
      timestamp: "Just now",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasOpened(true);
    }
  }, [messages, isOpen]);

  // Knowledge Base Query Matcher
  const processQuery = (rawQuery: string): { reply: string; action?: Message["action"] } => {
    const q = rawQuery.toLowerCase().trim();

    // 1. Directions / Venue / Location
    if (
      q.includes("direction") ||
      q.includes("venue") ||
      q.includes("location") ||
      q.includes("address") ||
      q.includes("reach") ||
      q.includes("map") ||
      q.includes("where") ||
      q.includes("airport") ||
      q.includes("metro") ||
      q.includes("parking") ||
      q.includes("cab") ||
      q.includes("uber")
    ) {
      return {
        reply: `📍 **Venue & Location Details:**\n\n**The Club International**\nSector 109, B3 Lane, Babupur Village, Palam Vihar, Gurugram (Gurgaon), Haryana 122017.\n\n🚗 **How to Reach:**\n• **From Delhi IGI Airport:** ~20-25 minutes drive via Dwarka Expressway / Sector 109.\n• **Nearest Metro:** Dwarka Sector 21 (Blue Line/Airport Express) or MG Road.\n• **Parking:** Complimentary valet parking is available at the main porch.`,
        action: {
          type: "maps",
          data: {
            url: "https://maps.google.com/?q=The+Club+International+Sector+109+Gurgaon",
          },
        },
      };
    }

    // 2. Timings & Ceremony Schedule
    if (
      q.includes("time") ||
      q.includes("timing") ||
      q.includes("schedule") ||
      q.includes("when") ||
      q.includes("mehendi") ||
      q.includes("haldi") ||
      q.includes("phera") ||
      q.includes("baraat") ||
      q.includes("wedding") ||
      q.includes("date")
    ) {
      return {
        reply: `⏰ **Ceremony Schedule & Timings:**\n\n🌿 **Mehendi Ceremony**\n• Sunday, 14 February 2027 • 04:00 PM onwards\n• Venue: Royal Courtyard, The Club International\n\n🌼 **Haldi Ceremony**\n• Monday, 15 February 2027 • 10:00 AM onwards\n• Venue: Poolside Pavilion\n\n🔥 **Wedding & Sacred Pheras**\n• Monday, 15 February 2027\n• Baraat Procession: 07:00 PM\n• Sacred Pheras: 08:30 PM under the Grand Mandap`,
      };
    }

    // 3. Dress Codes
    if (
      q.includes("dress") ||
      q.includes("wear") ||
      q.includes("attire") ||
      q.includes("outfit") ||
      q.includes("clothes") ||
      q.includes("color") ||
      q.includes("code")
    ) {
      return {
        reply: `👗 **Suggested Dress Codes:**\n\n🌿 **Mehendi:** Vibrant Mehndi Greens, Mint & Pastel Florals.\n🌼 **Haldi:** Sunny Yellows, Ochre & Marigold Orange.\n🔥 **Wedding (Pheras):** Traditional Banarasi Silks & Regal Sherwanis / Formal Indian Festive.`,
      };
    }

    // 4. Food / Catering
    if (
      q.includes("food") ||
      q.includes("dinner") ||
      q.includes("lunch") ||
      q.includes("veg") ||
      q.includes("non-veg") ||
      q.includes("diet") ||
      q.includes("drink") ||
      q.includes("alcohol")
    ) {
      return {
        reply: `🍽️ **Celebration Feast:**\n\nA royal banquet featuring live chaat stations, exquisite vegetarian delicacies, and authentic festive regional specialties will be served at all ceremonies.`,
      };
    }

    // 5. RSVP & Attendance
    if (
      q.includes("rsvp") ||
      q.includes("confirm") ||
      q.includes("attend") ||
      q.includes("guest") ||
      q.includes("plus one")
    ) {
      return {
        reply: `💌 **RSVP Information:**\n\nYou can confirm your attendance directly using the RSVP card on this website. If you have a personalized invitation link, your family details are already pre-filled for instant confirmation!`,
      };
    }

    // 6. Host & Contact Information
    if (
      q.includes("contact") ||
      q.includes("phone") ||
      q.includes("email") ||
      q.includes("host") ||
      q.includes("aditya") ||
      q.includes("help")
    ) {
      return {
        reply: `👤 **Wedding Hosts & Inquiries:**\n\n• **Host:** Aditya Rawat & Family\n• **Official Mail:** ${BUSINESS_EMAIL}\n\nIf you have any urgent request, feel free to submit it right here and I'll forward it directly to the host inbox!`,
        action: { type: "escalate", data: { originalQuery: rawQuery } },
      };
    }

    // 7. Unanswerable / Custom Request -> ESCALATE TO rsvp@chandrikawedsxudong.com
    return {
      reply: `I want to make sure you get the most accurate and personalized assistance for this! Would you like me to forward your question directly to our wedding team at **${BUSINESS_EMAIL}**?`,
      action: { type: "escalate", data: { originalQuery: rawQuery } },
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(text);
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: response.reply,
        action: response.action,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (response.action?.type === "escalate") {
        setEscalateQuery(text);
        setInquirySent(false);
      }
    }, 600);
  };

  const handleSendInquiry = async () => {
    if (!escalateQuery.trim()) return;
    setIsSubmittingInquiry(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: escalateName.trim() || guestName || "Guest",
          contact: escalateContact.trim(),
          query: escalateQuery.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setInquirySent(true);
        setMessages((prev) => [
          ...prev,
          {
            id: "escalated-" + Date.now(),
            sender: "bot",
            text: `✅ **Sent to ${BUSINESS_EMAIL}!**\n\nAditya and our wedding team have received your query and will reply to you as soon as possible.`,
            timestamp: "Just now",
          },
        ]);
      } else {
        // Fallback mailto
        window.open(
          `mailto:${BUSINESS_EMAIL}?subject=Wedding%20Inquiry%20from%20${encodeURIComponent(
            escalateName || "Guest"
          )}&body=${encodeURIComponent(escalateQuery)}`,
          "_blank"
        );
        setInquirySent(true);
      }
    } catch {
      // Fallback mailto on error
      window.open(
        `mailto:${BUSINESS_EMAIL}?subject=Wedding%20Inquiry&body=${encodeURIComponent(
          escalateQuery
        )}`,
        "_blank"
      );
      setInquirySent(true);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const handleCatMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const catImg = el.querySelector<HTMLImageElement>("#free-cat-img");
    if (catImg) {
      catImg.style.transform = `perspective(300px) rotateY(${x * 30}deg) rotateX(${-y * 20}deg) scale(1.08)`;
    }
  };

  const handleCatMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const catImg = e.currentTarget.querySelector<HTMLImageElement>("#free-cat-img");
    if (catImg) {
      catImg.style.transform = "";
    }
  };

  return (
    <>
      {/* FLOATING MANEKI NEKO LUCKY CAT TRIGGER (ZERO BOX/CIRCLE CONTAINER) */}
      <div
        className={`fixed bottom-6 right-4 sm:right-6 z-40 select-none transition-all duration-500 ease-out ${
          isVisible || isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-12 pointer-events-none"
        }`}
      >
        <div
          id="cat-trigger-zone"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setHasOpened(true);
          }}
          onMouseMove={handleCatMouseMove}
          onMouseLeave={handleCatMouseLeave}
          className="relative group cursor-pointer flex flex-col items-center"
          title="Ask Wedding Concierge"
        >
          {/* Subtle Floating Speech Bubble (Appears on idle/hover) */}
          <div
            id="cat-speech-bubble"
            className="animate-bubble mb-1 px-3 py-1 rounded-full bg-[#FAF5EB]/95 dark:bg-[#201819]/95 backdrop-blur-md border border-[#DDCFB5] dark:border-[#D4AF37]/40 shadow-sm text-[11px] font-serif font-bold text-[#7E1A27] dark:text-[#E5A8AD] tracking-wider transition-all duration-300 flex items-center gap-1.5 group-hover:scale-105"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span>{isOpen ? "Close ✕" : "Ask Me! ✨"}</span>
          </div>

          {/* The Cat Character */}
          <div className="relative flex flex-col items-center">
            {/* The Floating Cat Graphic */}
            <img
              id="free-cat-img"
              src="/illustrations/lucky_cat.png"
              alt="Maneki Neko Lucky Cat"
              className="relative z-10 w-20 sm:w-24 h-auto object-contain animate-floating-cat group-hover:scale-110 active:scale-95 transition-transform duration-300 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)]"
            />

            {/* Natural Soft Ground Shadow (Breathes under cat's feet) */}
            <div className="w-14 h-3 rounded-full bg-stone-900/40 blur-[3px] animate-shadow -mt-1.5 z-0" />

            {/* Floating Sparkle Near Waving Paw */}
            <span className="absolute top-1 right-0 text-sm text-[#D4AF37] opacity-90 animate-pulse pointer-events-none group-hover:scale-125 transition-transform">
              ✨
            </span>

            {/* Floating Close Badge (Only appears when open) */}
            <div
              className={`absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full bg-[#7E1A27] text-white text-xs font-bold flex items-center justify-center shadow-md transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              ✕
            </div>
          </div>
        </div>
      </div>

      {/* CHAT MODAL / DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/40 backdrop-blur-xs animate-reveal">
          <div className="relative w-full sm:w-[380px] h-[85vh] sm:h-[580px] max-h-[88vh] bg-[#FFFDF9] dark:bg-[#1A1414] rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(50,30,10,0.25)] flex flex-col overflow-hidden text-[#231C18] dark:text-[#FAF5EB]">
            
            {/* 1. CHAT HEADER */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#7E1A27] via-[#540F18] to-[#7E1A27] text-white flex items-center justify-between border-b border-amber-400/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-sm shadow-inner">
                  🐾
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#F5E6C8] leading-tight">
                    Wedding Concierge
                  </h3>
                  <span className="text-[10px] text-amber-200/80 font-medium tracking-wider uppercase block">
                    Your Friendly Ceremony Guide
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Close Chat"
              >
                ✕
              </button>
            </div>

            {/* 2. CHAT MESSAGES BODY */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm custom-scrollbar bg-radial from-[#FAF5EB]/50 to-transparent dark:from-transparent">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-xs whitespace-pre-line leading-relaxed ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] text-white rounded-tr-xs"
                        : "bg-white dark:bg-[#251D1E] border border-[#D4AF37]/30 text-[#231C18] dark:text-[#FAF5EB] rounded-tl-xs shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    {m.text}

                    {/* Action 1: Google Maps button */}
                    {m.action?.type === "maps" && m.action.data?.url && (
                      <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/20">
                        <a
                          href={m.action.data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8C1D24] text-white text-[11px] font-sans font-semibold tracking-wider uppercase hover:bg-[#750D14] transition-colors shadow-xs"
                        >
                          <MapPin className="w-3 h-3 text-amber-300" />
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Action 2: Escalate Form (Send to rsvp@chandrikawedsxudong.com) */}
                    {m.action?.type === "escalate" && !inquirySent && (
                      <div className="mt-3 p-3 rounded-xl bg-[#FAF5EB] dark:bg-[#1E1718] border border-[#D4AF37]/40 space-y-2">
                        <p className="text-[11px] font-serif font-bold text-[#8C1D24] dark:text-amber-300 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>Forward Query to Wedding Team:</span>
                        </p>
                        <input
                          type="text"
                          placeholder="Your Name (optional)"
                          value={escalateName}
                          onChange={(e) => setEscalateName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#2C2122] border border-[#D4AF37]/30 text-xs focus:outline-hidden focus:border-[#8C1D24]"
                        />
                        <input
                          type="text"
                          placeholder="Your Phone / Email (to receive reply)"
                          value={escalateContact}
                          onChange={(e) => setEscalateContact(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#2C2122] border border-[#D4AF37]/30 text-xs focus:outline-hidden focus:border-[#8C1D24]"
                        />
                        <textarea
                          rows={2}
                          placeholder="Your Question / Message"
                          value={escalateQuery}
                          onChange={(e) => setEscalateQuery(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#2C2122] border border-[#D4AF37]/30 text-xs focus:outline-hidden focus:border-[#8C1D24]"
                        />
                        <button
                          onClick={handleSendInquiry}
                          disabled={isSubmittingInquiry || !escalateQuery.trim()}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8C1D24] hover:bg-[#750D14] disabled:opacity-50 text-white text-[11px] font-sans font-bold tracking-wider uppercase transition-colors cursor-pointer shadow-xs"
                        >
                          {isSubmittingInquiry ? (
                            <span>Sending to {BUSINESS_EMAIL}...</span>
                          ) : (
                            <>
                              <Send className="w-3 h-3 text-amber-300" />
                              <span>Send to {BUSINESS_EMAIL}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-[#5A4D43]/60 dark:text-white/40 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}

              {/* Bot Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-[#8C6B1C] italic px-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Wedding AI is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. QUICK QUESTION CHIPS */}
            <div className="px-3 py-2 bg-[#FAF5EB] dark:bg-[#1A1414] border-t border-[#D4AF37]/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendMessage("What is the venue and how to reach?")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#251D1E] border border-[#D4AF37]/40 text-[10px] font-sans font-medium hover:border-[#8C1D24] hover:text-[#8C1D24] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3 h-3 text-[#8C1D24]" />
                <span>📍 Directions</span>
              </button>
              <button
                onClick={() => handleSendMessage("What are the ceremony timings?")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#251D1E] border border-[#D4AF37]/40 text-[10px] font-sans font-medium hover:border-[#8C1D24] hover:text-[#8C1D24] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <Clock className="w-3 h-3 text-[#8C1D24]" />
                <span>⏰ Timings</span>
              </button>
              <button
                onClick={() => handleSendMessage("What is the dress code for events?")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#251D1E] border border-[#D4AF37]/40 text-[10px] font-sans font-medium hover:border-[#8C1D24] hover:text-[#8C1D24] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <Shirt className="w-3 h-3 text-[#8C1D24]" />
                <span>👗 Dress Code</span>
              </button>
              <button
                onClick={() => handleSendMessage("I need to contact the wedding host directly")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#251D1E] border border-[#D4AF37]/40 text-[10px] font-sans font-medium hover:border-[#8C1D24] hover:text-[#8C1D24] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <Mail className="w-3 h-3 text-[#8C1D24]" />
                <span>✉️ Message Host</span>
              </button>
            </div>

            {/* 4. CHAT INPUT BAR */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-[#201819] border-t border-[#D4AF37]/30 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about directions, timings, dress code..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-full bg-[#FAF5EB] dark:bg-[#2C2122] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#231C18] dark:text-[#FAF5EB] placeholder:text-[#5A4D43]/60 dark:placeholder:text-white/40 focus:outline-hidden focus:border-[#8C1D24]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#8C1D24] disabled:opacity-40 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default WeddingAIChatbot;
