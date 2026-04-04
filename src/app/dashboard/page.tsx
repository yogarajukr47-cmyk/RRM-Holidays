'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  MessageSquare,
  ArrowRight,
  MapPin,
  Car,
  Users,
  Loader2,
} from 'lucide-react';

interface Booking {
  id: string;
  destination: string;
  travelDate: string | null;
  travellers: string | null;
  vehicleType: string | null;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  const recentBookings = bookings.slice(0, 5);

  const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    pending: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: Clock },
    confirmed: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', icon: CheckCircle },
    completed: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: CheckCircle },
    cancelled: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: XCircle },
  };

  const statCards = [
    { label: 'Total Bookings', value: totalBookings, icon: CalendarCheck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Pending', value: pendingBookings, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Confirmed', value: confirmedBookings, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Completed', value: completedBookings, icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="glass rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-stone-100 mb-1">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Traveler'}! 👋
          </h1>
          <p className="text-sm text-stone-400">
            Here&apos;s an overview of your travel activities with RRM Holidays.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-stone-100">{stat.value}</div>
              <div className="text-xs text-stone-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/new-booking"
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Plus size={22} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-stone-200">New Booking</h3>
              <p className="text-xs text-stone-500">Plan your next trip</p>
            </div>
            <ArrowRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <MessageSquare size={22} className="text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-stone-200">Contact Us</h3>
              <p className="text-xs text-stone-500">Chat on WhatsApp</p>
            </div>
            <ArrowRight size={18} className="text-green-400 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Recent Bookings */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-100">Recent Bookings</h2>
            <Link
              href="/dashboard/bookings"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-amber-400" />
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck size={40} className="text-stone-700 mx-auto mb-3" />
              <p className="text-sm text-stone-400 mb-4">No bookings yet</p>
              <Link
                href="/dashboard/new-booking"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                <Plus size={16} />
                Book Your First Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900/50 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                      <status.icon size={18} className={status.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-stone-200 truncate">{booking.destination}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text} border`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500">
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
                      </div>
                    </div>
                    <MapPin size={16} className="text-stone-600 shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
