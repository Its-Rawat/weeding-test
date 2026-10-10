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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialMessages: Message[] = [
    {
      id: "welcome-1",
      sender: "bot",
      text: `Namaste${guestName ? ` ${guestName}` : ""}! 🙏 I am your Wedding Concierge for Chandrika & Xudong's wedding celebrations.`,
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

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Always accessible, elegant gold & royal crimson) */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#8C1D24] text-white shadow-[0_4px_20px_rgba(140,29,36,0.4)] border border-[#D4AF37]/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="Ask Wedding AI Concierge"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs sm:text-sm font-serif tracking-wide font-medium">
            Ask Wedding AI
          </span>
          {!hasOpened && (
            <span className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full bg-[#D4AF37] text-[10px] font-sans font-bold text-[#231C18] uppercase tracking-wider shadow-sm animate-bounce">
              New
            </span>
          )}
        </button>
      </div>

      {/* CHAT MODAL / DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/40 backdrop-blur-xs animate-reveal">
          <div className="relative w-full sm:w-[400px] h-[85vh] sm:h-[580px] max-h-[88vh] bg-[#FFFDF9] dark:bg-[#1A1414] rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden text-[#231C18] dark:text-[#FAF5EB]">
            
            {/* 1. CHAT HEADER */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#8C1D24] via-[#750D14] to-[#8C1D24] text-white flex items-center justify-between border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37] bg-[#FAF5EB] text-[#8C1D24] flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                  C &amp; X
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                    <span>Wedding Concierge AI</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-100/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Instant Answers &bull; Host Support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4 text-white" />
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
