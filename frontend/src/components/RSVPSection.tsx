import React, { useState } from "react";
import { Send, CheckCircle2, Heart } from "lucide-react";
import { dbService } from "../services/dbService";

export const RSVPSection: React.FC = () => {
  const [formData, setFormData] = useState({
    guest_name: "",
    attendance: "hadir",
    guest_count: 1,
    meal_preference: "French Mediterranean",
    dietary: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guest_name.trim()) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP({
        guest_name: formData.guest_name,
        attendance: formData.attendance as any,
        guest_count: formData.guest_count,
        message: `Meal: ${formData.meal_preference} | Dietary: ${formData.dietary} | Note: ${formData.message}`,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 bg-[#FAF6EE] text-center border-t border-[#C5A059]/20">
      <div className="max-w-xl mx-auto">
        
        {/* Physical Stationery RSVP Card */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#C5A059]/40 shadow-xl p-8 sm:p-12 text-left relative overflow-hidden">
          
          <div className="text-center mb-8">
            <span className="font-serif italic text-xs text-[#7D9D8B] tracking-[0.3em] uppercase font-medium">
              Répondez S'il Vous Plaît
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2A2F2B] font-normal mt-1">
              Kindly Respond
            </h2>
            <p className="font-serif italic text-xs text-stone-600 mt-2">
              Please let us know by the first of August, 2026
            </p>
            <div className="w-16 h-0.5 bg-[#C5A059]/40 mx-auto mt-3 rounded-full" />
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#5C6B50] mx-auto animate-pulse" />
              <h3 className="font-serif text-2xl text-[#2A2F2B]">
                Merci Beaucoup!
              </h3>
              <p className="font-serif italic text-stone-600 text-sm">
                Your response has been warmly received. We look forward to celebrating together in Antibes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block font-serif text-xs uppercase tracking-wider text-[#5C6B50] font-semibold mb-1">
                  Guest Name(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord & Lady Hamilton"
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  className="w-full bg-transparent border-b border-[#C5A059]/60 px-1 py-2 text-stone-800 font-serif italic text-base focus:border-[#722F37] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-serif text-xs uppercase tracking-wider text-[#5C6B50] font-semibold mb-2">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: "hadir" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-serif italic transition-all ${
                      formData.attendance === "hadir"
                        ? "border-[#722F37] bg-[#722F37]/10 text-[#722F37] font-bold"
                        : "border-[#C5A059]/40 text-stone-600 hover:border-[#C5A059]"
                    }`}
                  >
                    Delighted to Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: "tidak_hadir" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-serif italic transition-all ${
                      formData.attendance === "tidak_hadir"
                        ? "border-[#722F37] bg-[#722F37]/10 text-[#722F37] font-bold"
                        : "border-[#C5A059]/40 text-stone-600 hover:border-[#C5A059]"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif text-xs uppercase tracking-wider text-[#5C6B50] font-semibold mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={formData.guest_count}
                    onChange={(e) => setFormData({ ...formData, guest_count: Number(e.target.value) })}
                    className="w-full bg-transparent border-b border-[#C5A059]/60 px-1 py-2 text-stone-800 font-serif text-sm focus:border-[#722F37] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-serif text-xs uppercase tracking-wider text-[#5C6B50] font-semibold mb-1">
                    Meal Preference
                  </label>
                  <select
                    value={formData.meal_preference}
                    onChange={(e) => setFormData({ ...formData, meal_preference: e.target.value })}
                    className="w-full bg-transparent border-b border-[#C5A059]/60 px-1 py-2 text-stone-800 font-serif text-sm focus:border-[#722F37] focus:outline-none"
                  >
                    <option value="French Mediterranean">French Mediterranean</option>
                    <option value="Vegetarian Gourmand">Vegetarian Gourmand</option>
                    <option value="Vegan Provençal">Vegan Provençal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-serif text-xs uppercase tracking-wider text-[#5C6B50] font-semibold mb-1">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gluten-free, nut allergy, shellfish"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full bg-transparent border-b border-[#C5A059]/60 px-1 py-2 text-stone-800 font-serif italic text-sm focus:border-[#722F37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-serif text-xs uppercase tracking-wider text-[#5C6B50] font-semibold mb-1">
                  Message for the Couple
                </label>
                <textarea
                  rows={2}
                  placeholder="Warm wishes or song requests..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-[#C5A059]/60 px-1 py-2 text-stone-800 font-serif italic text-sm focus:border-[#722F37] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-[#722F37] hover:bg-[#5C232A] text-[#FAF4EC] font-serif uppercase tracking-[0.25em] text-xs font-semibold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Sending..." : "Send Response"}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};

export default RSVPSection;
