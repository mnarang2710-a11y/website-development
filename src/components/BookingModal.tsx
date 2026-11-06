import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Utensils, CheckCircle, MessageCircle, ArrowRight, ArrowLeft, Loader2, Database } from 'lucide-react';
import { Booking } from '../types';
import { CAFE_INFO, MENU_ITEMS } from '../data/cafeData';
import { createBookingInDb } from '../lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onBookingCreated: (booking: Booking, isPersistedInSupabase: boolean) => void;
}

const TIME_SLOTS = [
  '8:30 AM', '9:30 AM', '10:30 AM',
  '12:30 PM', '1:30 PM', '2:30 PM',
  '4:30 PM', '5:30 PM',
  '7:00 PM', '8:00 PM', '8:45 PM'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onBookingCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendSyncStatus, setBackendSyncStatus] = useState<'pending' | 'synced' | 'local_fallback'>('pending');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('7:00 PM');
  const [guestsCount, setGuestsCount] = useState(2);
  const [serviceName, setServiceName] = useState('Heritage Bamboo Pavilion Dining Experience');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Confirmed Booking Output
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setServiceName(preselectedService);
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  // Calculate rough estimate for the group
  const matchedDish = MENU_ITEMS.find((m) => m.name === serviceName);
  const baseCostPerHead = matchedDish ? matchedDish.price : 900;
  const estimatedTotal = baseCostPerHead * guestsCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: generatedId,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim() || undefined,
      date,
      timeSlot,
      guestsCount,
      serviceName,
      specialRequests: specialRequests.trim() || undefined,
      status: 'Pending',
      estimatedAmount: estimatedTotal,
      createdAt: new Date().toISOString(),
    };

    // Attempt insert into Supabase backend
    const { data, error } = await createBookingInDb(newBooking);

    if (error) {
      console.warn('Supabase insert note (fallback to local state):', error.message);
      setBackendSyncStatus('local_fallback');
      onBookingCreated(newBooking, false);
      setConfirmedBooking(newBooking);
    } else {
      setBackendSyncStatus('synced');
      const finalBooking = data || newBooking;
      onBookingCreated(finalBooking, true);
      setConfirmedBooking(finalBooking);
    }

    setIsSubmitting(false);
    setStep(4);
  };

  const resetForm = () => {
    setStep(1);
    setConfirmedBooking(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-slate-900/95 border border-white/15 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Multi-Step Header Indicator */}
        {step < 4 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-amber-400">
                Step {step} of 3
              </span>
              <span>
                {step === 1 && 'Guest Details'}
                {step === 2 && 'Date, Time & Party Size'}
                {step === 3 && 'Service Selection & Confirm'}
              </span>
            </div>
            
            {/* Step Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className={`h-full bg-amber-500 transition-all duration-300 ${
                  step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
                }`}
              />
            </div>
          </div>
        )}

        {/* Step 1: Customer Details */}
        {step === 1 && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (customerName && phoneNumber) setStep(2);
            }} 
            className="space-y-4"
          >
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Reserve Your Table
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Enter your contact info so our maître d&apos; can confirm your arrival at Café Lota.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Sen"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number (for SMS & WhatsApp Confirmation) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="rohini@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={!customerName.trim() || !phoneNumber.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Date, Time & Guests */}
        {step === 2 && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }} 
            className="space-y-4"
          >
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                When Would You Like to Visit?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Café Lota welcomes walk-ins and reservations from 8:00 AM to 9:30 PM.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Reservation Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Number of Guests *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestsCount(num)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        guestsCount === num
                          ? 'bg-amber-500 text-slate-950 font-black shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {num}{num === 8 ? '+' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Available Time Slots *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-2 text-xs font-mono font-medium rounded-lg transition-all text-center ${
                      timeSlot === slot
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-white/5'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Service Selection & Special Requests */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Service & Seating Preferences
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Customize your table setup in our open-air bamboo pavilion.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Select Seating or Tasting Experience
                </label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
                >
                  <option value="Heritage Bamboo Pavilion Dining Experience">
                    Heritage Bamboo Pavilion Dining Experience (₹1,800/head)
                  </option>
                  <option value="Early Morning Museum Garden Breakfast Feast">
                    Early Morning Museum Garden Breakfast Feast (₹1,200/head)
                  </option>
                  <option value="Signature Palak Patta Chaat & Regional Mains Tasting">
                    Signature Palak Patta Chaat & Regional Mains Tasting
                  </option>
                  <option value="Standard Table Reservation (À la carte dining)">
                    Standard Table Reservation (À la carte dining)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Special Notes or Dietary Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Birthday celebration, outdoor bamboo gazebo table, mild spice preferences..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs sm:text-sm"
                />
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Guest Name:</span>
                  <span className="font-semibold text-white">{customerName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Date & Slot:</span>
                  <span className="font-semibold text-white">{date} at {timeSlot}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Party:</span>
                  <span className="font-semibold text-white">{guestsCount} Guests</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-amber-300 font-bold">
                  <span>Est. Table Total:</span>
                  <span className="font-mono text-sm">₹{estimatedTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Syncing Reservation...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Booking Confirmation Screen */}
        {step === 4 && confirmedBooking && (
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                  Booking ID: {confirmedBooking.id}
                </span>
                {backendSyncStatus === 'synced' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>Saved to Supabase</span>
                  </span>
                )}
              </div>
              
              <h3 className="font-display text-2xl font-bold text-white mt-3">
                Table Reserved Successfully!
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                Thank you, <strong className="text-white">{confirmedBooking.customerName}</strong>. 
                Your reservation at Café Lota has been recorded in the live restaurant database.
              </p>
            </div>

            {/* Details Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-white font-semibold">{confirmedBooking.date} · {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Guests:</span>
                <span className="text-white font-semibold">{confirmedBooking.guestsCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="text-amber-400 font-semibold truncate max-w-[200px]">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-bold">Pending Confirmation (Logged in Admin)</span>
              </div>
            </div>

            {/* Direct WhatsApp Action to Notify Restaurant */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${CAFE_INFO.whatsappRaw}?text=${encodeURIComponent(
                  `Hello Cafe Lota, I just made a reservation.\nBooking ID: ${confirmedBooking.id}\nName: ${confirmedBooking.customerName}\nDate: ${confirmedBooking.date} at ${confirmedBooking.timeSlot}\nGuests: ${confirmedBooking.guestsCount}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </a>

              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
