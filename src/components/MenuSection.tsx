import React, { useState } from 'react';
import { Check, Clock, Sparkles, Plus, Calendar, Utensils } from 'lucide-react';
import { MENU_ITEMS } from '../data/cafeData';
import { MenuCategory, MenuItem } from '../types';

interface MenuSectionProps {
  onSelectServiceForBooking: (serviceName: string) => void;
}

const CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: 'all', label: 'All Curations' },
  { id: 'chaat', label: 'Chaat & Small Plates' },
  { id: 'mains', label: 'Regional Curries & Mains' },
  { id: 'breakfast', label: 'Breakfast & Hi-Tea' },
  { id: 'desserts', label: 'Artisanal Desserts' },
  { id: 'experiences', label: 'Curated Feasts & Tastings' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectServiceForBooking }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const filteredItems = MENU_ITEMS.filter((item) => {
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    const dietaryMatch = 
      dietaryFilter === 'all' ||
      (dietaryFilter === 'veg' && (item.dietary === 'veg' || item.dietary === 'vegan')) ||
      (dietaryFilter === 'non-veg' && item.dietary === 'non-veg');
    return categoryMatch && dietaryMatch;
  });

  return (
    <section id="menu" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Utensils className="w-3.5 h-3.5" />
              <span>Indigenous Regional Ingredients</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Artisanal Menu & Curated Experiences
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every dish honors a distinct geographic micro-climate in India, cooked in traditional 
              clay pots, cast iron, and tempered with regional cold-pressed oils.
            </p>
          </div>

          {/* Dietary Toggle Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 backdrop-blur-md self-start md:self-auto shrink-0">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dietaryFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Diets
            </button>
            <button
              onClick={() => setDietaryFilter('veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Vegetarian / Vegan</span>
            </button>
            <button
              onClick={() => setDietaryFilter('non-veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dietaryFilter === 'non-veg'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Coastal & Meats</span>
            </button>
          </div>
        </div>

        {/* Categorized Filtering Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-semibold'
                    : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Glassmorphic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/60 hover:bg-slate-900/85 backdrop-blur-md border border-white/10 hover:border-amber-400/30 p-6 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Optional Visual Image if available */}
              {item.image && (
                <div className="relative -mx-6 -mt-6 mb-5 h-48 rounded-t-2xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {item.isSignature && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Signature Classic</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-amber-300">
                    ₹{item.price}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="space-y-4">
                
                {/* Header row: Regional Origin & Dietary Indicator */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-amber-400/90 font-medium tracking-wide">
                    {item.regionalOrigin}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Dietary badge */}
                    <span 
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        item.dietary === 'veg' || item.dietary === 'vegan'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                          : 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dietary === 'non-veg' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      {item.dietary === 'vegan' ? 'Vegan' : item.dietary === 'veg' ? 'Veg' : 'Coastal'}
                    </span>
                  </div>
                </div>

                {/* Dish Title & Price (if not rendered on image) */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                    {!item.image && (
                      <span className="font-mono text-lg font-bold text-amber-400 shrink-0">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                  
                  {/* Duration Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Serving / Prep: {item.duration}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Clean Highlights with Checkmarks */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {item.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {item.category === 'experiences' ? 'Curated for Table' : 'Prepared Fresh'}
                </span>

                <button
                  onClick={() => onSelectServiceForBooking(item.name)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 hover:border-amber-500 text-xs font-bold transition-all cursor-pointer group/btn"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve Table</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* No results fallback */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-slate-900/40 border border-white/10">
            <p className="text-slate-400">No items match the current dietary filter.</p>
            <button
              onClick={() => { setDietaryFilter('all'); setActiveCategory('all'); }}
              className="mt-3 px-4 py-2 text-xs font-bold text-amber-400 underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
