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
  Search,
  FileText,
  IndianRupee,
  Save,
  User,
} from 'lucide-react';

interface BookingWithUser {
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
  user: { name: string; email: string; phone: string | null };
}

const WHATSAPP_NUMBER = '919108597154';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editBooking, setEditBooking] = useState<BookingWithUser | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/admin/bookings');
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

  const handleEditOpen = (booking: BookingWithUser) => {
    setEditBooking(booking);
    setEditStatus(booking.status);
    setEditAdminNotes(booking.adminNotes || '');
    setEditPrice(booking.totalPrice?.toString() || '');
  };

  const handleSave = async () => {
    if (!editBooking) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editBooking.id,
          status: editStatus,
          adminNotes: editAdminNotes,
          totalPrice: editPrice ? Number(editPrice) : null,
        }),
      });

      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === editBooking.id ? { ...b, status: editStatus, adminNotes: editAdminNotes, totalPrice: editPrice ? Number(editPrice) : null } : b));
        setEditBooking(null);
      }
    } catch (err) {
      console.error('Failed to update booking:', err);
    } finally {
      setSaving(false);
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    pending: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: Clock },
    confirmed: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', icon: CheckCircle },
    completed: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: CheckCircle },
    cancelled: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: XCircle },
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = search === '' ||
      b.destination.toLowerCase().includes(search.toLowerCase()) ||
      b.user.name.toLowerCase().includes(search.toLowerCase()) ||
      b.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-stone-100">Manage Bookings</h1>
          <p className="text-sm text-stone-400">{bookings.length} total bookings</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by destination, name, email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === f
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-neutral-900/50 text-stone-500 border border-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={30} className="animate-spin text-amber-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <CalendarCheck size={48} className="text-stone-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-300 mb-2">No bookings found</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              return (
                <div key={booking.id} className="glass rounded-xl p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                        <status.icon size={18} className={status.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-stone-200">{booking.destination}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text} border`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 flex-wrap">
                          <span className="flex items-center gap-1"><User size={10} /> {booking.user.name}</span>
                          <span className="flex items-center gap-1">{booking.user.email}</span>
                          {booking.travelDate && (
                            <span className="flex items-center gap-1">
                              <CalendarCheck size={10} />
                              {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                          {booking.travellers && <span className="flex items-center gap-1"><Users size={10} />{booking.travellers}</span>}
                          {booking.vehicleType && <span className="flex items-center gap-1"><Car size={10} />{booking.vehicleType}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditOpen(booking)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
                      >
                        Manage
                      </button>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}${booking.phone || booking.user.phone ? `?text=${encodeURIComponent(`Hi! Regarding booking for ${booking.destination} (ID: ${booking.id}). Customer: ${booking.user.name}, Phone: ${booking.phone || booking.user.phone || 'N/A'}`)}` : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                      >
                        <Phone size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        {editBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditBooking(null)} />
            <div className="relative w-full max-w-md glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-stone-100 mb-4">Manage Booking</h2>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                  <p className="text-sm font-semibold text-stone-200">{editBooking.destination}</p>
                  <p className="text-xs text-stone-500">by {editBooking.user.name} • {editBooking.user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">
                    <IndianRupee size={14} className="inline mr-1" />
                    Total Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="Enter total price"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">
                    <FileText size={14} className="inline mr-1" />
                    Admin Notes
                  </label>
                  <textarea
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Internal notes about this booking..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditBooking(null)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-stone-300 text-sm font-semibold hover:bg-neutral-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
