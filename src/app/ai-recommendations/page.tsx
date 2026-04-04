'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Clock,
  Users,
  Phone,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Loader2,
  X,
  Calendar,
  Compass,
  Heart,
  Star,
  Shield,
  Headphones,
  Zap,
  CheckCircle2,
  Trophy,
  User,
  UserCheck,
  Baby,
  UsersRound,
  Building2,
  Plane,
  TrendingUp,
  Crown,
  Wand2,
  Globe,
} from 'lucide-react';

/* ─── Constants ─── */

const WHATSAPP_NUMBER = '919108597154';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
] as const;

type Language = typeof LANGUAGES[number]['code'];

const INTERESTS = [
  { label: 'Beaches', icon: '🏖️' },
  { label: 'Temples', icon: '🛕' },
  { label: 'Nature', icon: '🌿' },
  { label: 'Adventure', icon: '🧗' },
  { label: 'Food & Cuisine', icon: '🍽️' },
  { label: 'Culture & Heritage', icon: '🏛️' },
  { label: 'Wildlife', icon: '🦁' },
  { label: 'Hills & Mountains', icon: '⛰️' },
  { label: 'Water Sports', icon: '🚤' },
  { label: 'Photography', icon: '📸' },
  { label: 'Romantic Getaway', icon: '💑' },
  { label: 'Relaxation', icon: '🧘' },
  { label: 'Nightlife', icon: '🌃' },
  { label: 'History & Architecture', icon: '🏰' },
  { label: 'Scuba Diving', icon: '🤿' },
  { label: 'Trekking', icon: '🥾' },
];

const GROUP_TYPES = [
  { value: 'Solo', label: 'Solo', icon: User, desc: 'Just me exploring' },
  { value: 'Couple', label: 'Couple', icon: Heart, desc: 'Romantic getaway' },
  { value: 'Family', label: 'Family', icon: Baby, desc: 'Fun with family' },
  { value: 'Friends', label: 'Friends', icon: UsersRound, desc: 'Squad adventure' },
  { value: 'Corporate', label: 'Corporate', icon: Building2, desc: 'Team outing' },
];

const MONTHS = [
  'Flexible',
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TRAVEL_STYLES = [
  { value: 'Budget', label: 'Budget', icon: TrendingUp, desc: 'Value for money' },
  { value: 'Comfort', label: 'Comfort', icon: Star, desc: 'Best experience' },
  { value: 'Luxury', label: 'Luxury', icon: Crown, desc: 'No compromises' },
];

/* ─── Types ─── */

interface Recommendation {
  name: string;
  state: string;
  reason: string;
  matchPercent: number;
  budgetRange: string;
  bestTime: string;
  duration: string;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
}

/* ─── Match Circle Component ─── */

function MatchCircle({ percent }: { percent: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color =
    percent >= 90 ? '#22c55e' : percent >= 80 ? '#f59e0b' : '#3b82f6';

  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-base md:text-lg font-extrabold leading-none"
          style={{ color }}
        >
          {percent}%
        </span>
        <span className="text-[9px] text-stone-500 font-medium">Match</span>
      </div>
    </div>
  );
}

/* ─── State Badge Color ─── */

function getStateColor(state: string): string {
  const lower = state.toLowerCase();
  if (lower.includes('kerala')) return 'bg-green-500/10 text-green-400 border-green-500/20';
  if (lower.includes('karnataka')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  if (lower.includes('goa')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (lower.includes('tamil')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (lower.includes('andhra')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  if (lower.includes('telangana')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  if (lower.includes('andaman')) return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
  return 'bg-white/5 text-stone-400 border-white/10';
}

/* ─── Main Component ─── */

export default function AIRecommendationsPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [groupType, setGroupType] = useState('');
  const [month, setMonth] = useState('Flexible');
  const [travelStyle, setTravelStyle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

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

  /* Close month dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target as Node)) {
        setShowMonthDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* Scroll to results */
  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [results]);

  /* Toggle interest */
  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
    setError('');
  };

  /* Submit form */
  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest');
      return;
    }
    if (!groupType) {
      setError('Please select a group type');
      return;
    }
    if (!travelStyle) {
      setError('Please select a travel style');
      return;
    }

    setError('');
    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: selectedInterests,
          travelStyle,
          groupType,
          month: month === 'Flexible' ? undefined : month,
          language,
        }),
      });

      const data: RecommendationsResponse = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setResults(
          [...data.recommendations].sort((a, b) => b.matchPercent - a.matchPercent)
        );
      } else {
        setError('No recommendations found. Try different preferences.');
      }
    } catch {
      setError('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  /* WhatsApp link for specific destination */
  const getWhatsAppLink = (rec: Recommendation) => {
    const msg = `Hi RRM Holidays! 🌴\n\nI'm interested in planning a trip to *${rec.name}*, ${rec.state}.\n\n📋 *Trip Details:*\n• Destination: ${rec.name} (${rec.state})\n• Best Time: ${rec.bestTime}\n• Duration: ${rec.duration}\n• Group: ${groupType}\n• Interests: ${selectedInterests.join(', ')}\n\nPlease help me plan this trip!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  /* Reset form */
  const resetForm = () => {
    setSelectedInterests([]);
    setGroupType('');
    setMonth('Flexible');
    setTravelStyle('');
    setResults([]);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─── Loading Skeleton ─── */
  const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-neutral-900/80 border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-5 w-40 bg-white/5 rounded" />
                <div className="h-5 w-20 bg-white/5 rounded-full" />
              </div>
              <div className="flex gap-4">
                <div className="h-3 w-24 bg-white/5 rounded" />
                <div className="h-3 w-24 bg-white/5 rounded" />
                <div className="h-3 w-20 bg-white/5 rounded" />
              </div>
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-3/4 bg-white/5 rounded" />
            </div>
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
            <Link href="/ai-recommendations" className="text-sm font-medium text-amber-400">
              AI Recommendations
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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20want%20personalized%20travel%20recommendations.`}
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
              <Wand2 size={14} />
              AI-Powered Travel Matching
            </div>
          </div>
          <h1 className="reveal stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Personalized{' '}
            <span className="text-gradient-warm">Recommendations</span>
          </h1>
          <p className="reveal stagger-2 text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Tell us what you love, and our AI will find your perfect South India
            destination. Matched to your interests and travel style.
          </p>
        </div>
      </section>

      {/* ─────────── PREFERENCE FORM ─────────── */}
      {!results.length && !isLoading && (
        <section className="relative pb-12 md:pb-20" ref={formRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="reveal bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Compass size={20} className="text-amber-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-200">
                  Your Travel Preferences
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 ml-[52px]">
                Answer a few questions and let AI find your ideal destination
              </p>

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

                {/* ── 1. Interests (Multi-Select) ── */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Sparkles size={14} className="text-amber-400" />
                    Your Interests
                    <span className="text-[10px] font-normal text-stone-600 normal-case tracking-normal">
                      (select at least 1)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest.label);
                      return (
                        <button
                          key={interest.label}
                          onClick={() => toggleInterest(interest.label)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/5'
                              : 'bg-white/[0.02] border-white/10 text-stone-400 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <span>{interest.icon}</span>
                          <span>{interest.label}</span>
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-amber-400 ml-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedInterests.length > 0 && (
                    <p className="mt-2 text-xs text-amber-400/70">
                      {selectedInterests.length} interest{selectedInterests.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                {/* ── 2. Pricing Note ── */}
                <div className="px-4 py-3 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
                  <p className="text-xs text-green-400 font-medium">For custom pricing, contact us on WhatsApp</p>
                </div>

                {/* ── 3. Group Type ── */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Users size={14} className="text-amber-400" />
                    Group Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {GROUP_TYPES.map((type) => {
                      const isSelected = groupType === type.value;
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => {
                            setGroupType(type.value);
                            setError('');
                          }}
                          className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/5'
                              : 'bg-white/[0.02] border-white/10 text-stone-400 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-amber-500/20' : 'bg-white/5'
                            }`}
                          >
                            <Icon size={18} className={isSelected ? 'text-amber-400' : 'text-stone-500'} />
                          </div>
                          <span className="text-sm font-semibold">{type.label}</span>
                          <span className="text-[10px] text-stone-500">{type.desc}</span>
                          {isSelected && (
                            <CheckCircle2
                              size={14}
                              className="absolute top-2 right-2 text-amber-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── 4. Travel Month ── */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Calendar size={14} className="text-amber-400" />
                    Travel Month
                  </label>
                  <div className="relative" ref={monthDropdownRef}>
                    <button
                      onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                      className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-stone-200 text-sm hover:border-white/20 transition-all focus:outline-none focus:border-amber-500/50"
                    >
                      <span className={month !== 'Flexible' ? 'text-stone-200' : 'text-stone-500'}>
                        {month === 'Flexible' ? '🗓️  Any time works for me' : `🗓️  ${month}`}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-stone-500 transition-transform duration-200 ${
                          showMonthDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {showMonthDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl shadow-black/40 max-h-72 overflow-y-auto custom-scrollbar">
                        {MONTHS.map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setMonth(m);
                              setShowMonthDropdown(false);
                              setError('');
                            }}
                            className={`w-full text-left px-5 py-3 text-sm transition-all hover:bg-white/5 ${
                              month === m
                                ? 'text-amber-400 bg-amber-500/5'
                                : 'text-stone-300'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {month === m && <CheckCircle2 size={14} />}
                              {m === 'Flexible' ? '🗓️  Flexible (Any time)' : `🗓️  ${m}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── 5. Travel Style ── */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-400 mb-3 uppercase tracking-wider">
                    <Plane size={14} className="text-amber-400" />
                    Travel Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TRAVEL_STYLES.map((style) => {
                      const isSelected = travelStyle === style.value;
                      const Icon = style.icon;
                      return (
                        <button
                          key={style.value}
                          onClick={() => {
                            setTravelStyle(style.value);
                            setError('');
                          }}
                          className={`relative flex items-center gap-3 py-4 px-4 rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/5'
                              : 'bg-white/[0.02] border-white/10 text-stone-400 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-amber-500/20' : 'bg-white/5'
                            }`}
                          >
                            <Icon size={18} className={isSelected ? 'text-amber-400' : 'text-stone-500'} />
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-semibold block">{style.label}</span>
                            <span className="text-[10px] text-stone-500">{style.desc}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              size={14}
                              className="absolute top-2 right-2 text-amber-400"
                            />
                          )}
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
                  <Wand2 size={20} />
                  Get My Recommendations
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
                  <Wand2 size={20} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-stone-200">
                    Finding Your Perfect Destinations
                  </h2>
                  <p className="text-xs text-stone-500">
                    AI is analyzing your preferences...
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
      {results.length > 0 && !isLoading && (
        <section ref={resultsRef} className="relative pb-12 md:pb-20 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-xs font-semibold text-green-400 mb-4">
                <Trophy size={14} />
                {results.length} Destinations Found
              </div>
              <h2 className="reveal stagger-1 text-3xl md:text-4xl font-extrabold text-stone-200 mb-2">
                Your <span className="text-gradient-warm">Perfect Matches</span>
              </h2>
              <p className="reveal stagger-2 text-stone-500 text-sm max-w-xl mx-auto">
                Sorted by how well each destination matches your preferences
              </p>
            </div>

            {/* Preference Summary */}
            <div className="reveal stagger-2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-stone-500 font-medium">Your prefs:</span>
                {selectedInterests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300"
                  >
                    {interest}
                  </span>
                ))}
                {selectedInterests.length > 4 && (
                  <span className="text-stone-500">+{selectedInterests.length - 4} more</span>
                )}
                <span className="text-stone-700">|</span>
                <span className="text-stone-400">{groupType}</span>
                <span className="text-stone-700">|</span>
                <span className="text-stone-400">{travelStyle}</span>
                {month !== 'Flexible' && (
                  <>
                    <span className="text-stone-700">|</span>
                    <span className="text-stone-400">{month}</span>
                  </>
                )}
              </div>
            </div>

            {/* ── Recommendation Cards ── */}
            <div className="space-y-4">
              {results.map((rec, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={`${rec.name}-${rec.state}`}
                    className={`reveal stagger-${Math.min(index + 1, 6)} group bg-neutral-900/80 backdrop-blur-xl border rounded-2xl p-5 md:p-6 hover:border-white/15 transition-all duration-300 ${
                      rank === 1
                        ? 'border-amber-500/20 shadow-lg shadow-amber-500/5'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4 md:gap-5">
                      {/* Rank Badge */}
                      <div className="hidden sm:flex flex-col items-center gap-2 shrink-0 pt-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                            rank === 1
                              ? 'bg-amber-500/20 text-amber-400'
                              : rank === 2
                                ? 'bg-stone-500/20 text-stone-400'
                                : rank === 3
                                  ? 'bg-orange-500/20 text-orange-400'
                                  : 'bg-white/5 text-stone-500'
                          }`}
                        >
                          #{rank}
                        </div>
                      </div>

                      {/* Match Circle */}
                      <MatchCircle percent={rec.matchPercent} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name + State */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg md:text-xl font-bold text-stone-200 truncate">
                            {rec.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStateColor(
                              rec.state
                            )}`}
                          >
                            <MapPin size={9} />
                            {rec.state}
                          </span>
                          {rank === 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                              <Trophy size={9} />
                              Best Match
                            </span>
                          )}
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-green-400" />
                            {rec.bestTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-blue-400" />
                            {rec.duration}
                          </span>
                        </div>

                        {/* Reason */}
                        <p className="text-sm text-stone-400 leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                          {rec.reason}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={getWhatsAppLink(rec)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-semibold hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/10"
                          >
                            <MessageCircle size={14} />
                            Explore on WhatsApp
                          </a>
                          <a
                            href={getWhatsAppLink(rec)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-200 text-xs font-semibold hover:bg-white/10 hover:border-amber-500/20 transition-all"
                          >
                            <Plane size={14} className="text-amber-400" />
                            Plan This Trip
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Bottom CTA ── */}
            <div className="reveal mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20loved%20the%20AI%20recommendations%20and%20want%20to%20plan%20a%20trip.%nMy%20interests%3A%20${selectedInterests.join(', ')}%nGroup%3A%20${groupType}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={20} />
                Discuss with Travel Expert
              </a>
              <a
                href="tel:+919108597154"
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-stone-200 font-bold text-base hover:bg-white/10 transition-all"
              >
                <Phone size={20} className="text-amber-400" />
                Call Us: +91 91085 97154
              </a>
            </div>

            {/* ── Start Over ── */}
            <div className="reveal text-center mt-8">
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-400 text-sm font-semibold hover:bg-white/5 hover:text-stone-200 transition-all"
              >
                <ArrowRight size={14} className="rotate-180" />
                Start New Quiz
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── WHY TRAVELLERS LOVE OUR AI ─────────── */}
      {!results.length && !isLoading && (
        <section className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="reveal text-3xl md:text-4xl font-extrabold text-stone-200 mb-4">
                Why Travellers Love Our{' '}
                <span className="text-gradient-warm">AI</span>
              </h2>
              <p className="reveal stagger-1 text-stone-500 max-w-xl mx-auto">
                Powered by real travel data from thousands of trips across South India
              </p>
            </div>

            {/* Stats Row */}
            <div className="reveal stagger-2 grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { value: '96%', label: 'Match Accuracy', icon: Zap, color: 'amber' },
                { value: '50+', label: 'Destinations', icon: Compass, color: 'green' },
                { value: '5K+', label: 'Happy Travellers', icon: UserCheck, color: 'blue' },
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
                    <p className="text-xs text-stone-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'AI-Powered Matching',
                  desc: 'Our AI analyzes 50+ data points to match you with destinations that fit your unique travel personality.',
                  color: 'amber',
                },
                {
                  icon: Shield,
                  title: 'Verified Recommendations',
                  desc: 'Every suggestion is backed by real traveller experiences and verified data from our expert team.',
                  color: 'green',
                },
                {
                  icon: Headphones,
                  title: 'Expert Back-Up',
                  desc: 'Not sure about a recommendation? Our travel experts are just a WhatsApp message away.',
                  color: 'blue',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="reveal bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
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
                    <feature.icon
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
                  <h3 className="text-base font-bold text-stone-200 mb-2">
                    {feature.title}
                  </h3>
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
              <a
                href="tel:+919108597154"
                className="text-xs text-stone-500 hover:text-amber-400 transition-colors"
              >
                Call Us
              </a>
              <Link
                href="/"
                className="text-xs text-stone-500 hover:text-amber-400 transition-colors"
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
