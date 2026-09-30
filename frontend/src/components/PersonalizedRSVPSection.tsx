import React, { useState, useEffect } from "react";
import {
  Heart,
  CheckCircle2,
  Users,
  Send,
  RefreshCcw,
  AlertCircle,
  Sparkles,
  CheckSquare,
  Square,
  XCircle,
} from "lucide-react";
import {
  personalizedRsvpService,
  type PublicInvitation,
} from "../services/personalizedRsvpService";

interface PersonalizedRSVPProps {
  token: string;
  onSuccess?: () => void;
}

export const PersonalizedRSVPSection: React.FC<PersonalizedRSVPProps> = ({ token, onSuccess }) => {
  const [invitation, setInvitation] = useState<PublicInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [decision, setDecision] = useState<"ATTENDING" | "NOT_ATTENDING">("ATTENDING");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseDetails, setResponseDetails] = useState<{
    status: string;
    count: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    personalizedRsvpService
      .getInvitation(token)
      .then((data) => {
        if (!isMounted) return;
        setInvitation(data);
        setMessage(data.message || "");

        // Set initial decision based on existing response
        if (data.rsvpStatus === "NOT_ATTENDING") {
          setDecision("NOT_ATTENDING");
          setSubmitted(true);
          setResponseDetails({ status: "NOT_ATTENDING", count: 0 });
        } else if (data.rsvpStatus === "ATTENDING") {
          setDecision("ATTENDING");
          setSubmitted(true);
          const attCount = data.members.filter((m) => m.attending).length || 1;
          setResponseDetails({ status: "ATTENDING", count: attCount });
        }

        // Initialize checked members
        const initialSelected = new Set<string>();
        if (data.members && data.members.length > 0) {
          const anyAttending = data.members.some((m) => m.attending);
          data.members.forEach((m) => {
            // If previous attendance saved, respect it; otherwise default all checked
            if (anyAttending ? m.attending : true) {
              initialSelected.add(m.name);
            }
          });
        }
        setSelectedMembers(initialSelected);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.message === "INVITATION_NOT_FOUND") {
          setError("INVITATION_NOT_FOUND");
        } else {
          setError(err.message || "Failed to load invitation.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleToggleMember = (name: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleSelectAll = (select: boolean) => {
    if (!invitation) return;
    if (select) {
      setSelectedMembers(new Set(invitation.members.map((m) => m.name)));
    } else {
      setSelectedMembers(new Set());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    setIsSubmitting(true);
    try {
      const attendingList =
        decision === "ATTENDING" ? Array.from(selectedMembers) : [];

      const res = await personalizedRsvpService.submitRsvp(token, {
        rsvpStatus: decision,
        attendingMembers: attendingList,
        message: message.trim() || undefined,
      });

      setSubmitted(true);
      setResponseDetails({
        status: res.rsvpStatus,
        count: res.attendingCount,
      });
      onSuccess?.();
    } catch (err: any) {
      if (err.message === "INVITATION_INACTIVE") {
        setError("INVITATION_INACTIVE");
      } else {
        alert(err.message || "Failed to submit RSVP. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#1A1F26] border border-[#D4AF37]/40 shadow-md text-center">
        <div className="w-10 h-10 border-3 border-[#D4AF37]/30 border-t-[#8C1D24] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif italic text-sm text-[#4B5563] dark:text-slate-300">
          Loading your personalized wedding invitation...
        </p>
      </div>
    );
  }

  // 2. Error: Not Found
  if (error === "INVITATION_NOT_FOUND") {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#1A1F26] border border-red-200 dark:border-red-800 shadow-md text-center">
        <AlertCircle className="w-12 h-12 text-[#8C1D24] mx-auto mb-3" />
        <h3 className="font-serif text-2xl font-bold text-[#1E242B] dark:text-white mb-2">
          Invitation Not Found
        </h3>
        <p className="font-serif italic text-sm text-[#4B5563] dark:text-slate-300 max-w-md mx-auto mb-4">
          We could not locate an invitation with this link. Please check the URL sent to you or contact Aditya Rawat &amp; family.
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2.5 rounded-full bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border border-[#D4AF37]/50 text-xs font-bold text-[#1E242B] dark:text-white uppercase tracking-wider transition-colors"
        >
          View General Wedding Website
        </a>
      </div>
    );
  }

  // 3. Error: Inactive
  if (error === "INVITATION_INACTIVE" || (invitation && invitation.status === "INACTIVE")) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#1A1F26] border border-amber-300 dark:border-amber-700 shadow-md text-center">
        <XCircle className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
        <h3 className="font-serif text-2xl font-bold text-[#1E242B] dark:text-white mb-2">
          Invitation Inactive
        </h3>
        <p className="font-serif italic text-sm text-[#4B5563] dark:text-slate-300 max-w-md mx-auto mb-4">
          This invitation link ({invitation?.name || "Guest"}) has been marked inactive. For assistance, please contact the host directly.
        </p>
        <a
          href="mailto:adi2002rawat@gmail.com"
          className="inline-block px-5 py-2.5 rounded-full bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border border-[#D4AF37]/50 text-xs font-bold text-[#1E242B] dark:text-white uppercase tracking-wider transition-colors"
        >
          Contact Host
        </a>
      </div>
    );
  }

  if (!invitation) return null;

  const isFamily = invitation.type === "FAMILY" && invitation.members && invitation.members.length > 0;
  const attendingCount = selectedMembers.size;

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-2 sm:px-4">
      {/* Editorial Arched Royal RSVP Container */}
      <div className="relative bg-[#FFFFFF] dark:bg-[#1A1F26] rounded-3xl border border-[#D4AF37]/50 shadow-[0_15px_45px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.4)] p-6 sm:p-10 text-center overflow-hidden transition-all duration-300">
        
        {/* Subtle Inner Filigree Border */}
        <div className="absolute inset-2.5 rounded-2xl border border-[#D4AF37]/20 pointer-events-none" />

        {/* Auspicious Header Emblem */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/60 bg-[#F8F9FA] dark:bg-[#12151A] flex items-center justify-center mb-2 shadow-xs">
            <Heart className="w-5 h-5 text-[#8C1D24] fill-[#8C1D24]/20 animate-pulse" />
          </div>
          <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#967836] dark:text-[#D4AF37] uppercase">
            Personalized Invitation RSVP
          </span>
        </div>

        {submitted ? (
          /* =========================================
             SUBMITTED CONFIRMATION STATE
             ========================================= */
          <div className="animate-reveal space-y-6 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E242B] dark:text-white">
                {responseDetails?.status === "ATTENDING"
                  ? `Joyfully Confirmed! ❤️`
                  : `Response Recorded`}
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-[#4B5563] dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {responseDetails?.status === "ATTENDING" ? (
                  <>
                    Thank you, <strong className="font-semibold text-[#8C1D24] dark:text-[#FFE082]">{invitation.name}</strong>! We are deeply honored and thrilled to celebrate with you under the holy mandap.
                  </>
                ) : (
                  <>
                    Thank you for letting us know, <strong className="font-semibold text-[#8C1D24] dark:text-[#FFE082]">{invitation.name}</strong>. You will be dearly missed during the celebrations!
                  </>
                )}
              </p>
            </div>

            {responseDetails?.status === "ATTENDING" && (
              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#12151A] border border-[#D4AF37]/40 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-2.5">
                  <span className="font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8C1D24]" />
                    Confirmed Attendees ({responseDetails.count})
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                    Attending
                  </span>
                </div>

                {isFamily && selectedMembers.size > 0 ? (
                  <ul className="space-y-1 text-xs text-[#1E242B] dark:text-slate-200 font-medium">
                    {Array.from(selectedMembers).map((name) => (
                      <li key={name} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#4B5563] dark:text-slate-400 italic">
                    {invitation.name} (1 Guest)
                  </p>
                )}

                {message && (
                  <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/20 text-xs italic text-[#4B5563] dark:text-slate-300">
                    "{message}"
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border border-[#D4AF37]/50 text-xs font-semibold text-[#1E242B] dark:text-slate-200 uppercase tracking-wider transition-all cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-[#967836] dark:text-[#D4AF37]" />
                <span>Update Response</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById("event")?.scrollIntoView({ behavior: "smooth" }) ||
                  document.getElementById("venue")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#8C1D24] text-xs font-bold text-white uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <span>View Celebrations Itinerary ↓</span>
              </button>
            </div>
          </div>
        ) : (
          /* =========================================
             ACTIVE INVITATION RSVP FORM
             ========================================= */
          <form onSubmit={handleSubmit} className="space-y-6 text-center">
            
            {/* Guest / Family Title Lockup */}
            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1E242B] dark:text-white tracking-tight">
                {invitation.name}
              </h2>
              <p className="font-serif italic text-base sm:text-lg text-[#4B5563] dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                We would be deeply honored and delighted to celebrate this special occasion with you.
              </p>
              {invitation.allowedEvents && invitation.allowedEvents.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#967836] dark:text-[#D4AF37] mr-1">
                    Invited Functions:
                  </span>
                  {invitation.allowedEvents.map((evt) => (
                    <span
                      key={evt}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F8F9FA] dark:bg-[#12151A] border border-[#D4AF37]/50 text-[#8C1D24] dark:text-[#FFE082] shadow-2xs"
                    >
                      {evt.charAt(0).toUpperCase() + evt.slice(1).toLowerCase()}
                    </span>
                  ))}
                </div>
              )}
              <div className="w-20 h-0.5 bg-[#D4AF37]/60 mx-auto rounded-full mt-2" />
            </div>

            {/* Question: Will you be joining us? */}
            <div className="py-2">
              <p className="font-serif text-lg sm:text-xl font-semibold text-[#1E242B] dark:text-white mb-4">
                Will you be joining us?
              </p>

              {/* Two Prominent Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setDecision("ATTENDING")}
                  className={`py-3.5 px-4 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm ${
                    decision === "ATTENDING"
                      ? "bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] border-[#FFD54F] text-white shadow-md scale-102"
                      : "bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border-[#D4AF37]/40 text-[#4B5563] dark:text-slate-300"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${decision === "ATTENDING" ? "text-[#FFE082] fill-[#FFE082]" : "text-[#8C1D24]"}`} />
                  <span>Joyfully Accept ❤️</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision("NOT_ATTENDING")}
                  className={`py-3.5 px-4 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm ${
                    decision === "NOT_ATTENDING"
                      ? "bg-[#1E242B] dark:bg-[#0D1015] border-[#967836] text-white shadow-md scale-102"
                      : "bg-[#F8F9FA] dark:bg-[#12151A] hover:bg-[#EAEAEA] dark:hover:bg-[#202731] border-[#D4AF37]/40 text-[#4B5563] dark:text-slate-300"
                  }`}
                >
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* If Attending & Family: Checkboxes for Individual Members */}
            {decision === "ATTENDING" && isFamily && (
              <div className="animate-reveal p-5 rounded-2xl bg-[#F8F9FA] dark:bg-[#12151A] border border-[#D4AF37]/40 max-w-lg mx-auto text-left shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                  <span className="font-sans text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8C1D24]" />
                    Select attending family members:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAll(true)}
                      className="text-[10px] text-[#8C1D24] dark:text-[#FFE082] font-semibold hover:underline cursor-pointer"
                    >
                      All
                    </button>
                    <span className="text-stone-300 dark:text-stone-600">•</span>
                    <button
                      type="button"
                      onClick={() => handleSelectAll(false)}
                      className="text-[10px] text-[#4B5563] dark:text-slate-400 font-semibold hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {invitation.members.map((member) => {
                    const isChecked = selectedMembers.has(member.name);
                    return (
                      <div
                        key={member.name}
                        onClick={() => handleToggleMember(member.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-[#FFFFFF] dark:bg-[#1A1F26] border-[#8C1D24] dark:border-[#D4AF37] shadow-xs text-[#1E242B] dark:text-white"
                            : "bg-[#F8F9FA] dark:bg-[#12151A]/60 border border-transparent text-[#64748B] dark:text-slate-400 hover:bg-[#EAEAEA] dark:hover:bg-[#1E242B]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#8C1D24] dark:text-[#FFE082]" />
                          ) : (
                            <Square className="w-5 h-5 text-stone-400" />
                          )}
                          <span className={`text-sm ${isChecked ? "font-bold text-[#1E242B] dark:text-white" : "font-normal"}`}>
                            {member.name}
                          </span>
                        </div>
                        <span className={`text-[11px] uppercase tracking-wider font-semibold ${isChecked ? "text-emerald-700 dark:text-emerald-400" : "text-stone-400"}`}>
                          {isChecked ? "Attending" : "Not attending"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-1 text-right text-xs font-semibold text-[#967836] dark:text-[#D4AF37]">
                  Total Attending: <strong className="text-[#8C1D24] dark:text-[#FFE082] text-sm">{attendingCount}</strong> / {invitation.members.length}
                </div>
              </div>
            )}

            {/* Optional Blessing / Message Box */}
            <div className="max-w-lg mx-auto text-left space-y-1.5">
              <label className="block font-sans text-[10px] sm:text-[11px] font-bold text-[#967836] dark:text-[#D4AF37] uppercase tracking-wider">
                Warm Blessing or Message for Chandrika &amp; Xudong (Optional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your wishes or notes for the couple..."
                rows={3}
                className="w-full rounded-2xl border border-[#D4AF37]/40 bg-[#F8F9FA] dark:bg-[#12151A] p-3.5 text-xs sm:text-sm text-[#1E242B] dark:text-white placeholder:text-[#94A3B8] focus:border-[#8C1D24] focus:outline-none focus:ring-1 focus:ring-[#8C1D24] transition-all resize-none shadow-inner"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || (decision === "ATTENDING" && isFamily && attendingCount === 0)}
                className="w-full max-w-md py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8C1D24] via-[#A8232B] to-[#750D14] hover:from-[#750D14] hover:to-[#8C1D24] text-white text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md hover:shadow-xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Saving Response...</span>
                ) : (
                  <>
                    <span>Confirm RSVP Response</span>
                    <Send className="w-4 h-4 text-[#FFE082]" />
                  </>
                )}
              </button>

              {decision === "ATTENDING" && isFamily && attendingCount === 0 && (
                <p className="text-[11px] text-[#8C1D24] dark:text-red-400 mt-2 font-medium">
                  Please select at least one family member attending.
                </p>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default PersonalizedRSVPSection;
