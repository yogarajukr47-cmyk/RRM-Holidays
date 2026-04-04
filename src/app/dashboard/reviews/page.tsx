'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StarRating from '@/components/StarRating';
import {
  Star,
  Plus,
  Loader2,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';

interface Review {
  id: string;
  trip: string;
  rating: number;
  quote: string;
  name: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formTrip, setFormTrip] = useState('');
  const [formRating, setFormRating] = useState(0);
  const [formQuote, setFormQuote] = useState('');
  const [formName, setFormName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews/user');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTrip || !formRating || !formQuote || !formName) return;

    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip: formTrip,
          rating: formRating,
          quote: formQuote,
          name: formName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Review submitted successfully!');
        setFormTrip('');
        setFormRating(0);
        setFormQuote('');
        setFormName('');
        setShowForm(false);

        const reviewsRes = await fetch('/api/reviews/user');
        if (reviewsRes.ok) {
          setReviews(await reviewsRes.json());
        }
      } else {
        setMessage(data.error || 'Failed to submit review');
      }
    } catch {
      setMessage('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-100">My Reviews</h1>
            <p className="text-sm text-stone-400">Share your travel experiences</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Plus size={16} />
            Write a Review
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center flex items-center justify-center gap-2">
            <CheckCircle size={16} />
            {message}
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-100">Write a Review</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Trip Name *</label>
                  <input
                    type="text"
                    value={formTrip}
                    onChange={(e) => setFormTrip(e.target.value)}
                    placeholder="e.g., Kerala Complete Tour"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Rating *</label>
                <StarRating rating={formRating} onRatingChange={setFormRating} size={28} />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Your Experience *</label>
                <textarea
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="Share your experience..."
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || formRating === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={30} className="animate-spin text-amber-400" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Star size={48} className="text-stone-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-300 mb-2">No reviews yet</h3>
            <p className="text-sm text-stone-500">Share your first travel experience with us!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
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
                    <p className="text-xs text-stone-500 mt-2">
                      — {review.name} • {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
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
