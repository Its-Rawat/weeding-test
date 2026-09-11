import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, HelpCircle, Check, Info } from 'lucide-react';

export default function TraditionsGuidePage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('traditions');

  const traditions = [
    {
      name: "Mehndi & Henna Ceremony",
      meaning: "A celebration where the bride's hands and feet are adorned with intricate herbal henna patterns symbolizing love, prosperity, and auspicious fortune.",
      etiquette: "Feel free to get custom henna applied by the visiting artists! Wear comfortable ethnic or Indo-western attire in greens or pastel shades.",
      accent: "Vibrant Greens"
    },
    {
      name: "Haldi (Turmeric) & Flower Shower",
      meaning: "An ancient purification ritual where elders and loved ones apply fragrant golden turmeric paste to Chandrika & Xudong, followed by a shower of fresh yellow marigolds.",
      etiquette: "Wear bright sunny yellow, ochre, or orange. Be prepared for playful flower showers and joyful music!",
      accent: "Sunny Yellows"
    },
    {
      name: "Baraat & Varmala (Grand Entry)",
      meaning: "The groom arrives with a live brass band, dancing procession, and royal vintage carriage. The bride makes her grand entrance, followed by the exchange of floral garlands.",
      etiquette: "Join in the baraat procession and dance with the groom's and bride's families! Royal traditional silks or festive formal attire.",
      accent: "Royal Jewel Tones"
    },
    {
      name: "Vivah Sanskar & 7 Phere (The Sacred Vows)",
      meaning: "The couple takes seven sacred steps around the holy agni (sacred fire), promising love, companionship, mutual respect, and lifelong loyalty.",
      etiquette: "Shoes are removed before entering the mandap seating. Silence and warmth during the sacred Sanskrit chanting and Kanyadaan.",
      accent: "Banarasi Silks & Gold"
    },
    {
      name: "Intercultural Celebration & Royal Banquet",
      meaning: "Uniting the heritage traditions of Chandrika and Xudong with celebratory toasts, multi-course feast, cake cutting, and joyous dancing.",
      etiquette: "Black tie or formal evening attire. Custom dining arrangements for Pure Veg, Jain, and fine international specialties.",
      accent: "Evening Black Tie / Formals"
    }
  ];

  const faqs = [
    {
      q: "What is the dress code for guests from abroad?",
      a: "Both traditional Indian attire (Kurta-pyjama, Sherwani, Sarees, Lehengas) and Western formal wear (suits, cocktail dresses) are celebrated! We recommend comfortable shoes for lawn events."
    },
    {
      q: "How are dietary choices handled?",
      a: "Catering for our 100 guests is fully bespoke. Pure Vegetarian, Jain Vegetarian (no onion/garlic), and non-vegetarian menus are prepared in separate kitchens with strict hygiene."
    },
    {
      q: "Are airport shuttles provided in Udaipur?",
      a: "Yes! Dedicated royal shuttles will meet guests at Maharana Pratap Airport (UDR) and Udaipur City Railway Station on November 26 & 27."
    },
    {
      q: "Can uninvited guests attend?",
      a: "To maintain an intimate and safe royal experience, attendance is strictly restricted to the 100 invited guests with verified QR passes."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      <div className="text-center max-w-2xl mx-auto mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
          <BookOpen className="w-3.5 h-3.5 text-gold-700" />
          Guide for 100 Guests
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-1">
          Cultural Traditions & Guest Etiquette
        </h2>
        <p className="text-xs text-charcoal/60 mt-0.5">
          Everything our 100 closest family & friends need to know to celebrate Chandrika & Xudong.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('traditions')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'traditions'
              ? 'bg-gold-500 text-white border-gold-600 shadow-sm'
              : 'bg-white text-charcoal/70 border-gold-200 hover:bg-gold-50'
          }`}
        >
          Ceremonies & Dress Codes
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'faq'
              ? 'bg-gold-500 text-white border-gold-600 shadow-sm'
              : 'bg-white text-charcoal/70 border-gold-200 hover:bg-gold-50'
          }`}
        >
          Guest FAQs & Tips
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'traditions' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[62vh] overflow-y-auto p-1">
          {traditions.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gold-200 p-4 shadow-sm hover:border-gold-400 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-serif font-bold text-base text-charcoal">{t.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold-50 text-gold-900 border border-gold-200">
                    {t.accent}
                  </span>
                </div>
                <p className="text-xs text-charcoal/75 leading-relaxed font-light mb-2.5">
                  {t.meaning}
                </p>
              </div>

              <div className="pt-2 border-t border-gold-100 flex items-start gap-1.5 text-[11px] text-charcoal/80 bg-gold-50/50 p-2 rounded-lg">
                <Info className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                <span><strong>Guest Attire & Tip:</strong> {t.etiquette}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[62vh] overflow-y-auto p-1">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gold-200 p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="font-serif font-bold text-sm text-charcoal mb-1 flex items-start gap-1.5">
                  <HelpCircle className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                  <span>{f.q}</span>
                </h4>
                <p className="text-xs text-charcoal/70 leading-relaxed font-light pl-5">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-3">
        <button
          onClick={() => onNavigate('rsvp')}
          className="px-5 py-2 bg-gold-gradient text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5"
        >
          <span>Verify Email & RSVP for Your Family →</span>
        </button>
      </div>

    </div>
  );
}
