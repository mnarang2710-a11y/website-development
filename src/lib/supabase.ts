import { createClient } from '@supabase/supabase-js';
import { Booking, BookingStatus } from '../types';

const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://doxdddebynswnapxgmeo.supabase.co';
const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MgQvAKZvF8rfE61D3Iz9xQ_vYJoeE7A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface DbBookingRow {
  id: string;
  created_at: string;
  customer_name: string;
  phone_number: string;
  service_name: string;
  booking_date: string;
  time_slot: string;
  guest_count: number;
  status: string;
  notes?: string | null;
}

// Convert Supabase row to UI Booking type
export const mapDbToBooking = (row: DbBookingRow): Booking => {
  return {
    id: row.id,
    customerName: row.customer_name,
    phoneNumber: row.phone_number,
    date: row.booking_date,
    timeSlot: row.time_slot,
    guestsCount: Number(row.guest_count) || 2,
    serviceName: row.service_name,
    specialRequests: row.notes || undefined,
    status: (row.status as BookingStatus) || 'Pending',
    estimatedAmount: (Number(row.guest_count) || 2) * 1200,
    createdAt: row.created_at || new Date().toLocaleString(),
  };
};

// Convert UI Booking to Supabase row format
export const mapBookingToDb = (booking: Booking) => {
  return {
    id: booking.id,
    customer_name: booking.customerName,
    phone_number: booking.phoneNumber,
    service_name: booking.serviceName,
    booking_date: booking.date,
    time_slot: booking.timeSlot,
    guest_count: booking.guestsCount,
    status: booking.status,
    notes: booking.specialRequests || null,
  };
};

// Fetch all bookings from Supabase
export async function getBookingsFromDb(): Promise<{ data: Booking[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const bookings: Booking[] = (data || []).map(mapDbToBooking);
    return { data: bookings, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Insert new booking
export async function createBookingInDb(booking: Booking): Promise<{ data: Booking | null; error: Error | null }> {
  try {
    const payload = mapBookingToDb(booking);
    const { data, error } = await supabase
      .from('bookings')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: mapDbToBooking(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Update booking status in Supabase
export async function updateBookingStatusInDb(
  id: string, 
  status: BookingStatus
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Delete booking from Supabase
export async function deleteBookingFromDb(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
