import React from 'react';
import { Phone, MessageCircle, MapPin, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#070A11] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-base">
                CL
              </div>
              <span className="font-display text-xl font-bold text-white">
                {CAFE_INFO.name}
              </span>
            </div>
            
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Artisanal contemporary dining nestled inside the National Crafts Museum. 
              Reviving regional Indian recipes, indigenous grains, and timeless cooking techniques.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={`tel:${CAFE_INFO.phoneRaw}`}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-200 hover:text-amber-400 hover:border-amber-400/40 transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span className="font-mono">{CAFE_INFO.phone}</span>
              </a>

              <a
                href={`https://wa.me/${CAFE_INFO.whatsappRaw}?text=${encodeURIComponent('Hi Cafe Lota, I would like to reserve a table.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 hover:text-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Explore
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Signature Menu
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Regional Curries
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition-colors">
                  Guest Reviews
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-amber-400 transition-colors">
                  Location & Hours
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  Reserve Table
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Timings */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Visit Us
            </p>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{CAFE_INFO.address}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400">Timings:</span>{' '}
                <strong className="text-white font-mono">{CAFE_INFO.openingHours}</strong>
                <p className="text-[11px] text-slate-400">Open 7 days a week</p>
              </div>
            </div>
          </div>

          {/* Staff Access & Concierge */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Staff & Operations
            </p>
            <p className="text-slate-400 text-xs">
              Direct access for restaurant reservation management, guest arrival status, and seating allocation.
            </p>
            
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-amber-400/40 text-slate-200 hover:text-amber-300 transition-colors text-xs font-semibold cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Management Portal</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} {CAFE_INFO.name}. All rights reserved. Craft Museum Village Complex, Pragati Maidan.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAdmin}
              className="hover:text-slate-300 transition-colors"
            >
              Admin Gate (admin/1234)
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
