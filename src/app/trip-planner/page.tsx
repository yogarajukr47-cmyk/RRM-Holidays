'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  CalendarDays,
  Users,
  Compass,
  Star,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sun,
  CloudSun,
  Moon,
  Car,
  Hotel,
  Clock,
  Lightbulb,
  ArrowRight,
  Loader2,
  X,
  Check,
  Globe,
} from 'lucide-react';

/* ─── Constants ─── */

const WHATSAPP_NUMBER = '919108597154';

const DESTINATIONS = [
  'Kerala',
  'Goa',
  'Karnataka / Mysuru',
  'Tamil Nadu',
  'Coorg',
  'Ooty',
  'Hampi',
  'Pondicherry',
  'Andhra Pradesh',
];

const INTERESTS = [
  { label: 'Beaches', emoji: '🏖️', value: 'Beaches' },
  { label: 'Temples', emoji: '🛕', value: 'Temples' },
  { label: 'Nature', emoji: '🌿', value: 'Nature' },
  { label: 'Adventure', emoji: '🏔️', value: 'Adventure' },
  { label: 'Food', emoji: '🍛', value: 'Food' },
  { label: 'Culture', emoji: '🎭', value: 'Culture' },
  { label: 'Wildlife', emoji: '🐘', value: 'Wildlife' },
  { label: 'Hills', emoji: '⛰️', value: 'Hills' },
];

const TRAVEL_STYLES = [
  { label: 'Budget', emoji: '💰', value: 'Budget' },
  { label: 'Comfort', emoji: '🛋️', value: 'Comfort' },
  { label: 'Luxury', emoji: '👑', value: 'Luxury' },
];

const TRAVELLER_TYPES = [
  { label: 'Solo', icon: Users, value: 'Solo' },
  { label: 'Couple', icon: Users, value: 'Couple' },
  { label: 'Family 3-4', icon: Users, value: 'Family 3-4' },
  { label: 'Group 5-10', icon: Users, value: 'Group 5-10' },
  { label: 'Large 10+', icon: Users, value: 'Large 10+' },
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

interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tip: string;
}

interface Itinerary {
  destination: string;
  summary: string;
  vehicleSuggestion: string;
  hotelSuggestion: string;
  days: DayPlan[];
}

/* ─── Component ─── */

export default function TripPlannerPage() {
  /* Form State */
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [travellers, setTravellers] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [itinerary, isLoading]);

  /* Close dest dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* Scroll to results */
  useEffect(() => {
    if (itinerary && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [itinerary]);

  /* Toggle interest */
  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  /* Toggle day expand */
  const toggleDay = (day: number) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  /* Generate itinerary */
  const handleGenerate = async () => {
    if (!destination) {
      setError('Please select a destination');
      return;
    }
    if (!travellers) {
      setError('Please select traveller type');
      return;
    }
    if (!travelStyle) {
      setError('Please select a travel style');
      return;
    }

    setError('');
    setIsLoading(true);
    setItinerary(null);
    setExpandedDay(null);

    try {
      const response = await fetch('/api/ai/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          travellers,
          interests,
          travelStyle,
          language,
        }),
      });

      const data = await response.json();

      if (data.itinerary) {
        setItinerary(data.itinerary);
        setExpandedDay(data.itinerary.days[0]?.day ?? null);
      } else {
        setError('Failed to generate itinerary. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  /* WhatsApp message */
  const getWhatsAppLink = () => {
    if (!itinerary) return '';
    const msg = `Hi RRM Holidays! 🌴\n\nI'm interested in a trip to *${itinerary.destination}*.\n\n📋 *Trip Details:*\n• Duration: ${itinerary.days.length} Days\n• Travellers: ${travellers}\n• Style: ${travelStyle}\n${interests.length > 0 ? `• Interests: ${interests.join(', ')}\n` : ''}\n• Vehicle: ${itinerary.vehicleSuggestion}\n• Stay: ${itinerary.hotelSuggestion}\n\nPlease share more details and confirm the booking!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  /* ─── Loading Skeleton ─── */
  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-white/5 mb-3" />
            <div className="h-3 w-16 bg-white/5 rounded mb-2" />
            <div className="h-5 w-24 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      {/* Overview */}
      <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6">
        <div className="h-4 w-32 bg-white/5 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-5/6 bg-white/5 rounded" />
          <div className="h-3 w-4/6 bg-white/5 rounded" />
        </div>
      </div>
      {/* Day cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-white/5 rounded mb-2" />
              <div className="h-3 w-20 bg-white/5 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="bg-white/[0.02] rounded-xl p-4">
                <div className="h-3 w-16 bg-white/5 rounded mb-2" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-4/5 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
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
            <Link href="/trip-planner" className="text-sm font-medium text-amber-400">
              AI Trip Planner
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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20trip%20with%20AI.`}
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
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl animate-morph" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs font-semibold text-amber-400 mb-6">
              <Sparkles size={14} />
              AI-Powered Trip Planning
            </div>
          </div>
          <h1 className="reveal stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Plan Your <span className="text-gradient-warm">Dream Trip</span> with AI
          </h1>
          <p className="reveal stagger-2 text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Tell us your destination & interests — our AI creates a personalized
            day-by-day itinerary in seconds. Powered by RRM Holidays&apos; local expertise.
          </p>
        </div>
      </section>

      {/* ─────────── TRIP PLANNER FORM ─────────── */}
      <section className="relative pb-12 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="reveal bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-200 mb-1">Customize Your Trip</h2>
            <p className="text-sm text-stone-500 mb-8">Fill in your preferences and let AI craft the perfect itinerary</p>

            <div className="space-y-8">
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

              {/* ── Destination ── */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                  <MapPin size={14} className="text-amber-400" /> Destination
                </label>
                <div className="relative" ref={destDropdownRef}>
                  <button
                    onClick={() => setShowDestDropdown(!showDestDropdown)}
                    className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-stone-200 text-sm hover:border-amber-500/30 transition-all focus:outline-none focus:border-amber-500/50"
                  >
                    <span className={destination ? 'text-stone-200' : 'text-stone-500'}>
                      {destination || 'Select a destination...'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-500 transition-transform duration-200 ${showDestDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showDestDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl shadow-black/40 max-h-64 overflow-y-auto custom-scrollbar">
                      {DESTINATIONS.map((dest) => (
                        <button
                          key={dest}
                          onClick={() => {
                            setDestination(dest);
                            setShowDestDropdown(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-sm transition-all hover:bg-white/5 ${
                            destination === dest
                              ? 'text-amber-400 bg-amber-500/5'
                              : 'text-stone-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {destination === dest && <Check size={14} />}
                            {dest}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Number of Days ── */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                  <CalendarDays size={14} className="text-amber-400" /> Number of Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 ${
                        days === d
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                          : 'bg-white/5 text-stone-400 border border-white/5 hover:bg-white/10 hover:text-stone-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Pricing Note ── */}
              <div className="px-4 py-3 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
                <p className="text-xs text-green-400 font-medium">For custom pricing, contact us on WhatsApp</p>
              </div>

              {/* ── Travellers ── */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                  <Users size={14} className="text-amber-400" /> Traveller Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRAVELLER_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTravellers(t.value)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        travellers === t.value
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                          : 'bg-white/5 text-stone-400 border border-white/5 hover:bg-white/10 hover:text-stone-200'
                      }`}
                    >
                      <t.icon size={14} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Interests (multi-select) ── */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                  <Compass size={14} className="text-amber-400" /> Interests
                  <span className="text-xs font-normal text-stone-600 ml-1">(select multiple)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest.value}
                      onClick={() => toggleInterest(interest.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        interests.includes(interest.value)
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                          : 'bg-white/5 text-stone-400 border border-white/5 hover:bg-white/10 hover:text-stone-200'
                      }`}
                    >
                      <span>{interest.emoji}</span>
                      <span>{interest.label}</span>
                      {interests.includes(interest.value) && <Check size={12} className="text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Travel Style ── */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                  <Star size={14} className="text-amber-400" /> Travel Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setTravelStyle(s.value)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        travelStyle === s.value
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                          : 'bg-white/5 text-stone-400 border border-white/5 hover:bg-white/10 hover:text-stone-200'
                      }`}
                    >
                      <span>{s.emoji}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Error ── */}
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <X size={16} /> {error}
                </div>
              )}

              {/* ── Generate Button ── */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating Your Perfect Itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate AI Itinerary
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
      {itinerary && !isLoading && (
        <section ref={resultsRef} className="relative pb-12 md:pb-20 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-xs font-semibold text-green-400 mb-4">
                <Check size={14} />
                Itinerary Generated
              </div>
              <h2 className="reveal text-3xl md:text-4xl font-extrabold text-stone-200 mb-2">
                Your <span className="text-gradient-warm">{itinerary.destination}</span> Trip
              </h2>
              <p className="text-stone-500 text-sm">
                {itinerary.days.length} days of adventure, curated just for you
              </p>
            </div>

            {/* ── Summary Cards ── */}
            <div className="reveal stagger-1 grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {/* Vehicle */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                  <Car size={18} className="text-blue-400" />
                </div>
                <p className="text-xs text-stone-500 mb-1">Vehicle</p>
                <p className="text-sm font-bold text-stone-200 leading-snug">
                  {itinerary.vehicleSuggestion?.split('-')[0]?.trim() || 'Sedan'}
                </p>
              </div>
              {/* Stay Area */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                  <Hotel size={18} className="text-purple-400" />
                </div>
                <p className="text-xs text-stone-500 mb-1">Stay Area</p>
                <p className="text-sm font-bold text-stone-200 leading-snug">
                  {itinerary.hotelSuggestion?.split(',')[0]?.trim() || 'City Center'}
                </p>
              </div>
              {/* Duration */}
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                  <Clock size={18} className="text-green-400" />
                </div>
                <p className="text-xs text-stone-500 mb-1">Duration</p>
                <p className="text-lg font-bold text-stone-200">
                  {itinerary.days.length} Day{itinerary.days.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* ── Trip Overview ── */}
            <div className="reveal stagger-2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h3 className="text-lg font-bold text-stone-200 mb-3 flex items-center gap-2">
                <Compass size={18} className="text-amber-400" /> Trip Overview
              </h3>
              <p className="text-stone-400 leading-relaxed text-sm md:text-base">
                {itinerary.summary}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Car size={14} className="text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-stone-400">
                    <span className="text-stone-300 font-medium">Vehicle:</span>{' '}
                    {itinerary.vehicleSuggestion}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Hotel size={14} className="text-purple-400 mt-0.5 shrink-0" />
                  <span className="text-stone-400">
                    <span className="text-stone-300 font-medium">Stay:</span>{' '}
                    {itinerary.hotelSuggestion}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Day-by-Day Itinerary ── */}
            <div className="space-y-4 mb-10">
              {itinerary.days.map((dayPlan, index) => (
                <div
                  key={dayPlan.day}
                  className={`reveal stagger-${Math.min(index + 1, 7)} bg-neutral-900/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 ${
                    expandedDay === dayPlan.day ? 'border-amber-500/20' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Day Header (clickable) */}
                  <button
                    onClick={() => toggleDay(dayPlan.day)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-sm shrink-0">
                        D{dayPlan.day}
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-stone-200">
                          {dayPlan.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-amber-400/60">Day {dayPlan.day} of {itinerary.days.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 ml-3">
                      {expandedDay === dayPlan.day ? (
                        <ChevronUp size={18} className="text-stone-500" />
                      ) : (
                        <ChevronDown size={18} className="text-stone-500" />
                      )}
                    </div>
                  </button>

                  {/* Day Content (expanded) */}
                  {expandedDay === dayPlan.day && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Morning */}
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Sun size={14} className="text-amber-400" />
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Morning</span>
                          </div>
                          <p className="text-sm text-stone-300 leading-relaxed">{dayPlan.morning}</p>
                        </div>
                        {/* Afternoon */}
                        <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CloudSun size={14} className="text-orange-400" />
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Afternoon</span>
                          </div>
                          <p className="text-sm text-stone-300 leading-relaxed">{dayPlan.afternoon}</p>
                        </div>
                        {/* Evening */}
                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Moon size={14} className="text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Evening</span>
                          </div>
                          <p className="text-sm text-stone-300 leading-relaxed">{dayPlan.evening}</p>
                        </div>
                      </div>

                      {/* Tip */}
                      <div className="flex items-start gap-2 px-4 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <Lightbulb size={14} className="text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-amber-300/80 leading-relaxed">{dayPlan.tip}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── CTA Buttons ── */}
            <div className="reveal grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={20} />
                Book on WhatsApp
              </a>
              <a
                href="tel:+919108597154"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-stone-200 font-bold text-base hover:bg-white/10 transition-all"
              >
                <Phone size={20} className="text-amber-400" />
                Call Us: +91 91085 97154
              </a>
            </div>

            {/* ── New Plan Button ── */}
            <div className="reveal text-center mt-8">
              <button
                onClick={() => {
                  setItinerary(null);
                  setExpandedDay(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-400 text-sm font-semibold hover:bg-white/5 hover:text-stone-200 transition-all"
              >
                <ArrowRight size={14} className="rotate-180" /> Plan Another Trip
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── WHY USE AI PLANNER ─────────── */}
      {!itinerary && !isLoading && (
        <section className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="reveal text-3xl md:text-4xl font-extrabold text-stone-200 mb-4">
                Why Use Our <span className="text-gradient-warm">AI Trip Planner?</span>
              </h2>
              <p className="reveal stagger-1 text-stone-500 max-w-xl mx-auto">
                Powered by years of local expertise and AI intelligence
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'Instant AI Planning',
                  desc: 'Get a detailed itinerary in seconds, not hours of research',
                  color: 'amber',
                },
                {
                  icon: MessageCircle,
                  title: 'Custom Pricing',
                  desc: 'Get personalized quotations via WhatsApp — no surprise expenses',
                  color: 'green',
                },
                {
                  icon: MapPin,
                  title: 'Local Expertise',
                  desc: 'Real South India knowledge from RRM Holidays\' experienced team',
                  color: 'blue',
                },
                {
                  icon: Phone,
                  title: 'Easy Booking',
                  desc: 'One-click WhatsApp booking — no forms, no waiting',
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
                className="text-xs text-stone-500 hover:text-green-400 transition-colors"
              >
                WhatsApp
              </a>
              <a href="tel:+919108597154" className="text-xs text-stone-500 hover:text-amber-400 transition-colors">
                Call Us
              </a>
              <Link href="/" className="text-xs text-stone-500 hover:text-amber-400 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
