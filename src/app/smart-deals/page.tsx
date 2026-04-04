'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Car,
  Users,
  Phone,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Loader2,
  X,
  Route,
  Calendar,
  Lightbulb,
  MapPinned,
  Star,
  Shield,
  Headphones,
  Zap,
  CheckCircle2,
  Globe,
  Navigation,
} from 'lucide-react';

/* ─── Constants ─── */

const WHATSAPP_NUMBER = '919108597154';

const VEHICLE_TYPES = [
  { value: 'Need Suggestion', label: 'Need Suggestion' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'MUV/Innova', label: 'MUV / Innova' },
  { value: 'Premium MUV/Crysta', label: 'Premium MUV / Crysta' },
  { value: 'Tempo Traveller', label: 'Tempo Traveller' },
  { value: 'Mini Bus', label: 'Mini Bus' },
  { value: 'Bus', label: 'Bus' },
];

const POPULAR_ROUTES = [
  { from: 'Mysuru', to: 'Ooty', distance: '160 km', time: '4.5 hrs' },
  { from: 'Bengaluru', to: 'Goa', distance: '560 km', time: '10 hrs' },
  { from: 'Chennai', to: 'Pondicherry', distance: '150 km', time: '3 hrs' },
  { from: 'Kochi', to: 'Munnar', distance: '130 km', time: '4 hrs' },
  { from: 'Bengaluru', to: 'Coorg', distance: '260 km', time: '5.5 hrs' },
  { from: 'Mysuru', to: 'Hampi', distance: '350 km', time: '7 hrs' },
];

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
] as const;

type Language = typeof LANGUAGES[number]['code'];

/* ─── Types ─── */

interface PopularRoutesResult {
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  vehicleSuggestion: string;
  tips: string[];
  bestTimeToVisit: string;
  placesEnRoute: string[];
}

/* ─── Component ─── */

export default function SmartDealsPage() {
  /* Form State */
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [travellers, setTravellers] = useState('');
  const [vehicleType, setVehicleType] = useState('Need Suggestion');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PopularRoutesResult | null>(null);
  const [error, setError] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);
  const vehicleDropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('active');
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [result, isLoading]);

  /* Close vehicle dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(e.target as Node)) {
        setShowVehicleDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* Scroll to results */
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [result]);

  /* Fill popular route */
  const fillRoute = (routeFrom: string, routeTo: string) => {
    setFrom(routeFrom);
    setTo(routeTo);
    setError('');
    setResult(null);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  /* Submit form */
  const handleSubmit = async () => {
    if (!from.trim()) {
      setError('Please enter a departure city');
      return;
    }
    if (!to.trim()) {
      setError('Please enter a destination city');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/smart-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: from.trim(),
          to: to.trim(),
          travellers: travellers || undefined,
          vehicleType: vehicleType !== 'Need Suggestion' ? vehicleType : undefined,
          language,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data as PopularRoutesResult);
      }
    } catch {
      setError('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  /* WhatsApp message */
  const getWhatsAppLink = () => {
    if (!result) return '';
    const msg = `Hi RRM Holidays! 🌴\n\nI'm interested in a trip from *${result.from}* to *${result.to}*.\n\n📋 *Route Details:*\n• Distance: ${result.distance}\n• Est. Time: ${result.estimatedTime}\n• Travellers: ${travellers || 'Not specified'}\n• Vehicle: ${vehicleType}\n\nPlease share a detailed quotation!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  /* Get quote link for popular route card */
  const getRouteQuoteLink = (routeFrom: string, routeTo: string, dist: string, time: string) => {
    const msg = `Hi RRM Holidays! 🌴\n\nI'm interested in a trip from *${routeFrom}* to *${routeTo}*.\n\n📋 *Route Details:*\n• Distance: ${dist}\n• Est. Time: ${time}\n\nPlease share a detailed quotation!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  /* ─── Loading Skeleton ─── */
  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5" />
          <div className="flex-1">
            <div className="h-5 w-48 bg-white/5 rounded mb-2" />
            <div className="h-3 w-32 bg-white/5 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/[0.02] rounded-xl p-4">
              <div className="h-3 w-16 bg-white/5 rounded mb-2" />
              <div className="h-5 w-20 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6">
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-white/5 mt-0.5 shrink-0" />
              <div className="flex-1 h-3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
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
            <Link href="/smart-deals" className="text-sm font-medium text-amber-400">
              Popular Routes
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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20trip.`}
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
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl animate-morph" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs font-semibold text-amber-400 mb-6">
              <Route size={14} />
              Explore Popular Routes
            </div>
          </div>
          <h1 className="reveal stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Popular <span className="text-gradient-warm">Routes</span>
          </h1>
          <p className="reveal stagger-2 text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover the most loved travel routes across South India. Get AI-powered
            route details, en-route attractions, and personalized quotes on WhatsApp.
          </p>
        </div>
      </section>

      {/* ─────────── POPULAR ROUTES ─────────── */}
      {!result && !isLoading && (
        <section className="relative pb-8 md:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="reveal text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-stone-200 mb-2">Popular Routes</h2>
              <p className="text-sm text-stone-500">Click any route to instantly fill the form</p>
            </div>
            <div className="reveal stagger-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={`${route.from}-${route.to}`}
                  onClick={() => fillRoute(route.from, route.to)}
                  className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-amber-500/30 hover:bg-neutral-900/90 transition-all group text-left"
                >
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2">
                    <MapPin size={10} className="text-amber-400 shrink-0" />
                    <span className="truncate">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400/50 mb-2">
                    <ArrowRight size={10} />
                    <span className="text-[10px]">→</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                    <MapPinned size={10} className="text-green-400 shrink-0" />
                    <span className="truncate">{route.to}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-stone-600 mb-3">
                    <span>{route.distance}</span>
                    <span className="flex items-center gap-0.5"><Clock size={8} />{route.time}</span>
                  </div>
                  <a
                    href={getRouteQuoteLink(route.from, route.to, route.distance, route.time)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-green-600/10 border border-green-500/20 text-green-400 text-[10px] font-medium hover:bg-green-600/20 transition-all"
                  >
                    <MessageCircle size={10} />
                    Get Quote
                  </a>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────── FORM ─────────── */}
      <section className="relative pb-12 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="reveal bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-200 mb-1">Explore a Route</h2>
            <p className="text-sm text-stone-500 mb-8">Enter your route details for AI-powered route information</p>

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

              {/* ── From & To (2-col) ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <MapPin size={14} className="text-amber-400" /> From City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => { setFrom(e.target.value); setError(''); }}
                      placeholder="e.g. Bengaluru, Mysuru..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-stone-200 text-sm placeholder:text-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                      suppressHydrationWarning
                    />
                    {from && (
                      <button
                        onClick={() => setFrom('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* To */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <MapPinned size={14} className="text-green-400" /> To City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => { setTo(e.target.value); setError(''); }}
                      placeholder="e.g. Ooty, Goa, Coorg..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-stone-200 text-sm placeholder:text-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                      suppressHydrationWarning
                    />
                    {to && (
                      <button
                        onClick={() => setTo('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Travellers & Vehicle Type (2-col) ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Travellers */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Users size={14} className="text-amber-400" /> No. of Travellers
                  </label>
                  <input
                    type="number"
                    value={travellers}
                    onChange={(e) => setTravellers(e.target.value)}
                    placeholder="e.g. 4"
                    min={1}
                    max={50}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-stone-200 text-sm placeholder:text-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                    suppressHydrationWarning
                  />
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Car size={14} className="text-amber-400" /> Vehicle Type
                  </label>
                  <div className="relative" ref={vehicleDropdownRef}>
                    <button
                      onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                      className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-stone-200 text-sm hover:border-white/20 transition-all focus:outline-none focus:border-amber-500/50"
                    >
                      <span className={vehicleType !== 'Need Suggestion' ? 'text-stone-200' : 'text-stone-500'}>
                        {vehicleType}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-stone-500 transition-transform duration-200 ${showVehicleDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {showVehicleDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl shadow-black/40 max-h-64 overflow-y-auto custom-scrollbar">
                        {VEHICLE_TYPES.map((vt) => (
                          <button
                            key={vt.value}
                            onClick={() => {
                              setVehicleType(vt.value);
                              setShowVehicleDropdown(false);
                            }}
                            className={`w-full text-left px-5 py-3 text-sm transition-all hover:bg-white/5 ${
                              vehicleType === vt.value
                                ? 'text-amber-400 bg-amber-500/5'
                                : 'text-stone-300'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {vehicleType === vt.value && <CheckCircle2 size={14} />}
                              {vt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
                    Analyzing Route...
                  </>
                ) : (
                  <>
                    <Navigation size={20} />
                    Explore Route
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── LOADING STATE ─────────── */}
      {isLoading && (
        <section className="relative pb-12 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <LoadingSkeleton />
          </div>
        </section>
      )}

      {/* ─────────── RESULTS ─────────── */}
      {result && !isLoading && (
        <section ref={resultsRef} className="relative pb-12 md:pb-20 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-xs font-semibold text-green-400 mb-4">
                <CheckCircle2 size={14} />
                Route Found
              </div>
              <h2 className="reveal text-3xl md:text-4xl font-extrabold text-stone-200 mb-2">
                <span className="text-gradient-warm">{result.from}</span> → <span className="text-gradient-warm">{result.to}</span>
              </h2>
              <p className="text-stone-500 text-sm">
                AI-powered route details for your journey
              </p>
            </div>

            {/* ── Route Info Card ── */}
            <div className="reveal stagger-1 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Route size={22} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-200">Route Information</h3>
                    <p className="text-xs text-stone-500">{result.from} to {result.to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                  <CheckCircle2 size={12} /> AI Verified
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                    <Route size={16} className="text-amber-400" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">Distance</p>
                  <p className="text-lg font-bold text-stone-200">{result.distance}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                    <Clock size={16} className="text-blue-400" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">Est. Time</p>
                  <p className="text-lg font-bold text-stone-200">{result.estimatedTime}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                    <Calendar size={16} className="text-green-400" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">Best Time</p>
                  <p className="text-sm font-bold text-stone-200 leading-snug">{result.bestTimeToVisit}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                    <Users size={16} className="text-purple-400" />
                  </div>
                  <p className="text-xs text-stone-500 mb-1">Travellers</p>
                  <p className="text-lg font-bold text-stone-200">{travellers || 'Flexible'}</p>
                </div>
              </div>
            </div>

            {/* ── Vehicle Suggestion Card ── */}
            <div className="reveal stagger-2 bg-gradient-to-r from-amber-500/5 to-amber-600/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 md:p-8 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Star size={22} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-200 mb-1">Recommended Vehicle</h3>
                  <p className="text-stone-300 text-sm md:text-base leading-relaxed">{result.vehicleSuggestion}</p>
                </div>
              </div>
            </div>

            {/* ── Places En Route ── */}
            {result.placesEnRoute && result.placesEnRoute.length > 0 && (
              <div className="reveal stagger-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
                <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
                  <MapPinned size={18} className="text-amber-400" />
                  Places En Route
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.placesEnRoute.map((place, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/15 transition-colors"
                    >
                      <MapPin size={10} className="text-amber-400" />
                      {place}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Travel Tips ── */}
            {result.tips && result.tips.length > 0 && (
              <div className="reveal stagger-4 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
                <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-400" />
                  Travel Tips
                </h3>
                <div className="space-y-3">
                  {result.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-400">{index + 1}</span>
                      </div>
                      <p className="text-sm text-stone-400 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CTA Buttons ── */}
            <div className="reveal stagger-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={20} />
                Get Quote on WhatsApp
              </a>
              <a
                href="tel:+919108597154"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-stone-200 font-bold text-base hover:bg-white/10 transition-all"
              >
                <Phone size={20} className="text-amber-400" />
                Call Us: +91 91085 97154
              </a>
            </div>

            {/* ── New Route Button ── */}
            <div className="reveal text-center mt-8">
              <button
                onClick={() => {
                  setResult(null);
                  setFrom('');
                  setTo('');
                  setTravellers('');
                  setVehicleType('Need Suggestion');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-400 text-sm font-semibold hover:bg-white/5 hover:text-stone-200 transition-all"
              >
                <ArrowRight size={14} className="rotate-180" /> Explore Another Route
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── WHY BOOK WITH RRM ─────────── */}
      {!result && !isLoading && (
        <section className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="reveal text-3xl md:text-4xl font-extrabold text-stone-200 mb-4">
                Why Travel with <span className="text-gradient-warm">RRM Holidays?</span>
              </h2>
              <p className="reveal stagger-1 text-stone-500 max-w-xl mx-auto">
                Trusted by thousands of travellers across South India
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Trusted Service',
                  desc: 'Reliable, safe, and comfortable journeys with experienced drivers who know every route.',
                  color: 'amber',
                },
                {
                  icon: Zap,
                  title: 'Instant Route Info',
                  desc: 'AI-powered route analysis gives you detailed travel information in seconds.',
                  color: 'green',
                },
                {
                  icon: Car,
                  title: 'Wide Vehicle Fleet',
                  desc: 'From sedans to tempo travellers — choose the perfect vehicle for your group size.',
                  color: 'blue',
                },
                {
                  icon: Headphones,
                  title: '24/7 Support',
                  desc: 'Our team is available round the clock on WhatsApp and phone. Plan your trip anytime, anywhere.',
                  color: 'purple',
                },
              ].map((feature, i) => (
                <div
                  key={feature.title}
                  className={`reveal stagger-${i + 1} bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.color === 'amber'
                        ? 'bg-amber-500/10'
                        : feature.color === 'green'
                          ? 'bg-green-500/10'
                          : feature.color === 'blue'
                            ? 'bg-blue-500/10'
                            : 'bg-purple-500/10'
                    }`}
                  >
                    <feature.icon
                      size={22}
                      className={
                        feature.color === 'amber'
                          ? 'text-amber-400'
                          : feature.color === 'green'
                            ? 'text-green-400'
                            : feature.color === 'blue'
                              ? 'text-blue-400'
                              : 'text-purple-400'
                      }
                    />
                  </div>
                  <h3 className="text-base font-bold text-stone-200 mb-2">{feature.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────── FOOTER ─────────── */}
      <footer className="relative border-t border-white/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-xs">
                R
              </div>
              <span className="text-lg font-bold text-stone-100">
                RRM <span className="text-amber-400">Holidays</span>
              </span>
            </Link>
            <p className="text-xs text-stone-600">
              &copy; {new Date().getFullYear()} RRM Holidays. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="tel:+919108597154"
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
              >
                Call Us
              </a>
              <Link href="/" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
