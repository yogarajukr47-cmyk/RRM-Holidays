'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  CalendarCheck,
  MessageSquare,
  Star,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalEnquiries: number;
  totalReviews: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  newEnquiries: number;
  pendingReviews: number;
  totalRevenue: number;
  recentBookings: Array<{
    id: string;
    destination: string;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  }>;
  recentEnquiries: Array<{
    id: string;
    name: string;
    destination: string | null;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const bookingStatusColors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-500/10',
    confirmed: 'text-green-400 bg-green-500/10',
    completed: 'text-blue-400 bg-blue-500/10',
    cancelled: 'text-red-400 bg-red-500/10',
  };

  if (loading) {
    return (
      <DashboardLayout type="admin">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={30} className="animate-spin text-amber-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-stone-100">Admin Dashboard</h1>
          <p className="text-sm text-stone-400">Overview of your travel business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: CalendarCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Enquiries', value: stats?.totalEnquiries || 0, icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Reviews', value: stats?.totalReviews || 0, icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-neutral-900/80 border border-white/5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-stone-100">{stat.value}</div>
              <div className="text-xs text-stone-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue & Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Revenue */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <IndianRupee size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500">Total Revenue</p>
                <p className="text-xl font-bold text-stone-100">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Clock size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500">Pending Bookings</p>
                <p className="text-xl font-bold text-stone-100">{stats?.pendingBookings || 0}</p>
              </div>
            </div>
          </div>

          {/* New Enquiries */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <MessageSquare size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500">New Enquiries</p>
                <p className="text-xl font-bold text-stone-100">{stats?.newEnquiries || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Breakdown */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-stone-100 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-400" />
            Booking Status Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Pending', value: stats?.pendingBookings || 0, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
              { label: 'Confirmed', value: stats?.confirmedBookings || 0, color: 'bg-green-500', textColor: 'text-green-400' },
              { label: 'Completed', value: stats?.completedBookings || 0, color: 'bg-blue-500', textColor: 'text-blue-400' },
              { label: 'Cancelled', value: stats?.cancelledBookings || 0, color: 'bg-red-500', textColor: 'text-red-400' },
            ].map((s) => {
              const total = stats?.totalBookings || 1;
              const pct = Math.round((s.value / total) * 100);
              return (
                <div key={s.label} className="p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold ${s.textColor}`}>{s.label}</span>
                    <span className="text-xs text-stone-500">{pct}%</span>
                  </div>
                  <div className="text-lg font-bold text-stone-200">{s.value}</div>
                  <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-bold text-stone-100 mb-4">Recent Bookings</h2>
            {(!stats?.recentBookings || stats.recentBookings.length === 0) ? (
              <p className="text-sm text-stone-500 text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-2">
                {stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bookingStatusColors[booking.status] || 'bg-neutral-800'}`}>
                      {booking.status === 'confirmed' || booking.status === 'completed' ? (
                        <CheckCircle size={14} />
                      ) : booking.status === 'cancelled' ? (
                        <XCircle size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-200 truncate">{booking.destination}</p>
                      <p className="text-xs text-stone-500 truncate">{booking.user.name} • {booking.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Enquiries */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-bold text-stone-100 mb-4">Recent Enquiries</h2>
            {(!stats?.recentEnquiries || stats.recentEnquiries.length === 0) ? (
              <p className="text-sm text-stone-500 text-center py-8">No enquiries yet</p>
            ) : (
              <div className="space-y-2">
                {stats.recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <MessageSquare size={14} className="text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-200 truncate">{enquiry.destination || 'General Enquiry'}</p>
                      <p className="text-xs text-stone-500 truncate">{enquiry.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      enquiry.status === 'new' ? 'bg-blue-500/10 text-blue-400' : 'bg-stone-500/10 text-stone-400'
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
