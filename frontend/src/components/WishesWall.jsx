import React, { useState } from 'react';
import { Heart, Send, Sparkles, MessageSquare } from 'lucide-react';
import { WeddingService } from '../services/api';

export default function WishesWall({ initialWishes = [] }) {
  const [wishes, setWishes] = useState(initialWishes);
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState("Bride's Family");
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handlePostWish = async (e) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const newWish = await WeddingService.submitWish({
        senderName: senderName.trim(),
        relation: relation,
        message: message.trim()
      });

      setWishes([newWish, ...wishes]);
      setSenderName('');
      setMessage('');
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch (err) {
      alert('Unable to post blessing at this moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      <div className="text-center max-w-xl mx-auto mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
          <Heart className="w-3 h-3 text-rani-500 fill-rani-500" />
          The Wishing Well
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-1">
          Blessings & Wishes For The Couple
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch max-h-[80vh]">
        
        {/* Wish Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-gold-300 p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold-600" />
              Write a Blessing
            </h3>
            <p className="text-[11px] text-charcoal/60 mb-3">
              Your words will be preserved in our digital family wedding album.
            </p>

            {successNotice && (
              <div className="mb-3 p-2.5 bg-green-50 border border-green-300 rounded-lg text-green-800 text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>Blessing added to the wishing well!</span>
              </div>
            )}

            <form onSubmit={handlePostWish} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-0.5">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masi & Mausa ji"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-0.5">Relationship</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="Bride's Family">Bride's Family (Ladkiwale)</option>
                  <option value="Groom's Family">Groom's Family (Ladkewale)</option>
                  <option value="Close Friend">Close Friend</option>
                  <option value="Colleague">Colleague / Work Family</option>
                  <option value="Well-wisher">Well-wisher</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-0.5">Your Blessing *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your sweet blessing..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-gold-gradient text-white font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting...' : 'Post Blessing'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Wishes List Cards (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl border border-gold-300 p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal/70 mb-2 px-1">
            <span className="font-bold uppercase tracking-wider text-gold-800">Recent Blessings</span>
            <span className="font-mono">{wishes.length} Messages</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-1">
            {wishes.map((wish, index) => (
              <div
                key={wish.id || index}
                className="bg-white rounded-xl border border-gold-200 p-3.5 shadow-sm hover:border-gold-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal">{wish.senderName}</h4>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-medium bg-gold-50 text-gold-800 border border-gold-200">
                      {wish.relation || "Well-wisher"}
                    </span>
                  </div>
                  <Heart className="w-3.5 h-3.5 text-rani-500 fill-rani-500/20 shrink-0" />
                </div>

                <p className="text-xs text-charcoal/80 leading-relaxed font-light italic mt-1">
                  "{wish.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
