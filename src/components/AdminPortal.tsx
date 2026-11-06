import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, User, Check, Ban, Trash2, 
  Search, Plus, Calendar, IndianRupee, Clock,
  CheckCircle2, AlertCircle, LogOut, RefreshCw, Database,
  Code, Copy, CheckCheck
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
  onDeleteBooking: (id: string) => void;
  onAddBooking: (booking: Booking) => void;
  onRefreshFromDb?: () => Promise<void>;
  isDbConnected?: boolean;
}

export const SUPABASE_SQL_SCRIPT = `-- =====================================================
-- Café Lota Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Run)
-- =====================================================

-- 1. Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('BK-' || floor(random() * (9999 - 1000 + 1) + 1000)::text),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    service_name TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    guest_count INTEGER NOT NULL DEFAULT 2,
    status TEXT NOT NULL DEFAULT 'Pending',
    notes TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert access" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update access" ON public.bookings;
DROP POLICY IF EXISTS "Allow public delete access" ON public.bookings;

-- 4. Create RLS policies for demo access (public read, insert, update, delete)
CREATE POLICY "Allow public read access" 
ON public.bookings 
FOR SELECT 
TO public, anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.bookings 
FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.bookings 
FOR UPDATE 
TO public, anon, authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete access" 
ON public.bookings 
FOR DELETE 
TO public, anon, authenticated 
USING (true);

-- 5. Enable Supabase Realtime for instant synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- 6. Insert sample realistic bookings
INSERT INTO public.bookings (id, customer_name, phone_number, service_name, booking_date, time_slot, guest_count, status, notes)
VALUES
    ('BK-8902', 'Ananya Sharma', '+91 98112 45910', 'Heritage Bamboo Pavilion Dining Experience', 'Tomorrow', '7:30 PM', 4, 'Confirmed', 'Courtyard corner table near bamboo grove, celebrate birthday.'),
    ('BK-8903', 'Vikramaditya Rao', '+91 98201 34982', 'Early Morning Museum Garden Breakfast Feast', 'Tomorrow', '9:00 AM', 2, 'Pending', 'One guest prefers low-spice gluten-free millet options.'),
    ('BK-8904', 'Dr. Meera Sen', '+91 99104 88321', 'Palak Patta Chaat & Regional Tasting Feast', 'Friday', '8:15 PM', 2, 'Confirmed', 'Quiet table for conversation.'),
    ('BK-8905', 'Kabir Malhotra', '+91 97118 72614', 'Curated Family Lunch & Regional Specialties', 'Sunday', '1:30 PM', 6, 'Pending', 'Family gathering with senior citizens, ground-level access.')
ON CONFLICT (id) DO NOTHING;`;

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onAddBooking,
  onRefreshFromDb,
  isDbConnected = true,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Walk-in Reservation Form State
  const [newCustName, setNewCustName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('8:00 PM');
  const [newGuests, setNewGuests] = useState(2);
  const [newService, setNewService] = useState('Heritage Bamboo Pavilion Dining Experience');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password.trim() === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Use Username: admin, Passcode: 1234');
    }
  };

  const handleAutoFill = () => {
    setUsername('admin');
    setPassword('1234');
    setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleManualRefresh = async () => {
    if (onRefreshFromDb) {
      setIsRefreshing(true);
      await onRefreshFromDb();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // KPI Calculations
  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedAppointments = bookings.filter((b) => b.status === 'Confirmed').length;
  const estimatedRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.estimatedAmount || 1500), 0);

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phoneNumber.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle Add Walk-in
  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newPhone) return;

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustName.trim(),
      phoneNumber: newPhone.trim(),
      date: newDate,
      timeSlot: newTime,
      guestsCount: Number(newGuests),
      serviceName: newService,
      status: 'Confirmed',
      estimatedAmount: Number(newGuests) * 1200,
      createdAt: new Date().toISOString(),
    };

    onAddBooking(newBooking);
    setShowAddModal(false);
    setNewCustName('');
    setNewPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Credential Gate Modal if not logged in */}
      {!isAuthenticated ? (
        <div 
          className="relative w-full max-w-md rounded-2xl bg-slate-900/95 border border-white/15 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Staff Management Portal</h3>
              <p className="text-xs text-slate-400">Café Lota Administration Access</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Quick Demo Credentials Info & Auto-fill button */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="text-slate-400">Demo Credentials:</p>
                <p className="text-white font-mono font-semibold">User: <span className="text-amber-400">admin</span> · Pass: <span className="text-amber-400">1234</span></p>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition-colors cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Executive Dashboard Modal */
        <div 
          className="relative w-full max-w-6xl max-h-[92vh] rounded-2xl bg-slate-900/95 border border-white/15 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-bold text-white">Café Lota Admin Portal</h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>Supabase Live</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">National Crafts Museum · Real-Time Table Reservation Desk</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Refresh from DB */}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                title="Sync from Supabase database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
                <span className="hidden md:inline">Refresh DB</span>
              </button>

              {/* View SQL Schema */}
              <button
                onClick={() => setShowSqlModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer"
                title="View and copy Supabase SQL script"
              >
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">SQL Schema</span>
              </button>

              {/* Add Walk-in */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Walk-In</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Log Out</span>
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Dashboard Body */}
          <div className="overflow-y-auto space-y-6 pt-6 pr-1">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Bookings */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Bookings</span>
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white mt-2 font-mono">
                  {totalBookings}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Live in Supabase</p>
              </div>

              {/* Card 2: Pending Requests */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Pending Requests</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-amber-300 mt-2 font-mono">
                  {pendingRequests}
                </div>
                <p className="text-[11px] text-amber-400/80 mt-1">Requires confirmation</p>
              </div>

              {/* Card 3: Confirmed Appointments */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Confirmed</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-300 mt-2 font-mono">
                  {confirmedAppointments}
                </div>
                <p className="text-[11px] text-emerald-400/80 mt-1">Tables reserved & ready</p>
              </div>

              {/* Card 4: Estimated Revenue */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Est. Revenue</span>
                  <IndianRupee className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white mt-2 font-mono">
                  ₹{estimatedRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">From active guest bookings</p>
              </div>

            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search guest name, phone, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/70 border border-white/10 overflow-x-auto text-xs">
                {['ALL', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Bookings Table */}
            <div className="rounded-xl border border-white/10 bg-slate-950/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Guest Info</th>
                      <th className="py-3 px-4">Service / Party</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions (Live Supabase)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-slate-900/40 transition-colors">
                        
                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">
                          {bk.id}
                        </td>

                        {/* Guest */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{bk.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{bk.phoneNumber}</div>
                          {bk.specialRequests && (
                            <div className="text-[10px] text-amber-300/80 italic mt-0.5 max-w-[200px] truncate" title={bk.specialRequests}>
                              Note: {bk.specialRequests}
                            </div>
                          )}
                        </td>

                        {/* Service & Guests */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-200 font-medium max-w-[190px] truncate" title={bk.serviceName}>
                            {bk.serviceName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {bk.guestsCount} Guests · <span className="font-mono text-amber-300">₹{bk.estimatedAmount?.toLocaleString()}</span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4">
                          <div className="text-white font-medium">{bk.date}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{bk.timeSlot}</div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              bk.status === 'Confirmed'
                                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                                : bk.status === 'Pending'
                                ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                                : bk.status === 'Completed'
                                ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                                : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                            }`}
                          >
                            <span 
                              className={`w-1.5 h-1.5 rounded-full ${
                                bk.status === 'Confirmed'
                                  ? 'bg-emerald-400'
                                  : bk.status === 'Pending'
                                  ? 'bg-amber-400 animate-pulse'
                                  : bk.status === 'Completed'
                                  ? 'bg-cyan-400'
                                  : 'bg-rose-400'
                              }`} 
                            />
                            {bk.status}
                          </span>
                        </td>

                        {/* Action Buttons: Confirm, Cancel, Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {bk.status !== 'Confirmed' && (
                              <button
                                onClick={() => onUpdateStatus(bk.id, 'Confirmed')}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer font-semibold text-[11px]"
                                title="Update to Confirmed in Supabase"
                              >
                                <Check className="w-3 h-3" />
                                <span>Confirm</span>
                              </button>
                            )}

                            {bk.status !== 'Cancelled' && (
                              <button
                                onClick={() => onUpdateStatus(bk.id, 'Cancelled')}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:bg-rose-900/60 hover:text-rose-200 transition-all cursor-pointer text-[11px]"
                                title="Update to Cancelled in Supabase"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteBooking(bk.id)}
                              className="p-1.5 rounded-lg bg-slate-800 border border-white/10 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="Delete Entry from Supabase"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No reservations match the specified filter or search query.
                </div>
              )}
            </div>

          </div>

          {/* Quick Add Walk-in Modal Sub-dialog */}
          {showAddModal && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/20 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-lg font-bold text-white">Log Walk-In / Phone Reservation</h4>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateWalkin} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Guest Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98100 00000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Guests Count</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={newGuests}
                      onChange={(e) => setNewGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                    >
                      Save to Supabase
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SQL Schema Viewer Modal */}
          {showSqlModal && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-white/20 p-6 space-y-4 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h4 className="font-display text-lg font-bold text-white">Supabase SQL Schema</h4>
                  </div>
                  <button onClick={() => setShowSqlModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Copy and run this script in your <strong className="text-white">Supabase SQL Editor</strong> (Dashboard &gt; SQL Editor &gt; New Query &gt; Run) to provision the <code className="text-amber-400 font-mono">bookings</code> table and RLS policies.
                </p>

                <div className="flex-1 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-white/10 font-mono text-xs text-slate-300 select-all whitespace-pre leading-relaxed">
                  {SUPABASE_SQL_SCRIPT}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Target: https://doxdddebynswnapxgmeo.supabase.co
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopySql}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedSql ? (
                        <>
                          <CheckCheck className="w-4 h-4" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy SQL Script</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowSqlModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
