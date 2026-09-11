import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, Globe } from 'lucide-react';

export default function CoupleStory({ onNavigate }) {
  const [activeStoryTab, setActiveStoryTab] = useState(0);

  const storyMilestones = [
    {
      year: "Spring 2021",
      title: "Across Cultures: When Chandrika Met Xudong",
      description: "A shared design project in London brought them together. What began over chai and bubble tea grew into endless discussions about architecture, travel, and how surprisingly similar their deep family values were.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "Autumn 2023",
      title: "The Sunset Proposal in Kyoto",
      description: "Surrounded by golden maple leaves in Kyoto, Xudong surprised Chandrika by asking for her hand with blessings warmly whispered from both families across continents.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "Winter 2024",
      title: "Two Families, One Shared Blessing",
      description: "A heartfelt family gathering where the Rawat and Zhang families celebrated with traditional sweets, tea ceremonies, and joyful toasts, deciding on a royal 100-guest celebration in Udaipur.",
      image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
          <Heart className="w-3 h-3 text-rani-500 fill-rani-500" />
          Intercultural Love Story
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mt-0.5">
          The Story of Chandrika & Xudong
        </h2>
      </div>

      {/* Bride & Groom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
        {/* The Bride */}
        <div className="bg-white rounded-xl border border-gold-300/80 p-3.5 shadow-sm flex items-center gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80"
            alt="The Bride - Chandrika"
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover object-top border-2 border-gold-400 shrink-0"
          />
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-rani-600">The Radiant Bride</span>
            <h3 className="text-lg font-serif font-bold text-charcoal">Chandrika Verma</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed font-light mt-0.5">
              Architect, classical music enthusiast, and the pride of her family. Excited to welcome our 100 closest loved ones to Udaipur.
            </p>
          </div>
        </div>

        {/* The Groom */}
        <div className="bg-white rounded-xl border border-gold-300/80 p-3.5 shadow-sm flex items-center gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            alt="The Groom - Xudong"
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover object-top border-2 border-gold-400 shrink-0"
          />
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">The Charming Groom</span>
            <h3 className="text-lg font-serif font-bold text-charcoal">Xudong Wang</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed font-light mt-0.5">
              Tech entrepreneur & avid traveler. Enthusiastic to embrace all Indian wedding rituals and dance at the Baraat!
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Spotlight Card */}
      <div className="bg-white rounded-2xl border-2 border-gold-300 shadow-md p-4 sm:p-5 flex flex-col md:flex-row items-center gap-5">
        
        {/* Milestone Image */}
        <div className="w-full md:w-5/12 h-40 sm:h-48 rounded-xl overflow-hidden relative shrink-0 shadow-inner">
          <img
            src={storyMilestones[activeStoryTab].image}
            alt={storyMilestones[activeStoryTab].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-charcoal/85 text-white px-2.5 py-0.5 rounded-full text-[11px] font-serif">
            {storyMilestones[activeStoryTab].year}
          </div>
        </div>

        {/* Milestone Narrative & Tabs */}
        <div className="w-full md:w-7/12 flex flex-col justify-between space-y-2.5">
          <div className="flex gap-2 border-b border-gold-200 pb-2">
            {storyMilestones.map((m, idx) => (
              <button
                key={m.year}
                onClick={() => setActiveStoryTab(idx)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  activeStoryTab === idx
                    ? 'bg-gold-500 text-white shadow-sm'
                    : 'bg-gold-50 text-charcoal/70 hover:bg-gold-100'
                }`}
              >
                {m.year}
              </button>
            ))}
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg text-charcoal">
              {storyMilestones[activeStoryTab].title}
            </h4>
            <p className="text-xs text-charcoal/75 leading-relaxed font-light mt-1">
              {storyMilestones[activeStoryTab].description}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] text-gold-800 font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-gold-600" />
              Two Heritage Traditions United
            </span>

            {onNavigate && (
              <button
                onClick={() => onNavigate('traditions')}
                className="py-1 px-3 rounded-lg bg-gold-gradient text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <span>Read Cultural Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
