import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPortal } from './components/AdminPortal';
import { Booking, BookingStatus } from './types';
import { INITIAL_MOCK_BOOKINGS } from './data/cafeData';
import { 
  getBookingsFromDb, 
  updateBookingStatusInDb, 
  deleteBookingFromDb, 
  createBookingInDb,
  supabase, 
  mapDbToBooking, 
  DbBookingRow 
} from './lib/supabase';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

export default function App() {
  // Booking State
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('cafelota_bookings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_MOCK_BOOKINGS;
  });

  const [isDbConnected, setIsDbConnected] = useState(false);

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem('cafelota_bookings', JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // Load from Supabase DB on startup
  const fetchFromSupabase = useCallback(async (isSilent = false) => {
    const { data, error } = await getBookingsFromDb();
    if (error) {
      if (!isSilent) {
        console.warn('Note: Supabase table not yet initialized or reachable:', error.message);
      }
      setIsDbConnected(false);
      return;
    }

    if (data && data.length > 0) {
      setBookings(data);
      setIsDbConnected(true);
      if (!isSilent) {
        addToast('success', `Synced ${data.length} live bookings from Supabase.`);
      }
    } else {
      setIsDbConnected(true);
    }
  }, []);

  useEffect(() => {
    fetchFromSupabase(true);

    // Subscribe to Supabase Realtime changes on 'bookings' table
    const channel = supabase
      .channel('public:bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBooking = mapDbToBooking(payload.new as DbBookingRow);
            setBookings((prev) => {
              if (prev.some((b) => b.id === newBooking.id)) return prev;
              return [newBooking, ...prev];
            });
            addToast('info', `New live booking received: ${newBooking.customerName}`);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapDbToBooking(payload.new as DbBookingRow);
            setBookings((prev) =>
              prev.map((b) => (b.id === updated.id ? updated : b))
            );
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as Partial<DbBookingRow>;
            if (oldRow?.id) {
              setBookings((prev) => prev.filter((b) => b.id !== oldRow.id));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsDbConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFromSupabase]);

  // Handlers
  const handleOpenBooking = (service?: string) => {
    setPreselectedService(service);
    setIsBookingOpen(true);
  };

  const handleBookingCreated = (newBooking: Booking, isPersistedInSupabase: boolean) => {
    setBookings((prev) => {
      if (prev.some((b) => b.id === newBooking.id)) return prev;
      return [newBooking, ...prev];
    });

    if (isPersistedInSupabase) {
      addToast(
        'success',
        `Reservation ${newBooking.id} confirmed and saved directly to Supabase!`
      );
    } else {
      addToast(
        'success',
        `Reservation ${newBooking.id} confirmed! (Saved to local register)`
      );
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    // 1. Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    // 2. Persist in Supabase backend
    const { success, error } = await updateBookingStatusInDb(id, newStatus);
    if (success) {
      addToast('success', `Reservation ${id} updated to ${newStatus} in Supabase.`);
    } else {
      console.warn('Supabase status update fallback:', error?.message);
      addToast('info', `Reservation ${id} updated to ${newStatus} (local state).`);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    // 1. Optimistic UI removal
    setBookings((prev) => prev.filter((b) => b.id !== id));

    // 2. Delete from Supabase backend
    const { success, error } = await deleteBookingFromDb(id);
    if (success) {
      addToast('error', `Reservation ${id} deleted from Supabase.`);
    } else {
      console.warn('Supabase delete fallback:', error?.message);
      addToast('error', `Reservation ${id} removed.`);
    }
  };

  const handleAddBookingFromAdmin = async (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    const { data, error } = await createBookingInDb(newBooking);
    if (!error && data) {
      addToast('success', `Walk-in ${newBooking.id} saved to Supabase.`);
    } else {
      addToast('success', `Walk-in ${newBooking.id} recorded.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Header & Navigation (Clean Production Polish - No backend debug IDs) */}
      <TopBar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section with High-Converting CTAs */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Services & Menu Grid */}
        <MenuSection
          onSelectServiceForBooking={(service) => handleOpenBooking(service)}
        />

        {/* Customer Reviews & Heritage Ambiance */}
        <ReviewsSection />

        {/* Location & Directions */}
        <LocationSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Multi-Step Customer Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
        onBookingCreated={handleBookingCreated}
      />

      {/* Protected Admin Portal with Credential Gate & Executive Dashboard */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        onUpdateStatus={handleUpdateStatus}
        onDeleteBooking={handleDeleteBooking}
        onAddBooking={handleAddBookingFromAdmin}
        onRefreshFromDb={() => fetchFromSupabase(false)}
        isDbConnected={isDbConnected}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-slate-900/90 border-emerald-500/50 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-slate-900/90 border-rose-500/50 text-rose-200'
                : 'bg-slate-900/90 border-cyan-500/50 text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white shrink-0 ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
