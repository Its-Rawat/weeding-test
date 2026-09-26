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
      <div className="w-full max-w-xl mx-auto my-8 p-8 rounded-3xl bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-md text-center">
        <div className="w-10 h-10 border-3 border-[#D4AF37]/30 border-t-[#8C1D24] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif italic text-sm text-[#5A4D43]">
          Loading your personalized wedding invitation...
        </p>
      </div>
    );
  }

  // 2. Error: Not Found
  if (error === "INVITATION_NOT_FOUND") {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-8 rounded-3xl bg-[#FFFDF9] border border-red-200 shadow-md text-center">
        <AlertCircle className="w-12 h-12 text-[#8C1D24] mx-auto mb-3" />
        <h3 className="font-serif text-2xl font-bold text-[#231C18] mb-2">
          Invitation Not Found
        </h3>
        <p className="font-serif italic text-sm text-[#5A4D43] max-w-md mx-auto mb-4">
          We could not locate an invitation with this link. Please check the URL sent to you or contact Aditya Rawat & family.
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2 rounded-full bg-[#FAF5EB] hover:bg-[#F3E7D5] border border-[#D4AF37]/50 text-xs font-bold text-[#231C18] uppercase tracking-wider transition-colors"
        >
          View General Wedding Website
        </a>
      </div>
    );
  }

  // 3. Error: Inactive
  if (error === "INVITATION_INACTIVE" || (invitation && invitation.status === "INACTIVE")) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-8 rounded-3xl bg-[#FFFDF9] border border-amber-300 shadow-md text-center">
        <XCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="font-serif text-2xl font-bold text-[#231C18] mb-2">
          Invitation Inactive
        </h3>
        <p className="font-serif italic text-sm text-[#5A4D43] max-w-md mx-auto mb-4">
          This invitation link ({invitation?.name || "Guest"}) has been marked inactive. For assistance, please contact the host directly.
        </p>
        <a
          href="mailto:adi2002rawat@gmail.com"
          className="inline-block px-5 py-2 rounded-full bg-[#FAF5EB] hover:bg-[#F3E7D5] border border-[#D4AF37]/50 text-xs font-bold text-[#231C18] uppercase tracking-wider transition-colors"
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
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      {/* Editorial Arched Royal RSVP Container */}
      <div className="relative bg-[#FFFDF9] rounded-3xl border-2 border-[#D4AF37]/70 shadow-[0_15px_45px_-10px_rgba(140,107,28,0.15)] p-6 sm:p-10 text-center overflow-hidden transition-all duration-300">
        
        {/* Subtle Inner Filigree Border */}
        <div className="absolute inset-2.5 rounded-2xl border border-[#D4AF37]/30 pointer-events-none" />

        {/* Auspicious Header Emblem */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37] bg-[#FAF5EB] flex items-center justify-center mb-2 shadow-xs">
            <Heart className="w-5 h-5 text-[#8C1D24] fill-[#8C1D24]/20 animate-pulse" />
          </div>
          <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#8C6B1C] uppercase">
            Personalized Invitation RSVP
          </span>
        </div>

        {submitted ? (
          /* =========================================
             SUBMITTED CONFIRMATION STATE
             ========================================= */
          <div className="animate-reveal space-y-6 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#231C18]">
                {responseDetails?.status === "ATTENDING"
                  ? `Joyfully Confirmed! ❤️`
                  : `Response Recorded`}
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-[#5A4D43] max-w-md mx-auto leading-relaxed">
                {responseDetails?.status === "ATTENDING" ? (
                  <>
                    Thank you, <strong className="font-semibold text-[#8C1D24]">{invitation.name}</strong>! We are deeply honored and thrilled to celebrate with you under the holy mandap.
                  </>
                ) : (
                  <>
                    Thank you for letting us know, <strong className="font-semibold text-[#8C1D24]">{invitation.name}</strong>. You will be dearly missed during the celebrations!
                  </>
                )}
              </p>
            </div>

            {responseDetails?.status === "ATTENDING" && (
              <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#D4AF37]/40 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-2.5">
                  <span className="font-sans text-[11px] font-bold text-[#8C6B1C] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8C1D24]" />
                    Confirmed Attendees ({responseDetails.count})
                  </span>
                  <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider bg-green-100 px-2 py-0.5 rounded-full">
                    Attending
                  </span>
                </div>

                {isFamily && selectedMembers.size > 0 ? (
                  <ul className="space-y-1 text-xs text-[#231C18] font-medium">
                    {Array.from(selectedMembers).map((name) => (
                      <li key={name} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#5A4D43] italic">
                    {invitation.name} (1 Guest)
                  </p>
                )}

                {message && (
                  <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/20 text-xs italic text-[#5A4D43]">
                    "{message}"
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF5EB] hover:bg-[#F3E7D5] border border-[#D4AF37]/60 text-xs font-semibold text-[#231C18] uppercase tracking-wider transition-all cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-[#8C6B1C]" />
                <span>Update Response</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById("event")?.scrollIntoView({ behavior: "smooth" }) ||
                  document.getElementById("venue")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] hover:from-[#750D14] hover:to-[#8C1D24] text-xs font-bold text-white uppercase tracking-wider shadow-md transition-all cursor-pointer"
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
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#231C18] tracking-tight">
                {invitation.name}
              </h2>
              <p className="font-serif italic text-base sm:text-lg text-[#5A4D43] max-w-lg mx-auto leading-relaxed">
                We would be deeply honored and delighted to celebrate this special occasion with you.
              </p>
              <div className="w-20 h-0.5 bg-[#D4AF37]/60 mx-auto rounded-full mt-2" />
            </div>

            {/* Question: Will you be joining us? */}
            <div className="py-2">
              <p className="font-serif text-lg sm:text-xl font-semibold text-[#231C18] mb-4">
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
                      : "bg-[#FAF5EB] hover:bg-[#F3E7D5] border-[#D4AF37]/50 text-[#5A4D43]"
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
                      ? "bg-[#231C18] border-[#231C18] text-white shadow-md scale-102"
                      : "bg-[#FAF5EB] hover:bg-[#F3E7D5] border-[#D4AF37]/50 text-[#5A4D43]"
                  }`}
                >
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            {/* If Attending & Family: Checkboxes for Individual Members */}
            {decision === "ATTENDING" && isFamily && (
              <div className="animate-reveal p-5 rounded-2xl bg-[#FAF5EB] border border-[#D4AF37]/50 max-w-lg mx-auto text-left shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                  <span className="font-sans text-[11px] font-bold text-[#8C6B1C] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8C1D24]" />
                    Select attending family members:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAll(true)}
                      className="text-[10px] text-[#8C1D24] font-semibold hover:underline cursor-pointer"
                    >
                      All
                    </button>
                    <span className="text-stone-300">•</span>
                    <button
                      type="button"
                      onClick={() => handleSelectAll(false)}
                      className="text-[10px] text-[#5A4D43] font-semibold hover:underline cursor-pointer"
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
                            ? "bg-[#FFFDF9] border-[#D4AF37] shadow-xs text-[#231C18]"
                            : "bg-[#FAF5EB]/60 border-transparent text-[#7A6D63] hover:bg-[#FAF5EB]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#8C1D24]" />
                          ) : (
                            <Square className="w-5 h-5 text-stone-400" />
                          )}
                          <span className={`text-sm ${isChecked ? "font-bold text-[#231C18]" : "font-normal"}`}>
                            {member.name}
                          </span>
                        </div>
                        <span className={`text-[11px] uppercase tracking-wider font-semibold ${isChecked ? "text-green-700" : "text-stone-400"}`}>
                          {isChecked ? "Attending" : "Not attending"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-1 text-right text-xs font-semibold text-[#8C6B1C]">
                  Total Attending: <strong className="text-[#8C1D24] text-sm">{attendingCount}</strong> / {invitation.members.length}
                </div>
              </div>
            )}

            {/* Optional Blessing / Message Box */}
            <div className="max-w-lg mx-auto text-left space-y-1.5">
              <label className="block font-sans text-[10px] sm:text-[11px] font-bold text-[#8C6B1C] uppercase tracking-wider">
                Warm Blessing or Message for Chandrika &amp; Xudong (Optional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your wishes or notes for the couple..."
                rows={3}
                className="w-full rounded-2xl border border-[#D4AF37]/50 bg-[#FAF5EB] p-3.5 text-xs sm:text-sm text-[#231C18] placeholder:text-[#9A8B80] focus:border-[#8C1D24] focus:outline-none focus:ring-1 focus:ring-[#8C1D24] transition-all resize-none shadow-inner"
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
                <p className="text-[11px] text-[#8C1D24] mt-2 font-medium">
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
