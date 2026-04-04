'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StarRating from '@/components/StarRating';
import {
  Star,
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from 'lucide-react';

interface ReviewWithUser {
  id: string;
  trip: string;
  rating: number;
  quote: string;
  name: string;
  isApproved: boolean;
  createdAt: string;
  userId: string;
  user: { name: string; email: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/admin/reviews');
        if (res.ok) {
          setReviews(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved }),
      });

      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved } : r));
      }
    } catch (err) {
      console.error('Failed to update review:', err);
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = search === '' ||
      r.trip.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.quote.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'pending' && !r.isApproved) ||
      (filter === 'approved' && r.isApproved);
    return matchesSearch && matchesFilter;
  });

  const pendingCount = reviews.filter(r => !r.isApproved).length;

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-stone-100">Manage Reviews</h1>
          <p className="text-sm text-stone-400">{reviews.length} total reviews • {pendingCount} pending approval</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  filter === f
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-neutral-900/50 text-stone-500 border border-white/5'
                }`}
              >
                {f} {f === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={30} className="animate-spin text-amber-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Star size={48} className="text-stone-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-300 mb-2">No reviews found</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => (
              <div key={review.id} className="glass rounded-xl p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-stone-200">{review.trip}</h3>
                      {review.isApproved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider flex items-center gap-1">
                          <Clock size={8} /> Pending
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} readonly size={14} />
                    <p className="text-sm text-stone-400 mt-2 leading-relaxed">&ldquo;{review.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1"><User size={10} />{review.name}</span>
                      <span>by {review.user.name} ({review.user.email})</span>
                      <span>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 sm:flex-col">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-all"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    )}
                    {review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 transition-all"
                      >
                        <XCircle size={14} />
                        Unapprove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
