import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Calendar } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';

interface TopBarProps {
  onOpenBooking: (serviceName?: string) => void;
  onOpenAdmin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenBooking, onOpenAdmin }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090D16]/85 border-b border-white/10 transition-all duration-200">
      {/* Top Utility & Operational Bar */}
      <div className="w-full bg-slate-950/80 border-b border-white/5 px-4 lg:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Live Operational Status & Address */}
          <div className="flex items-center flex-wrap gap-4 text-slate-300">
            {/* Live Status Badge */}
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <span className="font-semibold text-emerald-400">Open Now</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 hidden sm:inline">{CAFE_INFO.openingHours} (All Days)</span>
            </div>

            <span className="text-slate-700 hidden md:inline">|</span>

            {/* Address Tag with Maps Link */}
            <a 
              href={CAFE_INFO.mapsLink} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors group truncate max-w-xs sm:max-w-md"
              title="View on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">{CAFE_INFO.shortAddress}</span>
            </a>
          </div>

          {/* Quick Actions: Call, WhatsApp, Admin Link */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Direct Phone Call Button */}
            <a
              href={`tel:${CAFE_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/50 hover:bg-slate-800 transition-all"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="font-mono">{CAFE_INFO.phone}</span>
            </a>

            {/* Direct WhatsApp Action Link */}
            <a
              href={`https://wa.me/${CAFE_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Café Lota, I would like to inquire about a table reservation.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-900/60 transition-all"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Discrete Admin Link */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-amber-300 transition-colors ml-1 text-[11px] opacity-80 hover:opacity-100"
              title="Protected Restaurant Staff Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-lg group-hover:border-amber-400/60 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            CL
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              {CAFE_INFO.name}
            </span>
            <span className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
              National Crafts Museum
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#menu" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Artisanal Menu
          </a>
          <a href="#experiences" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Experiences
          </a>
          <a href="#reviews" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Guest Reviews
          </a>
          <a href="#location" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Visit & Hours
          </a>
        </nav>

        {/* Zone 3: Primary Conversion CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_24px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>Book Now / Reserve</span>
          </button>
        </div>
      </div>
    </header>
  );
};
