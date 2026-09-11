import React, { useState } from 'react';
import { X, CheckCircle, Heart, Sparkles, User, Mail, Phone, Calendar, Utensils, Music, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingService } from '../services/api';

export default function RsvpModal({ isOpen, onClose, onRsvpSubmitted, onViewPass }) {
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-2xl border border-gold-400/70 p-6 sm:p-8 my-8 text-charcoal max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal/50 hover:text-charcoal hover:bg-gold-50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

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
                ? `We are delighted to celebrate this auspicious occasion with you. Your pass for ${submittedRsvp.guestCount} guest(s) is ready!`
                : "Thank you for letting us know. You will be dearly missed, and your warm blessings mean everything to us."}
            </p>

            {submittedRsvp.attendingStatus === 'ATTENDING' && (
              <div className="mt-6 p-4 rounded-xl bg-gold-50/70 border border-gold-300 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Passcode:</span>
                  <span className="font-mono font-bold text-gold-800">{submittedRsvp.inviteCode || 'DIDI2026'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Guests:</span>
                  <span className="font-semibold text-charcoal">{submittedRsvp.guestCount} Member(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Dietary:</span>
                  <span className="font-semibold text-charcoal">{submittedRsvp.dietaryPreference}</span>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {submittedRsvp.attendingStatus === 'ATTENDING' && (
                <button
                  onClick={() => {
                    onClose();
                    if (onViewPass) onViewPass(submittedRsvp);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  View Digital Pass & QR
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-charcoal/30 hover:bg-gray-50 text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* RSVP FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center border-b border-gold-200 pb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Shubh Vivah Invitation</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-0.5">
                Wedding RSVP & Preferences
              </h2>
              <p className="text-xs text-charcoal/60 mt-1">
                Please respond by November 10, 2026 to help us make hospitality arrangements.
              </p>
            </div>

            {/* Attendance Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2">
                Will you be attending? *
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

            {/* Guest Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Primary Guest Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya Verma"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Total Guest Headcount (Including you)
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                {/* Attending Ceremonies */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2">
                    Which events will you join?
                  </label>
                  <div className="space-y-2">
                    {ceremonyOptions.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gold-50/50 cursor-pointer border border-transparent hover:border-gold-200 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.attendingEvents.includes(item.id)}
                          onChange={() => handleCheckbox(item.id)}
                          className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500 border-gold-300"
                        />
                        <span className="text-xs font-medium text-charcoal">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dietary Choice & Sangeet Song */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Dietary Preference
                    </label>
                    <select
                      value={formData.dietaryPreference}
                      onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="PURE_VEG">Pure Vegetarian (Indian & International)</option>
                      <option value="JAIN_VEG">Jain Vegetarian (No onion / garlic / root veg)</option>
                      <option value="NON_VEG">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Sangeet Song Recommendation
                    </label>
                    <div className="relative">
                      <Music className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Gallan Goodiyan, London Thumakda"
                        value={formData.songRequest}
                        onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Blessing Message */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Warm Blessing or Message for Chandrika & Xudong
              </label>
              <textarea
                rows={3}
                placeholder="Share your love, congratulations, or special memories..."
                value={formData.blessingMessage}
                onChange={(e) => setFormData({ ...formData, blessingMessage: e.target.value })}
                className="w-full p-3 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gold-gradient text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Submitting RSVP...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete My RSVP</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
