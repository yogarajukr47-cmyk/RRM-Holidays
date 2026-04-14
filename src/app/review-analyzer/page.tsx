'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Search,
  Loader2,
  X,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Shield,
  TrendingUp,
  BarChart3,
  MessageSquareQuote,
  Globe,
} from 'lucide-react';

/* ─── Constants ─── */

const WHATSAPP_NUMBER = '919108597154';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളಂ' },
] as const;

type Language = typeof LANGUAGES[number]['code'];

const POPULAR_DESTINATIONS = [
  'Mysuru',
  'Coorg',
  'Ooty',
  'Kerala',
  'Goa',
  'Hampi',
  'Wayanad',
  'Pondicherry',
  'Kodaikanal',
];

/* ─── Types ─── */

interface ReviewAnalysis {
  destination: string;
  sentiment: string;
  rating: number;
  pros: string[];
  cons: string[];
  bestTimeToVisit: string;
  tips: string[];
  summary: string;
}

/* ─── Sentiment Badge ─── */

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const config = {
    positive: {
      label: 'Positive',
      icon: ThumbsUp,
      classes: 'bg-green-500/10 border-green-500/20 text-green-400',
    },
    mixed: {
      label: 'Mixed',
      icon: BarChart3,
      classes: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    },
    negative: {
      label: 'Negative',
      icon: ThumbsDown,
      classes: 'bg-red-500/10 border-red-500/20 text-red-400',
    },
  }[sentiment.toLowerCase()] || {
    label: 'Positive',
    icon: ThumbsUp,
    classes: 'bg-green-500/10 border-green-500/20 text-green-400',
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.classes}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

/* ─── Star Rating Display ─── */

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={22} className="text-amber-400 fill-amber-400" />
      ))}
      {hasHalf && (
        <div className="relative">
          <Star size={22} className="text-white/10" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={22} className="text-amber-400 fill-amber-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={22} className="text-white/10" />
      ))}
    </div>
  );
}

/* ─── Main Component ─── */

export default function ReviewAnalyzerPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ReviewAnalysis | null>(null);
  const [error, setError] = useState('');

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('active');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [results, isLoading]);

  /* Scroll to results */
  useEffect(() => {
    if (results && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [results]);

  /* Select destination chip */
  const selectDestination = (dest: string) => {
    setDestination(dest);
    setError('');
  };

  /* Submit */
  const handleSubmit = async () => {
    const trimmed = destination.trim();
    if (!trimmed) {
      setError('Please enter or select a destination');
      return;
    }

    setError('');
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/ai/review-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: trimmed, language }),
      });

      const data: ReviewAnalysis = await response.json();
      if (data.destination && data.summary) {
        setResults(data);
      } else {
        setError('Could not analyze reviews for this destination. Try another one.');
      }
    } catch {
      setError('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  /* WhatsApp link */
  const getWhatsAppLink = () => {
    if (!results) return '#';
    const msg = `Hi RRM Holidays! 🌴\n\nI'm interested in planning a trip to *${results.destination}*.\n\n📊 *Review Analysis:*\n• Rating: ${results.rating}/5 (${results.sentiment})\n• Best Time: ${results.bestTimeToVisit}\n• Top Pros: ${results.pros.slice(0, 3).join(', ')}\n\nPlease help me plan this trip!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  /* Reset */
  const handleReset = () => {
    setDestination('');
    setResults(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─── Loading Skeleton ─── */
  const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 mb-3" />
            <div className="h-4 w-24 bg-white/5 rounded mb-2" />
            <div className="h-3 w-32 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6 space-y-3">
        <div className="h-4 w-28 bg-white/5 rounded" />
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-5/6 bg-white/5 rounded" />
        <div className="h-3 w-4/5 bg-white/5 rounded" />
      </div>
      {/* Pros / Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6 space-y-3">
            <div className="h-4 w-20 bg-white/5 rounded" />
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/5" />
                <div className="h-3 flex-1 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* ─────────── NAVIGATION ─────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-sm">
              R
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-100">
              RRM <span className="text-amber-400">Holidays</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors">
              Home
            </Link>
            <Link href="/destinations/karnataka" className="text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors">
              Destinations
            </Link>
            <Link href="/review-analyzer" className="text-sm font-medium text-amber-400">
              Review Analyzer
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+919108597154"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-stone-200 text-sm font-medium hover:bg-white/5 transition-all"
            >
              <Phone size={14} /> Call Us
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20want%20to%20analyze%20reviews%20for%20a%20destination.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <MessageCircle size={14} /> Book Now
            </a>
          </div>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-morph" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs font-semibold text-amber-400 mb-6">
              <MessageSquareQuote size={14} />
              AI-Powered Review Intelligence
            </div>
          </div>
          <h1 className="reveal stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            AI Review{' '}
            <span className="text-gradient-warm">Analyzer</span>
          </h1>
          <p className="reveal stagger-2 text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Get real-time sentiment analysis, ratings, pros &amp; cons, and insider tips
            for any South India destination — powered by AI.
          </p>
        </div>
      </section>

      {/* ─────────── SEARCH FORM ─────────── */}
      {!results && !isLoading && (
        <section className="relative pb-12 md:pb-20" ref={formRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="reveal bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Search size={20} className="text-amber-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-200">
                  Analyze a Destination
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 ml-[52px]">
                Enter a destination name to see what travellers are saying
              </p>

              <div className="space-y-6">
                {/* ── Language ── */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Globe size={14} className="text-amber-400" /> Language / भाषा
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          language === lang.code
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                            : 'bg-white/5 text-stone-400 border border-white/5 hover:bg-white/10 hover:text-stone-200'
                        }`}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Destination Input ── */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <MapPin size={14} className="text-amber-400" />
                    Destination
                  </label>
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="e.g., Mysuru, Coorg, Ooty, Kerala..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-stone-200 text-sm placeholder:text-stone-600 hover:border-white/20 focus:border-amber-500/50 focus:outline-none transition-all"
                      suppressHydrationWarning
                    />
                    {destination && (
                      <button
                        onClick={() => setDestination('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Popular Destinations Chips ── */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Sparkles size={14} className="text-amber-400" />
                    Popular Destinations
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {POPULAR_DESTINATIONS.map((dest) => {
                      const isSelected = destination.toLowerCase() === dest.toLowerCase();
                      return (
                        <button
                          key={dest}
                          onClick={() => selectDestination(dest)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/5'
                              : 'bg-white/[0.02] border-white/10 text-stone-400 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <MapPin size={12} />
                          {dest}
                          {isSelected && <CheckCircle2 size={14} className="text-amber-400 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Error ── */}
                {error && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <X size={16} /> {error}
                  </div>
                )}

                {/* ── Submit Button ── */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Analyzing Reviews...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Analyze Reviews
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── LOADING STATE ─────────── */}
      {isLoading && (
        <section className="relative pb-12 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center animate-pulse">
                  <Sparkles size={20} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-stone-200">
                    Analyzing Reviews for &ldquo;{destination}&rdquo;
                  </h2>
                  <p className="text-xs text-stone-500">
                    AI is reading thousands of traveller reviews...
                  </p>
                </div>
              </div>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-loading-bar" />
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        </section>
      )}

      {/* ─────────── RESULTS ─────────── */}
      {results && !isLoading && (
        <section ref={resultsRef} className="relative pb-12 md:pb-20 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-xs font-semibold text-green-400 mb-4">
                <CheckCircle2 size={14} />
                Analysis Complete
              </div>
              <div className="reveal stagger-1 flex items-center justify-center gap-3 flex-wrap mb-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-200">
                  {results.destination}
                </h2>
                <SentimentBadge sentiment={results.sentiment} />
              </div>
              <p className="reveal stagger-2 text-stone-500 text-sm">
                Based on analysis of traveller reviews and travel intelligence
              </p>
            </div>

            {/* ── Top Stats Row ── */}
            <div className="reveal stagger-1 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Sentiment Card */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    results.sentiment.toLowerCase() === 'positive'
                      ? 'bg-green-500/10'
                      : results.sentiment.toLowerCase() === 'mixed'
                        ? 'bg-amber-500/10'
                        : 'bg-red-500/10'
                  }`}>
                    {results.sentiment.toLowerCase() === 'positive' ? (
                      <ThumbsUp size={20} className="text-green-400" />
                    ) : results.sentiment.toLowerCase() === 'mixed' ? (
                      <BarChart3 size={20} className="text-amber-400" />
                    ) : (
                      <ThumbsDown size={20} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Overall Sentiment</p>
                    <p className={`text-sm font-bold capitalize ${
                      results.sentiment.toLowerCase() === 'positive'
                        ? 'text-green-400'
                        : results.sentiment.toLowerCase() === 'mixed'
                          ? 'text-amber-400'
                          : 'text-red-400'
                    }`}>
                      {results.sentiment}
                    </p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      results.sentiment.toLowerCase() === 'positive'
                        ? 'bg-green-500'
                        : results.sentiment.toLowerCase() === 'mixed'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                    style={{
                      width: results.sentiment.toLowerCase() === 'positive'
                        ? '85%'
                        : results.sentiment.toLowerCase() === 'mixed'
                          ? '55%'
                          : '30%',
                    }}
                  />
                </div>
              </div>

              {/* Rating Card */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Traveller Rating</p>
                    <p className="text-sm font-bold text-stone-200">
                      {results.rating}/5
                    </p>
                  </div>
                </div>
                <StarRating rating={results.rating} />
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(results.rating / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Best Time Card */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Calendar size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Best Time to Visit</p>
                    <p className="text-sm font-bold text-stone-200">
                      {results.bestTimeToVisit}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Plan your trip during this period for the best weather and experience
                </p>
              </div>
            </div>

            {/* ── Summary Card ── */}
            <div className="reveal stagger-2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <MessageSquareQuote size={20} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-stone-200">AI Summary</h3>
              </div>
              <p className="text-stone-400 leading-relaxed text-sm md:text-base">
                {results.summary}
              </p>
            </div>

            {/* ── Pros & Cons ── */}
            <div className="reveal stagger-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Pros */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <ThumbsUp size={20} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-200">Pros</h3>
                    <p className="text-xs text-stone-500">What travellers love</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {results.pros.slice(0, 5).map((pro, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-stone-300 leading-relaxed">{pro}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <ThumbsDown size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-200">Cons</h3>
                    <p className="text-xs text-stone-500">Things to watch out for</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {results.cons.slice(0, 3).map((con, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-stone-300 leading-relaxed">{con}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Traveller Tips ── */}
            {results.tips && results.tips.length > 0 && (
              <div className="reveal stagger-4 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Lightbulb size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-200">Traveller Tips</h3>
                    <p className="text-xs text-stone-500">Insider advice from experienced travellers</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.tips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-stone-300 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Plan a Trip CTA ── */}
            <div className="reveal stagger-5 mt-8">
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                  <MapPin size={24} className="text-black" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-stone-200 mb-2">
                  Plan a Trip to{' '}
                  <span className="text-gradient-warm">{results.destination}</span>
                </h3>
                <p className="text-stone-400 text-sm max-w-lg mx-auto mb-6">
                  Our travel experts will customize the perfect itinerary based on real reviews,
                  best seasons, and your preferences. Get a free quote on WhatsApp!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
                  >
                    <MessageCircle size={20} />
                    Plan on WhatsApp
                  </a>
                  <a
                    href="tel:+919108597154"
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-stone-200 font-bold text-base hover:bg-white/10 transition-all"
                  >
                    <Phone size={20} className="text-amber-400" />
                    Call: +91 91085 97154
                  </a>
                </div>
              </div>
            </div>

            {/* ── Start Over ── */}
            <div className="reveal text-center mt-8">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-400 text-sm font-semibold hover:bg-white/5 hover:text-stone-200 transition-all"
              >
                <RotateCcw size={14} />
                Analyze Another Destination
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── FEATURES SECTION (shown before results) ─────────── */}
      {!results && !isLoading && (
        <section className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="reveal text-3xl md:text-4xl font-extrabold text-stone-200 mb-4">
                Why Use Our{' '}
                <span className="text-gradient-warm">Review Analyzer</span>
              </h2>
              <p className="reveal stagger-1 text-stone-500 max-w-xl mx-auto">
                Make data-driven travel decisions with AI-powered review intelligence
              </p>
            </div>

            {/* Stats Row */}
            <div className="reveal stagger-2 grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { value: '10K+', label: 'Reviews Analyzed', icon: BarChart3, color: 'amber' },
                { value: '50+', label: 'Destinations', icon: MapPin, color: 'green' },
                { value: '95%', label: 'Accuracy Rate', icon: TrendingUp, color: 'blue' },
                { value: '4.9/5', label: 'User Rating', icon: Star, color: 'purple' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                        stat.color === 'amber'
                          ? 'bg-amber-500/10'
                          : stat.color === 'green'
                            ? 'bg-green-500/10'
                            : stat.color === 'blue'
                              ? 'bg-blue-500/10'
                              : 'bg-purple-500/10'
                      }`}
                    >
                      <Icon
                        size={22}
                        className={
                          stat.color === 'amber'
                            ? 'text-amber-400'
                            : stat.color === 'green'
                              ? 'text-green-400'
                              : stat.color === 'blue'
                                ? 'text-blue-400'
                                : 'text-purple-400'
                        }
                      />
                    </div>
                    <p className="text-2xl md:text-3xl font-extrabold text-stone-200 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-stone-500 font-medium">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Feature Cards */}
            <div className="reveal stagger-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Sparkles,
                  title: 'AI-Powered Analysis',
                  description: 'Advanced sentiment analysis that reads between the lines of thousands of reviews to give you honest insights.',
                  color: 'amber',
                },
                {
                  icon: Shield,
                  title: 'Unbiased & Transparent',
                  description: 'No paid reviews or sponsored rankings. Our AI gives you the real picture based on actual traveller experiences.',
                  color: 'green',
                },
                {
                  icon: MessageCircle,
                  title: 'Expert Backed',
                  description: 'Every analysis is backed by RRM Holidays\' 10+ years of experience organising trips across South India.',
                  color: 'blue',
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/15 transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        feature.color === 'amber'
                          ? 'bg-amber-500/10'
                          : feature.color === 'green'
                            ? 'bg-green-500/10'
                            : 'bg-blue-500/10'
                      }`}
                    >
                      <Icon
                        size={22}
                        className={
                          feature.color === 'amber'
                            ? 'text-amber-400'
                            : feature.color === 'green'
                              ? 'text-green-400'
                              : 'text-blue-400'
                        }
                      />
                    </div>
                    <h3 className="text-lg font-bold text-stone-200 mb-2">{feature.title}</h3>
                    <p className="text-sm text-stone-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─────────── FOOTER ─────────── */}
      <footer className="relative border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-xs">
                R
              </div>
              <span className="text-sm font-bold text-stone-300">
                RRM <span className="text-amber-400">Holidays</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 text-center">
              &copy; {new Date().getFullYear()} RRM Holidays. All rights reserved. | AI-Powered Review Intelligence
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-500 hover:text-green-400 transition-colors flex items-center gap-1"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
              <a
                href="tel:+919108597154"
                className="text-xs text-stone-500 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Phone size={12} /> Call Us
              </a>
              <Link
                href="/"
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
