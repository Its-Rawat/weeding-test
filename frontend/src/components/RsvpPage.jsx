import React, { useState } from 'react';
import { CheckCircle, Heart, Sparkles, User, Mail, Phone, Calendar, Music, ShieldCheck, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingService } from '../services/api';

export default function RsvpPage({ onRsvpSubmitted, onViewPass, onNavigate }) {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    attendingStatus: 'ATTENDING',
    guestCount: 2,
    attendingEvents: ['Mehendi', 'Haldi', 'Sangeet', 'Phere', 'Reception'],
    dietaryPreference: 'PURE_VEG',
    songRequest: '',
    blessingMessage: '',
    inviteCode: 'DIDI2026'
  });

  const [loading, setLoading] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState(null);

  const ceremonyOptions = [
    { id: 'Mehendi', label: 'Mehndi Carnival (Nov 26)' },
    { id: 'Haldi', label: 'Haldi & Phoolon Ki Holi (Nov 27)' },
    { id: 'Sangeet', label: 'Sangeet & Cocktail Night (Nov 27)' },
    { id: 'Phere', label: 'Baraat & Vivah Sanskar (Nov 28)' },
    { id: 'Reception', label: 'Royal Gala Banquet (Nov 28)' },
  ];

  const handleCheckbox = (id) => {
    setFormData(prev => {
      const exists = prev.attendingEvents.includes(id);
      const updated = exists
        ? prev.attendingEvents.filter(item => item !== id)
        : [...prev.attendingEvents, id];
      return { ...prev, attendingEvents: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        attendingEvents: formData.attendingEvents.join(', ')
      };

      const result = await WeddingService.submitRsvp(payload);
      setSubmittedRsvp(result);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#B73239', '#F39C12', '#FFFFFF', '#E67E22']
      });

      if (onRsvpSubmitted) {
        onRsvpSubmitted(result);
      }
    } catch (err) {
      alert(err.message || 'Unable to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      <div className="bg-white rounded-2xl border-2 border-gold-300 shadow-xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        {submittedRsvp ? (
          /* SUCCESS STATE */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-500 mx-auto flex items-center justify-center text-green-600 mb-4 shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-gold-700">RSVP Confirmed</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-1">
              Thank You, {submittedRsvp.guestName}!
            </h3>

            <p className="mt-3 text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
              {submittedRsvp.attendingStatus === 'ATTENDING'
                ? `We are overjoyed to celebrate this sacred union with you. Your invitation pass for ${submittedRsvp.guestCount} guest(s) is ready!`
                : "Thank you for letting us know. You will be warmly remembered in our celebrations."}
            </p>

            {submittedRsvp.attendingStatus === 'ATTENDING' && (
              <div className="mt-6 p-4 rounded-xl bg-gold-50 border border-gold-300 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Digital Passcode:</span>
                  <span className="font-mono font-bold text-gold-800">{submittedRsvp.inviteCode || 'DIDI2026'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Guests Count:</span>
                  <span className="font-semibold text-charcoal">{submittedRsvp.guestCount} Member(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Dietary Choice:</span>
                  <span className="font-semibold text-charcoal">{submittedRsvp.dietaryPreference}</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {submittedRsvp.attendingStatus === 'ATTENDING' && (
                <button
                  onClick={() => {
                    if (onViewPass) onViewPass(submittedRsvp);
                    if (onNavigate) onNavigate('pass');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  View & Download Digital Pass
                </button>
              )}

              <button
                onClick={() => setSubmittedRsvp(null)}
                className="px-5 py-2.5 rounded-xl border border-charcoal/30 hover:bg-gray-50 text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Submit Another RSVP
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center border-b border-gold-200 pb-3">
              <span className="text-[11px] uppercase tracking-widest font-bold text-gold-700">Official Invitation</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-0.5">
                Kindly Respond (RSVP)
              </h2>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Please confirm your attendance & meal preferences by November 10, 2026.
              </p>
            </div>

            {/* Attendance Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2">
                Will you join us in Udaipur? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendingStatus: 'ATTENDING' })}
                  className={`py-3 px-4 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    formData.attendingStatus === 'ATTENDING'
                      ? 'border-gold-500 bg-gold-50 text-gold-900 shadow-sm'
                      : 'border-gray-200 hover:border-gold-300 text-charcoal/60'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rani-600 fill-rani-600" />
                  Joyfully Accept
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendingStatus: 'DECLINED' })}
                  className={`py-3 px-4 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    formData.attendingStatus === 'DECLINED'
                      ? 'border-charcoal bg-gray-100 text-charcoal shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-charcoal/60'
                  }`}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {/* Primary Guest Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Full Name of Guest *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram & Sunita Sharma"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Phone (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Total Headcount (Including you)
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests (Couple / Plus One)</option>
                  <option value={3}>3 Guests (Family)</option>
                  <option value={4}>4 Guests (Family)</option>
                  <option value={5}>5 Guests (Family)</option>
                </select>
              </div>
            </div>

            {formData.attendingStatus === 'ATTENDING' && (
              <>
                {/* Attending Functions */}
                <div className="pt-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1.5">
                    Functions Attending
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {ceremonyOptions.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gold-50 cursor-pointer border border-gold-100"
                      >
                        <input
                          type="checkbox"
                          checked={formData.attendingEvents.includes(item.id)}
                          onChange={() => handleCheckbox(item.id)}
                          className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500 border-gold-300"
                        />
                        <span className="font-medium text-charcoal">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dietary & Song */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Catering / Dietary Preference
                    </label>
                    <select
                      value={formData.dietaryPreference}
                      onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="PURE_VEG">Pure Vegetarian (Indian & Continental)</option>
                      <option value="JAIN_VEG">Jain Vegetarian (No onion / garlic / root veg)</option>
                      <option value="NON_VEG">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Sangeet Song Request
                    </label>
                    <div className="relative">
                      <Music className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Gallan Goodiyan, Nachde Ne Saare"
                        value={formData.songRequest}
                        onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Blessing Note */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Auspicious Blessing for Chandrika & Xudong
              </label>
              <textarea
                rows={2}
                placeholder="Share your loving congratulations..."
                value={formData.blessingMessage}
                onChange={(e) => setFormData({ ...formData, blessingMessage: e.target.value })}
                className="w-full p-2.5 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gold-gradient text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Submitting Your RSVP...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit My Wedding RSVP</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
