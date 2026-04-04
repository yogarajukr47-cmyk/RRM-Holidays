'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Car,
  Users,
  Loader2,
  Phone,
  Ban,
} from 'lucide-react';

interface Booking {
  id: string;
  destination: string;
  travelDate: string | null;
  travellers: string | null;
  vehicleType: string | null;
  name: string | null;
  phone: string | null;
  notes: string | null;
  status: string;
  totalPrice: number | null;
  adminNotes: string | null;
  createdAt: string;
}

const WHATSAPP_NUMBER = '919108597154';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          setBookings(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
    pending: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: Clock, label: 'Pending' },
    confirmed: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', icon: CheckCircle, label: 'Confirmed' },
    completed: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: CheckCircle, label: 'Completed' },
    cancelled: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: XCircle, label: 'Cancelled' },
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-100">My Bookings</h1>
            <p className="text-sm text-stone-400">View and manage your travel bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-neutral-900/50 text-stone-500 border border-white/5 hover:border-white/10'
              }`}
            >
              {f} {f !== 'all' && `(${bookings.filter(b => f === 'all' || b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={30} className="animate-spin text-amber-400" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <CalendarCheck size={48} className="text-stone-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-300 mb-2">No bookings found</h3>
            <p className="text-sm text-stone-500">
              {filter === 'all' ? 'You haven\'t made any bookings yet.' : `No ${filter} bookings.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="glass rounded-xl p-4 hover:border-amber-500/20 transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                        <status.icon size={18} className={status.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-stone-200">{booking.destination}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text} border`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 flex-wrap">
                          {booking.travelDate && (
                            <span className="flex items-center gap-1">
                              <CalendarCheck size={10} />
                              {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                          {booking.travellers && (
                            <span className="flex items-center gap-1">
                              <Users size={10} />
                              {booking.travellers}
                            </span>
                          )}
                          {booking.vehicleType && (
                            <span className="flex items-center gap-1">
                              <Car size={10} />
                              {booking.vehicleType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-stone-500">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
            <div className="relative w-full max-w-md glass rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-stone-100">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-stone-400 hover:text-white text-xl">×</button>
              </div>

              {(() => {
                const status = statusConfig[selectedBooking.status] || statusConfig.pending;
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                      <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                        <status.icon size={18} className={status.text} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-200">{selectedBooking.destination}</p>
                        <span className={`text-xs ${status.text}`}>{status.label}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: 'Travel Date', value: selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set' },
                        { label: 'Travellers', value: selectedBooking.travellers || 'Not specified' },
                        { label: 'Vehicle', value: selectedBooking.vehicleType || 'Not specified' },
                        { label: 'Contact Name', value: selectedBooking.name || 'N/A' },
                        { label: 'Phone', value: selectedBooking.phone || 'N/A' },
                        { label: 'Notes', value: selectedBooking.notes || 'None' },
                        { label: 'Admin Notes', value: selectedBooking.adminNotes || 'None' },
                        { label: 'Booked On', value: new Date(selectedBooking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                      ].map((field) => (
                        <div key={field.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                          <span className="text-xs text-stone-500">{field.label}</span>
                          <span className="text-sm text-stone-300 text-right max-w-[60%]">{field.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {selectedBooking.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(selectedBooking.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all"
                        >
                          <Ban size={16} />
                          Cancel Booking
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I have a booking enquiry for ${selectedBooking.destination}. Booking ID: ${selectedBooking.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all"
                      >
                        <Phone size={16} />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
