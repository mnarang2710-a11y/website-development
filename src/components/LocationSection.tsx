import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Navigation, ExternalLink, Calendar, Car } from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';

interface LocationSectionProps {
  onOpenBooking: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="location" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Visit Us in Central Delhi
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Operational Hours & Directions
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Located in Pragati Maidan on Bhairon Marg. Accessible directly via Gate No. 2 of the National Crafts Museum.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Essential Visitor Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Our Address</span>
              </div>
              <p className="text-white font-medium text-base leading-snug">
                {CAFE_INFO.address}
              </p>
              <p className="text-xs text-slate-400">
                Landmark: Directly inside Gate No. 2, National Crafts Museum, near Supreme Court Metro Station.
              </p>
              
              <div className="pt-2">
                <a
                  href={CAFE_INFO.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Operational Hours</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                  Open Today
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">Monday – Sunday</span>
                  <span className="text-white font-mono font-semibold">{CAFE_INFO.openingHours}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Serving breakfast from 8:00 AM, lunch from 12:30 PM, hi-tea, and dinner until 9:30 PM.
                </p>
              </div>
            </div>

            {/* Direct Contact & Instant Reservation */}
            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Concierge & Reservations</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${CAFE_INFO.phoneRaw}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call {CAFE_INFO.phone}</span>
                </a>
                
                <a
                  href={`https://wa.me/${CAFE_INFO.whatsappRaw}?text=${encodeURIComponent('Hi Cafe Lota, I would like to reserve a table.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-bold border border-emerald-500/30 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Table Online</span>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Map Preview & Travel Advice */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 overflow-hidden">
            
            {/* Styled Map Container */}
            <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-white/10 bg-slate-950">
              {/* Google Maps Embed iframe with Cafe Lota coordinates */}
              <iframe
                title="Café Lota Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5028045610815!2d77.2399251!3d28.6136111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce327c505fa3f%3A0xeb4addd9e7c6f11b!2sCafe%20Lota!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter invert-[0.9] hue-rotate-[180deg] contrast-[1.2] opacity-85 hover:opacity-100 transition-opacity"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-slate-950/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-semibold text-white">Café Lota, Pragati Maidan</span>
                </div>
                <a
                  href={CAFE_INFO.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-bold underline"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Useful Travel & Parking Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Parking Facilities</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Ample dedicated parking is available at the National Crafts Museum main gate on Bhairon Marg.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Navigation className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Metro Connectivity</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    1.2 km from Supreme Court Metro Station (Blue Line) with readily available e-rickshaws.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
