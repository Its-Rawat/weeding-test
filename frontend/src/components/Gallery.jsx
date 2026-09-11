import React, { useState } from 'react';
import { Camera, X, Sparkles } from 'lucide-react';

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      title: "Royal Portraits by Lake Pichola",
      category: "Pre-Wedding"
    },
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      title: "Golden Hour Sunset Glow",
      category: "Candid Moments"
    },
    {
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      title: "The Radiant Bride",
      category: "Bridal Splendor"
    },
    {
      url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80",
      title: "Auspicious Celebrations",
      category: "Traditional Rites"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      title: "Hand in Hand Together",
      category: "Love Story"
    },
    {
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
      title: "Udaipur Heritage Architecture",
      category: "Udaipur Heritage"
    }
  ];

  const categories = ['All', 'Pre-Wedding', 'Bridal Splendor', 'Candid Moments'];

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      <div className="text-center max-w-xl mx-auto mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
          <Camera className="w-3 h-3 text-gold-700" />
          Captured Memories
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-1">
          Photo Gallery
        </h2>
      </div>

      {/* Category Filter Pills */}
      <div className="flex justify-center gap-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              activeCategory === cat
                ? 'bg-gold-500 text-white border-gold-600 shadow-sm'
                : 'bg-white text-charcoal/70 border-gold-200 hover:bg-gold-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Fitted Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
        {filteredImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhoto(img)}
            className="group relative overflow-hidden rounded-xl border border-gold-200 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 h-44 sm:h-52"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
              <span className="text-[9px] uppercase tracking-widest text-gold-300 font-bold">
                {img.category}
              </span>
              <h4 className="font-serif font-bold text-xs mt-0.5 leading-tight">{img.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-h-[75vh] w-auto rounded-xl shadow-2xl object-contain border border-gold-400/40"
            />
            <div className="text-center mt-3 text-white">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">{selectedPhoto.category}</span>
              <h3 className="text-xl font-serif font-bold mt-0.5">{selectedPhoto.title}</h3>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
