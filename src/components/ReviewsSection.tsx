import React from 'react';
import { Star, Quote, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { CAFE_INFO, REVIEWS_DATA } from '../data/cafeData';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 lg:py-24 bg-slate-950/40 relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header & Overall Metric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Heart className="w-3.5 h-3.5 fill-amber-400" />
              <span>Verified Diner Experiences</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Praised by Critics & Diners Alike
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              From Delhi food lovers seeking tranquil outdoor dining to international culinary travelers 
              exploring India&apos;s biodiversity through food.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md shadow-lg flex items-center gap-4">
              <div className="text-3xl font-display font-bold text-amber-400">
                {CAFE_INFO.rating}
              </div>
              <div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Over {CAFE_INFO.reviewCount.toLocaleString()} Google & Food Reviews
                </p>
              </div>
            </div>

            <a
              href={CAFE_INFO.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
            >
              <span>View live ratings on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 hover:border-amber-500/30 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Rating stars & relative time */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">{rev.relativeTime}</span>
                </div>

                {/* Review Text */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic relative">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>
              </div>

              {/* Author & Favorite Dish Tag */}
              <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{rev.author}</p>
                  <span className="text-[10px] text-slate-400">{rev.visitType}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">Favorite: {rev.favoriteDish}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ambient Banner featuring Crafts Museum Courtyard */}
        <div className="mt-14 rounded-2xl overflow-hidden border border-white/10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center bg-slate-900/70 backdrop-blur-md">
            <div className="lg:col-span-7 p-8 sm:p-10 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                The Heritage Setting
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                An Oasis of Craft, Clay & Greenery in Central Delhi
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Step away from the bustle of Mathura Road and Pragati Maidan. Café Lota is set inside 
                the tranquil open courtyards of the National Crafts Museum, featuring terracotta water lotas, 
                woven cane seating, and lush tropical foliage.
              </p>
              <div className="flex items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Museum Entry Free to Café</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Open Air & Semi-Covered Seating</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
              <img
                src={CAFE_INFO.ambienceImage}
                alt="Café Lota tranquil museum ambience"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 lg:from-slate-900 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
