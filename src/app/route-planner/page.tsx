'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Zap,
  MapPin,
  Navigation,
  Plus,
  X,
  Loader2,
  Phone,
  MessageCircle,
  Clock,
  Gauge,
  Fuel,
  Car,
  Lightbulb,
  Star,
  Route,
  ChevronRight,
  Sparkles,
  ArrowRight,
  RotateCcw,
  MapPinned,
  Globe,
} from 'lucide-react';

/* ─── Constants ─── */

const WHATSAPP_NUMBER = '919108597154';
const MAX_STOPS = 8;

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
] as const;

type Language = typeof LANGUAGES[number]['code'];

const PRESETS: { label: string; stops: string[]; icon: React.ReactNode }[] = [
  {
    label: 'Mysuru → Coorg → Ooty',
    stops: ['Mysuru', 'Coorg', 'Ooty'],
    icon: <Mountain className="w-4 h-4" />,
  },
  {
    label: 'Mysuru → Kerala',
    stops: ['Mysuru', 'Wayanad', 'Munnar', 'Kochi'],
    icon: <Waves className="w-4 h-4" />,
  },
  {
    label: 'Goa Circuit',
    stops: ['Mysuru', 'Hampi', 'Goa'],
    icon: <Sun className="w-4 h-4" />,
  },
  {
    label: 'Temple Trail',
    stops: ['Mysuru', 'Hampi', 'Tirupati', 'Rameswaram'],
    icon: <Landmark className="w-4 h-4" />,
  },
];

/* ─── Types ─── */

interface OptimizedStop {
  name: string;
  order: number;
  visitDuration?: string;
  duration?: string;
  attractions?: string[];
  tips?: string;
  tip?: string;
}

interface RoutePlannerResponse {
  optimizedStops: OptimizedStop[];
  totalDistance: string;
  totalTime: string;
  vehicleSuggestion: string;
  estimatedFuelCost: string;
}

/* ─── SVG Icon Components (inline for presets) ─── */

function Mountain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function Waves(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  );
}

function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function Landmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

/* ─── Helper: Get display value for stop fields ─── */

function getStopDuration(stop: OptimizedStop): string {
  return stop.visitDuration || stop.duration || '2-3 hours';
}

function getStopTips(stop: OptimizedStop): string {
  return stop.tips || stop.tip || '';
}

function getStopAttractions(stop: OptimizedStop): string[] {
  return stop.attractions || [];
}

/* ─── Main Component ─── */

export default function RoutePlannerPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [stops, setStops] = useState<string[]>(['Mysuru', 'Coorg']);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RoutePlannerResponse | null>(null);
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
  }, [result, isLoading]);

  /* Scroll to results */
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [result]);

  /* ─── Stop Management ─── */

  const updateStop = (index: number, value: string) => {
    setStops((prev) => prev.map((s, i) => (i === index ? value : s)));
    setError('');
  };

  const addStop = () => {
    if (stops.length < MAX_STOPS) {
      setStops((prev) => [...prev, '']);
      setError('');
    }
  };

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      setStops((prev) => prev.filter((_, i) => i !== index));
      setError('');
    }
  };

  const applyPreset = (presetStops: string[]) => {
    setStops(presetStops);
    setResult(null);
    setError('');
  };

  /* ─── Submit ─── */

  const handleOptimize = async () => {
    const validStops = stops.filter((s) => s.trim() !== '');
    if (validStops.length < 2) {
      setError('Please enter at least 2 stops to optimize your route.');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/route-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stops: validStops, language }),
      });

      const data: RoutePlannerResponse = await response.json();

      if (data.optimizedStops && data.optimizedStops.length > 0) {
        setResult(data);
      } else {
        setError('Could not optimize route. Please try different stops or contact us on WhatsApp.');
      }
    } catch {
      setError('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── WhatsApp Link ─── */

  const getWhatsAppLink = () => {
    if (!result) return `https://wa.me/${WHATSAPP_NUMBER}`;
    const routeStr = result.optimizedStops.map((s) => s.name).join(' → ');
    const msg = `Hi RRM Holidays! 🗺️\n\nI'm interested in booking this optimized route:\n*${routeStr}*\n\n📊 *Route Summary:*\n• Total Distance: ${result.totalDistance}\n• Total Time: ${result.totalTime}\n• Vehicle: ${result.vehicleSuggestion}\n\nPlease help me book this trip!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  /* ─── Reset ─── */

  const resetAll = () => {
    setStops(['Mysuru', 'Coorg']);
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─── Loading Skeleton ─── */

  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* Summary skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 mb-3" />
            <div className="h-4 w-20 bg-white/5 rounded mb-2" />
            <div className="h-6 w-28 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      {/* Timeline skeleton */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 mb-6 last:mb-0">
            <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 bg-white/5 rounded" />
              <div className="h-3 w-24 bg-white/5 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-white/5 rounded-full" />
                <div className="h-6 w-24 bg-white/5 rounded-full" />
              </div>
            </div>
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
            <Link href="/route-planner" className="text-sm font-medium text-amber-400">
              Route Planner
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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20multi-stop%20route.`}
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
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-morph" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs font-semibold text-amber-400 mb-6">
              <Zap size={14} />
              AI-Powered Route Intelligence
            </div>
          </div>
          <h1 className="reveal stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Smart Route{' '}
            <span className="text-gradient-warm">Optimizer</span>
          </h1>
          <p className="reveal stagger-2 text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Add your dream destinations and let AI find the perfect route order.
            Get optimized timelines, distances, and local tips for every stop.
          </p>
        </div>
      </section>

      {/* ─────────── ROUTE BUILDER FORM ─────────── */}
      {!result && !isLoading && (
        <section className="relative pb-12 md:pb-20" ref={formRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="reveal bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Route size={20} className="text-amber-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-200">
                  Build Your Route
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 ml-[52px]">
                Add at least 2 stops. AI will optimize the order and plan each visit.
              </p>

              {/* ── Language ── */}
              <div className="mb-6">
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

              {/* ── Quick Presets ── */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                  <Sparkles size={14} className="text-amber-400" />
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset.stops)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-stone-400 text-sm font-medium hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-300 transition-all duration-200"
                    >
                      {preset.icon}
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Stops List ── */}
              <div className="mb-6">
                <label className="flex items-center justify-between text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="text-amber-400" />
                    Your Stops
                  </span>
                  <span className="text-[10px] font-normal text-stone-600 normal-case tracking-normal">
                    {stops.length}/{MAX_STOPS}
                  </span>
                </label>

                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      {/* Order Badge */}
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-extrabold text-amber-400">
                          {index + 1}
                        </span>
                      </div>

                      {/* Stop Label */}
                      <span className="hidden sm:block w-12 text-[11px] font-semibold text-stone-600 uppercase tracking-wider shrink-0">
                        {index === 0 ? 'From' : index === stops.length - 1 && stops.length > 2 ? 'Final' : 'Via'}
                      </span>

                      {/* Input */}
                      <input
                        type="text"
                        value={stop}
                        onChange={(e) => updateStop(index, e.target.value)}
                        placeholder={
                          index === 0
                            ? 'e.g. Mysuru'
                            : index === stops.length - 1
                              ? 'e.g. Ooty'
                              : 'e.g. Coorg'
                        }
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                        suppressHydrationWarning
                      />

                      {/* Connector Arrow */}
                      {index < stops.length - 1 && (
                        <div className="hidden sm:flex flex-col items-center shrink-0">
                          <ChevronRight size={18} className="text-stone-700" />
                        </div>
                      )}

                      {/* Remove Button */}
                      {stops.length > 2 && (
                        <button
                          onClick={() => removeStop(index)}
                          className="w-9 h-9 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400/50 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
                          title="Remove stop"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Add Stop Button ── */}
              {stops.length < MAX_STOPS && (
                <button
                  onClick={addStop}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 text-stone-500 text-sm font-medium hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-300 transition-all duration-200 mb-6"
                >
                  <Plus size={16} />
                  Add Stop ({MAX_STOPS - stops.length} remaining)
                </button>
              )}

              {/* ── Error ── */}
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                  <X size={16} className="shrink-0" /> {error}
                </div>
              )}

              {/* ── Submit Button ── */}
              <button
                onClick={handleOptimize}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Optimizing Route...
                  </>
                ) : (
                  <>
                    <Navigation size={20} />
                    Optimize Route
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── LOADING STATE ─────────── */}
      {isLoading && (
        <section className="relative pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center animate-pulse">
                  <Navigation size={20} className="text-amber-400 animate-spin" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-stone-200">
                    Optimizing Your Route
                  </h2>
                  <p className="text-xs text-stone-500">
                    AI is analyzing distances, durations, and attractions...
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
      {result && !isLoading && (
        <section ref={resultsRef} className="relative pb-12 md:pb-20 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-xs font-semibold text-green-400 mb-4">
                <Zap size={14} />
                Route Optimized — {result.optimizedStops.length} Stops
              </div>
              <h2 className="reveal stagger-1 text-3xl md:text-4xl font-extrabold text-stone-200 mb-2">
                Your <span className="text-gradient-warm">Optimized Route</span>
              </h2>
              <p className="reveal stagger-2 text-stone-500 text-sm max-w-xl mx-auto">
                AI has calculated the best route order, distances, and visit plans for your journey.
              </p>
            </div>

            {/* ── Route Path Preview ── */}
            <div className="reveal stagger-2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPinned size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Route Path</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {result.optimizedStops.map((stop, i) => (
                  <React.Fragment key={i}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-semibold">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-extrabold text-amber-400">
                        {i + 1}
                      </span>
                      {stop.name}
                    </span>
                    {i < result.optimizedStops.length - 1 && (
                      <ChevronRight size={14} className="text-stone-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="reveal stagger-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Total Distance */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                  <Gauge size={20} className="text-blue-400" />
                </div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Distance</p>
                <p className="text-xl font-extrabold text-stone-200">{result.totalDistance}</p>
              </div>

              {/* Total Time */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                  <Clock size={20} className="text-green-400" />
                </div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Time</p>
                <p className="text-xl font-extrabold text-stone-200">{result.totalTime}</p>
              </div>

              {/* Vehicle */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                  <Car size={20} className="text-purple-400" />
                </div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Vehicle</p>
                <p className="text-sm font-bold text-stone-200 leading-snug">{result.vehicleSuggestion}</p>
              </div>
            </div>

            {/* ── Route Timeline ── */}
            <div className="reveal stagger-4 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Route size={16} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-stone-200">Stop-by-Stop Itinerary</h3>
              </div>

              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-amber-500/5" />

                <div className="space-y-6">
                  {result.optimizedStops.map((stop, index) => {
                    const duration = getStopDuration(stop);
                    const tips = getStopTips(stop);
                    const attractions = getStopAttractions(stop);
                    const isFirst = index === 0;
                    const isLast = index === result.optimizedStops.length - 1;

                    return (
                      <div key={index} className="relative flex gap-5">
                        {/* Timeline Node */}
                        <div className="relative z-10 shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-2 ${
                              isFirst
                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                : isLast
                                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                  : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            }`}
                          >
                            {stop.order || index + 1}
                          </div>
                          {isFirst && (
                            <span className="block text-center text-[9px] font-bold text-green-400 mt-1 uppercase tracking-wider">Start</span>
                          )}
                          {isLast && (
                            <span className="block text-center text-[9px] font-bold text-red-400 mt-1 uppercase tracking-wider">End</span>
                          )}
                        </div>

                        {/* Stop Card */}
                        <div className="flex-1 bg-black/30 border border-white/5 rounded-2xl p-4 md:p-5 hover:border-white/10 transition-all duration-300 mb-2">
                          {/* Stop Name + Duration */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h4 className="text-base md:text-lg font-bold text-stone-200">
                              {stop.name}
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
                              <Clock size={10} />
                              {duration}
                            </span>
                            {isFirst && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                                Starting Point
                              </span>
                            )}
                            {isLast && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                Final Destination
                              </span>
                            )}
                          </div>

                          {/* Attractions */}
                          {attractions.length > 0 && (
                            <div className="mb-3">
                              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                                <Star size={10} className="inline mr-1 text-amber-400" />
                                Key Attractions
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {attractions.map((attr, attrIdx) => (
                                  <span
                                    key={attrIdx}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-stone-400"
                                  >
                                    <MapPin size={9} className="text-stone-600" />
                                    {attr}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tips */}
                          {tips && (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                              <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-stone-400 leading-relaxed">{tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Book This Route CTAs ── */}
            <div className="reveal stagger-5 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={20} />
                Get Detailed Quotation on WhatsApp
              </a>
              <a
                href="tel:+919108597154"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-stone-200 font-bold text-base hover:bg-white/10 transition-all"
              >
                <Phone size={20} className="text-amber-400" />
                Call Us: +91 91085 97154
              </a>
            </div>

            {/* ── Plan Another Route ── */}
            <div className="reveal text-center">
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-400 text-sm font-semibold hover:bg-white/5 hover:text-stone-200 transition-all"
              >
                <RotateCcw size={14} />
                Plan Another Route
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── FEATURES SECTION ─────────── */}
      {!result && !isLoading && (
        <section className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="reveal text-3xl md:text-4xl font-extrabold text-stone-200 mb-4">
                Why Use Our{' '}
                <span className="text-gradient-warm">Route Optimizer</span>
              </h2>
              <p className="reveal stagger-1 text-stone-500 max-w-xl mx-auto">
                Smart route planning powered by AI, backed by real travel experience across South India
              </p>
            </div>

            <div className="reveal stagger-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: <Navigation size={22} />,
                  color: 'amber',
                  title: 'AI-Optimized Routes',
                  desc: 'Our AI analyzes distances, road conditions, and experience flow to find the best stop order for your trip.',
                },
                {
                  icon: <Clock size={22} />,
                  color: 'green',
                  title: 'Time Estimates',
                  desc: 'Get realistic travel time and visit duration estimates for each stop, so you can plan your day perfectly.',
                },
                {
                  icon: <Car size={22} />,
                  color: 'purple',
                  title: 'Vehicle Suggestions',
                  desc: 'Get the best vehicle recommendation based on your route terrain, group size, and number of stops.',
                },
                {
                  icon: <MapPin size={22} />,
                  color: 'orange',
                  title: 'Attraction Discovery',
                  desc: 'Discover must-visit attractions at each stop curated by locals who know South India best.',
                },
                {
                  icon: <Lightbulb size={22} />,
                  color: 'rose',
                  title: 'Local Travel Tips',
                  desc: 'Get practical tips for each destination — from booking advice to the best time to visit attractions.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/15 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.color === 'amber'
                        ? 'bg-amber-500/10 text-amber-400'
                        : feature.color === 'green'
                          ? 'bg-green-500/10 text-green-400'
                          : feature.color === 'purple'
                            ? 'bg-purple-500/10 text-purple-400'
                              : feature.color === 'orange'
                                ? 'bg-orange-500/10 text-orange-400'
                                : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-stone-200 mb-2">{feature.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="reveal stagger-3 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { value: '500+', label: 'Routes Optimized', icon: Route },
                { value: '50+', label: 'Destinations', icon: MapPinned },
                { value: '96%', label: 'Accuracy Rate', icon: Zap },
                { value: '4.9/5', label: 'User Rating', icon: Star },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center"
                  >
                    <Icon size={20} className="text-amber-400 mx-auto mb-2" />
                    <p className="text-2xl font-extrabold text-stone-200">{stat.value}</p>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">{stat.label}</p>
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
              <span className="text-sm font-bold text-stone-400">
                RRM <span className="text-amber-400">Holidays</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
                Home
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
              >
                WhatsApp
              </a>
              <a href="tel:+919108597154" className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
                Call Us
              </a>
            </div>
            <p className="text-xs text-stone-600">
              © {new Date().getFullYear()} RRM Holidays, Mysuru. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
