import React from 'react';
import { Star, Calendar, ArrowRight, UtensilsCrossed, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & High-Converting CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Real Rating & Review Proof */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-sm">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-bold text-white ml-1">{CAFE_INFO.rating}</span>
                <span className="text-slate-400">/ 5</span>
              </div>
              <span className="text-slate-400 font-medium">
                Over <strong className="text-slate-200">{CAFE_INFO.reviewCount.toLocaleString()}+</strong> Google Reviews
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-emerald-400 font-medium hidden sm:inline">98% Recommended</span>
            </div>

            {/* High-Converting Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400/90">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Contemporary Regional Indian Dining</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance">
                Rediscover Forgotten Indian Recipes In an Open-Air Sanctuary.
              </h1>
            </div>

            {/* Value Propositions Based on Real Customer Reviews */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Nestled under the handcrafted bamboo pavilions of Delhi&apos;s National Crafts Museum, 
              Café Lota celebrates indigenous culinary traditions—from Uttarakhand&apos;s iron-simmered 
              <span className="text-amber-300 font-medium"> Bhatt Ki Churkani</span> to our legendary 
              <span className="text-amber-300 font-medium"> Palak Patta Chaat</span> and amaranth-crusted fish.
            </p>

            {/* Quick Proof Pills / Key Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 pb-2">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Atmosphere</p>
                <p className="text-sm font-semibold text-white mt-0.5">Bamboo Garden Courtyard</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Heritage Grains</p>
                <p className="text-sm font-semibold text-white mt-0.5">Millet & Amaranth Infused</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-sm col-span-2 sm:col-span-1">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Pricing</p>
                <p className="text-sm font-semibold text-white mt-0.5 font-mono">₹1,200 – ₹1,800 for two</p>
              </div>
            </div>

            {/* Primary & Secondary High-Impact Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-[0_6px_25px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.45)] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-slate-950" />
                <span>Book Now / Reserve</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#menu"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-white/15 hover:border-amber-400/40 text-slate-200 hover:text-white font-semibold text-base backdrop-blur-md transition-all cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Explore Artisanal Menu</span>
              </a>
            </div>

            {/* Trust Assurance */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Confirmation</span>
              </div>
              <span>·</span>
              <div>No pre-payment required</div>
              <span>·</span>
              <div>Free cancellation</div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group">
              
              {/* Main Ambient Restaurant Image */}
              <img
                src={CAFE_INFO.heroImage}
                alt="Café Lota open-air bamboo dining courtyard"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              
              {/* Subtle Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating Glassmorphic Signature Dish Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={CAFE_INFO.palakChaatImage}
                      alt="Palak Patta Chaat"
                      className="w-13 h-13 rounded-lg object-cover border border-amber-500/40 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Iconic Signature</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-sm font-bold text-white">Palak Patta Chaat</p>
                      <p className="text-xs text-slate-400 font-mono">₹460 · 4,800+ positive mentions</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onOpenBooking}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Taste Today
                  </button>
                </div>
              </div>

              {/* Top Corner Live Museum Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/10 text-xs text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>National Crafts Museum Gate 2</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
