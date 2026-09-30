import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Users,
  Check,
  Send,
  Plus,
  Minus,
  ExternalLink,
  KeyRound,
  X,
} from "lucide-react";
import type { AppConfig } from "../types";
import { AttendanceStatus } from "../types";
import { dbService } from "../services/dbService";
import { PersonalizedRSVPSection } from "./PersonalizedRSVPSection";

const extractTokenFromUrl = (): string | null => {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/\/rsvp\/([a-zA-Z0-9_-]+)/);
  if (match && match[1] && match[1].toLowerCase() !== "stats") {
    return match[1];
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("token") || params.get("rsvp") || null;
};

const WEDDING_EVENTS = [
  { id: "mehendi", label: "🌿 Mehendi Ceremony", date: "Sat, 14 Feb • 4:00 PM" },
  { id: "haldi", label: "🌼 Haldi Ceremony", date: "Sun, 15 Feb • 10:00 AM" },
  { id: "wedding", label: "🔥 Wedding Mandap", date: "Sun, 15 Feb • 4:00 PM" },
];

const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Chandrika+%26+Xudong's+Wedding+Celebrations&dates=20270214T103000Z/20270215T183000Z&details=Celebrating+the+auspicious+wedding+of+Chandrika+%26+Xudong+at+The+Club+International,+Gurugram.+Ceremonies:+Mehendi+(14+Feb),+Haldi+(15+Feb),+and+Mandap+Vows+(15+Feb).&location=The+Club,+International+City,+Sector+109,+Gurugram";

const RSVPForm: React.FC<{ config?: AppConfig }> = () => {
  const [token, setToken] = useState<string | null>(extractTokenFromUrl());
  const [manualTokenInput, setManualTokenInput] = useState("");
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Direct RSVP Form States
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir">("hadir");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "mehendi",
    "haldi",
    "wedding",
  ]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setToken(extractTokenFromUrl());
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const handleOpenToken = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualTokenInput.trim();
    if (clean) {
      setToken(clean);
      window.history.pushState({}, "", `/rsvp/${clean}`);
      setShowTokenModal(false);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const handleClearToken = () => {
    setToken(null);
    setManualTokenInput("");
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new Event("popstate"));
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Build composed message with selected events
      let composedMessage = message.trim();
      if (attendance === "hadir") {
        const eventLabels = WEDDING_EVENTS.filter((ev) =>
          selectedEvents.includes(ev.id)
        )
          .map((ev) => ev.label)
          .join(", ");
        composedMessage = eventLabels
          ? `[Functions: ${eventLabels}] ${composedMessage}`
          : composedMessage;
      }

      await dbService.saveRSVP({
        guest_name: guestName.trim(),
        phone: phone.trim() || undefined,
        attendance:
          attendance === "hadir"
            ? AttendanceStatus.HADIR
            : AttendanceStatus.TIDAK_HADIR,
        guest_count: attendance === "hadir" ? guestCount : 0,
        message: composedMessage,
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error("RSVP Submission failed:", err);
      setErrorMessage(
        "Could not save your RSVP right now. Please try again or reach out to Aditya Rawat."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setGuestName("");
    setPhone("");
    setAttendance("hadir");
    setGuestCount(2);
    setSelectedEvents(["mehendi", "haldi", "wedding"]);
    setMessage("");
    setErrorMessage(null);
  };

  return (
    <section
      id="rsvp"
      className="bg-[#F8F9FA] dark:bg-[#12151A] text-[#1E242B] dark:text-[#F8F9FA] py-16 sm:py-24 transition-colors duration-700 border-t border-[#D4AF37]/25 relative"
    >
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-14 space-y-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFFFF] dark:bg-[#1A1F26] border border-[#D4AF37]/40 shadow-xs mb-1">
            <Heart className="text-[#8C1D24] dark:text-[#E2A76F] h-3.5 w-3.5 fill-[#8C1D24]/20 animate-pulse" />
            <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#967836] dark:text-[#D4AF37] uppercase">
              Join Our Auspicious Celebration
            </span>
          </div>
          <h2 className="font-serif italic text-4xl sm:text-6xl text-[#1E242B] dark:text-white font-normal tracking-tight">
            RSVP
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-[#4B5563] dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Your loving presence and divine blessings will make our wedding day truly unforgettable.
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto rounded-full mt-2" />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CASE A: Token Active -> Personalized Family/Guest RSVP View       */}
        {/* ------------------------------------------------------------------ */}
        {token ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1F26] border border-[#D4AF37]/40 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C1D24] dark:text-[#D4AF37]" />
                <span className="font-serif italic text-xs sm:text-sm text-[#1E242B] dark:text-slate-200">
                  Personalized Code Active:{" "}
                  <code className="font-mono font-bold text-[#8C1D24] dark:text-[#FFE082] bg-[#F8F9FA] dark:bg-[#12151A] px-2 py-0.5 rounded border border-[#D4AF37]/40">
                    {token}
                  </code>
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearToken}
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#967836] hover:text-[#8C1D24] dark:text-[#D4AF37] dark:hover:text-white hover:underline cursor-pointer ml-auto transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Switch to Open Form</span>
              </button>
            </div>

            <PersonalizedRSVPSection token={token} />
          </div>
        ) : (
          /* ------------------------------------------------------------------ */
          /* CASE B: General Guest Direct RSVP Form (Open & Welcoming for All)   */
          /* ------------------------------------------------------------------ */
          <div className="max-w-2xl mx-auto">
            {/* VIP / Family Invitation Banner */}
            <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1F26] border border-[#D4AF37]/35 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs text-[#4B5563] dark:text-slate-300">
                <KeyRound className="w-4 h-4 text-[#8C1D24] dark:text-[#D4AF37] shrink-0" />
                <span>
                  Received a private invitation link or family code?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTokenModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#252B35] border border-[#D4AF37]/50 text-[11px] font-bold uppercase tracking-wider text-[#967836] dark:text-[#D4AF37] hover:text-[#8C1D24] transition-all cursor-pointer"
              >
                <span>Enter Code</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Direct RSVP Card Container */}
            <div className="relative bg-[#FFFFFF] dark:bg-[#1A1F26] rounded-3xl border border-[#D4AF37]/45 shadow-[0_15px_45px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.4)] p-6 sm:p-10 transition-all duration-300 overflow-hidden">
              {/* Inner Soft Accent Line */}
              <div className="absolute inset-2.5 rounded-2xl border border-[#D4AF37]/20 pointer-events-none" />

              {isSuccess ? (
                /* =========================================================
                   POST-SUBMISSION SUCCESS CARD
                   ========================================================= */
                <div className="animate-reveal py-4 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      RSVP Confirmed
                    </span>
                    <h3 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#1E242B] dark:text-white">
                      {attendance === "hadir"
                        ? "Joyfully Confirmed! ❤️"
                        : "Response Received"}
                    </h3>
                    <p className="font-serif italic text-sm sm:text-base text-[#4B5563] dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      {attendance === "hadir" ? (
                        <>
                          Thank you, <strong className="font-semibold text-[#8C1D24] dark:text-[#FFE082]">{guestName}</strong>! We are deeply honored and cannot wait to celebrate the wedding festivities with you.
                        </>
                      ) : (
                        <>
                          Thank you for letting us know, <strong className="font-semibold text-[#8C1D24] dark:text-[#FFE082]">{guestName}</strong>. You will be dearly missed during the wedding rituals!
                        </>
                      )}
                    </p>
                  </div>

                  {attendance === "hadir" && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] dark:bg-[#12151A] border border-[#D4AF37]/40 max-w-md mx-auto text-left space-y-3">
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                        <span className="font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#8C1D24]" />
                          Party Size
                        </span>
                        <span className="text-xs font-bold text-[#1E242B] dark:text-white bg-[#FFFFFF] dark:bg-[#1A1F26] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                          {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>

                      {selectedEvents.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-sans text-[10px] font-bold text-[#4B5563] dark:text-slate-400 uppercase tracking-wider block">
                            Joining Functions:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {WEDDING_EVENTS.filter((e) =>
                              selectedEvents.includes(e.id)
                            ).map((e) => (
                              <span
                                key={e.id}
                                className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-[#FFFFFF] dark:bg-[#1A1F26] border border-[#D4AF37]/50 text-[#8C1D24] dark:text-[#FFE082]"
                              >
                                {e.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {message && (
                        <div className="pt-2 border-t border-[#D4AF37]/20 text-xs italic text-[#4B5563] dark:text-slate-300">
                          "{message}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions: Add to Google Calendar & Update Response */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    {attendance === "hadir" && (
                      <a
                        href={GOOGLE_CALENDAR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#8C1D24] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-[#FFE082]" />
                        <span>Add to Google Calendar</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border border-[#D4AF37]/50 text-xs font-semibold text-[#1E242B] dark:text-slate-200 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RefreshCcw className="w-3.5 h-3.5 text-[#967836]" />
                      <span>Update Response</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* =========================================================
                   DIRECT RSVP INTERACTIVE FORM
                   ========================================================= */
                <form onSubmit={handleDirectSubmit} className="space-y-6">
                  {/* Step 1: Joyfully Attending vs Regretfully Decline */}
                  <div>
                    <label className="block text-center font-serif text-base sm:text-lg font-medium text-[#1E242B] dark:text-white mb-3">
                      Will you be joining our wedding festivities?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                      <button
                        type="button"
                        onClick={() => setAttendance("hadir")}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          attendance === "hadir"
                            ? "bg-gradient-to-r from-[#8C1D24] to-[#A8232B] border-[#FFD54F] text-white shadow-md scale-102"
                            : "bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border-[#D4AF37]/40 text-[#4B5563] dark:text-slate-300"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            attendance === "hadir"
                              ? "text-[#FFE082] fill-[#FFE082]"
                              : "text-[#8C1D24]"
                          }`}
                        />
                        <span>Joyfully Accept ❤️</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAttendance("tidak_hadir")}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          attendance === "tidak_hadir"
                            ? "bg-[#1E242B] dark:bg-[#0D1015] border-[#967836] text-white shadow-md scale-102"
                            : "bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border-[#D4AF37]/40 text-[#4B5563] dark:text-slate-300"
                        }`}
                      >
                        <span>Regretfully Decline</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Guest Details (Name & Phone) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider">
                        Full Name / Family Name <span className="text-[#8C1D24]">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#967836] dark:text-slate-400" />
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma & Family"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D4AF37]/40 bg-[#F8F9FA] dark:bg-[#12151A] text-xs sm:text-sm text-[#1E242B] dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#8C1D24] focus:ring-1 focus:ring-[#8C1D24] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider">
                        WhatsApp / Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#967836] dark:text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D4AF37]/40 bg-[#F8F9FA] dark:bg-[#12151A] text-xs sm:text-sm text-[#1E242B] dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#8C1D24] focus:ring-1 focus:ring-[#8C1D24] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Attending Specifics (Guest Counter + Functions Checklist) */}
                  {attendance === "hadir" && (
                    <div className="space-y-5 animate-reveal pt-2 border-t border-[#D4AF37]/25">
                      {/* Guest Count Stepper */}
                      <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#12151A] border border-[#D4AF37]/35 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider block">
                            Number of Guests Attending
                          </span>
                          <span className="text-xs text-[#4B5563] dark:text-slate-400">
                            Including yourself and companions
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-[#FFFFFF] dark:bg-[#1A1F26] rounded-xl border border-[#D4AF37]/50 p-1 shadow-xs">
                            <button
                              type="button"
                              onClick={() =>
                                setGuestCount((c) => Math.max(1, c - 1))
                              }
                              className="w-8 h-8 rounded-lg bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#2A3340] text-[#1E242B] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Decrease count"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-bold text-sm text-[#1E242B] dark:text-white">
                              {guestCount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setGuestCount((c) => Math.min(10, c + 1))
                              }
                              className="w-8 h-8 rounded-lg bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#2A3340] text-[#1E242B] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Increase count"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick selection pills */}
                          <div className="hidden sm:flex items-center gap-1">
                            {[1, 2, 3, 4].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setGuestCount(num)}
                                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  guestCount === num
                                    ? "bg-[#8C1D24] text-white shadow-xs"
                                    : "bg-[#FFFFFF] dark:bg-[#1A1F26] text-[#4B5563] dark:text-slate-300 border border-[#D4AF37]/40 hover:bg-[#EAEAEA]"
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Ceremonies Attending Selection */}
                      <div className="text-left space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider">
                            Which functions will you attend?
                          </span>
                          <span className="text-[10px] text-[#4B5563] dark:text-slate-400">
                            Select all that apply
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {WEDDING_EVENTS.map((evt) => {
                            const isSelected = selectedEvents.includes(evt.id);
                            return (
                              <div
                                key={evt.id}
                                onClick={() => toggleEvent(evt.id)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
                                  isSelected
                                    ? "bg-[#F8F9FA] dark:bg-[#12151A] border-[#8C1D24] dark:border-[#D4AF37] ring-1 ring-[#8C1D24]/30 shadow-xs"
                                    : "bg-[#FFFFFF] dark:bg-[#1A1F26] border-[#D4AF37]/35 text-[#64748B] opacity-75 hover:opacity-100"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={`text-xs font-bold ${
                                      isSelected
                                        ? "text-[#8C1D24] dark:text-[#FFE082]"
                                        : "text-[#1E242B] dark:text-white"
                                    }`}
                                  >
                                    {evt.label}
                                  </span>
                                  <div
                                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                                      isSelected
                                        ? "bg-[#8C1D24] border-[#8C1D24] text-white"
                                        : "border-[#CBD5E1] dark:border-stone-600 bg-white dark:bg-black/20"
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </div>
                                <span className="text-[10px] text-[#64748B] dark:text-slate-400">
                                  {evt.date}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Warm Blessing / Wishes / Dietary Note */}
                  <div className="text-left space-y-1.5">
                    <label className="block font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider">
                      Warm Blessings or Message for Chandrika &amp; Xudong (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your heartfelt wishes, blessings, or any special dietary requirements..."
                      className="w-full p-3.5 rounded-xl border border-[#D4AF37]/40 bg-[#F8F9FA] dark:bg-[#12151A] text-xs sm:text-sm text-[#1E242B] dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#8C1D24] focus:ring-1 focus:ring-[#8C1D24] transition-all resize-none shadow-inner"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 text-center font-medium">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full max-w-md mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8C1D24] via-[#A8232B] to-[#750D14] hover:from-[#750D14] hover:to-[#8C1D24] text-white text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md hover:shadow-xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border border-[#FFD54F]/60"
                    >
                      {isSubmitting ? (
                        <span>Saving Your RSVP...</span>
                      ) : (
                        <>
                          <span>Submit Wedding RSVP</span>
                          <Send className="w-4 h-4 text-[#FFE082]" />
                        </>
                      )}
                    </button>
                    <p className="font-serif italic text-[11px] text-[#4B5563] dark:text-slate-400 text-center mt-2.5">
                      We look forward to sharing our most sacred celebrations with you!
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODAL: Enter Personalized Invitation Code                         */}
        {/* ------------------------------------------------------------------ */}
        {showTokenModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-xs px-4"
            onClick={() => setShowTokenModal(false)}
          >
            <div
              className="bg-[#FFFFFF] dark:bg-[#1A1F26] rounded-3xl border border-[#D4AF37]/60 shadow-2xl max-w-md w-full p-6 text-center space-y-4 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-2">
                <span className="font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#8C1D24]" />
                  Enter Invitation Code
                </span>
                <button
                  type="button"
                  onClick={() => setShowTokenModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] flex items-center justify-center text-[#4B5563] dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="font-serif italic text-xs sm:text-sm text-[#4B5563] dark:text-slate-300">
                Please enter the personalized invitation code sent to your family:
              </p>

              <form onSubmit={handleOpenToken} className="space-y-3">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 7Kx92LmPq8Za"
                  value={manualTokenInput}
                  onChange={(e) => setManualTokenInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/50 bg-[#F8F9FA] dark:bg-[#12151A] text-sm font-mono text-[#1E242B] dark:text-white focus:outline-none focus:border-[#8C1D24] text-center uppercase tracking-widest shadow-inner"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTokenModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-[#4B5563] dark:text-slate-300 uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#8C1D24] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Open RSVP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RSVPForm;
