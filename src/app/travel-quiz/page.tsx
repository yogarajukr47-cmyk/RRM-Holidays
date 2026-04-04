'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Users, Heart, User, Mountain, Waves, Building2, TreePine,
  Sparkles, MessageCircle, RotateCcw, ArrowRight, ArrowLeft,
  Calendar, Clock, Crown, PartyPopper, Share2, ChevronRight
} from 'lucide-react';

const WHATSAPP_NUMBER = '919108597154';

// ─── TYPES ───────────────────────────────────────────
interface QuizAnswers {
  group: string;
  vibe: string;
  days: string;
  when: string;
  budget: string;
}

interface QuizResult {
  score: number;
  title: string;
  emoji: string;
  destinations: {
    name: string;
    state: string;
    reason: string;
    img: string;
    matchPercent: number;
  }[];
}

// ─── QUIZ DATA ───────────────────────────────────────
const GROUP_OPTIONS = [
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', icon: Users, desc: 'Kid-friendly, safe, memorable' },
  { id: 'couple', label: 'Couple', emoji: '💑', icon: Heart, desc: 'Romance, sunsets, intimacy' },
  { id: 'friends', label: 'Friends Group', emoji: '🥳', icon: PartyPopper, desc: 'Adventures, nightlife, bonding' },
  { id: 'solo', label: 'Solo', emoji: '🧘', icon: User, desc: 'Self-discovery, freedom, peace' },
];

const VIBE_OPTIONS = [
  { id: 'mountains', label: 'Mountains', emoji: '🏔️', icon: Mountain, desc: 'Hills, treks, cool breeze' },
  { id: 'beaches', label: 'Beaches', emoji: '🏖️', icon: Waves, desc: 'Sand, surf, sunsets' },
  { id: 'temples', label: 'Temples', emoji: '🛕', icon: Building2, desc: 'Heritage, spirituality, architecture' },
  { id: 'nature', label: 'Nature', emoji: '🌿', icon: TreePine, desc: 'Wildlife, forests, waterfalls' },
  { id: 'cities', label: 'Cities', emoji: '🏙️', icon: Building2, desc: 'Food, culture, urban vibes' },
  { id: 'relax', label: 'Relax', emoji: '😌', icon: Sparkles, desc: 'Spa, houseboat, slow travel' },
];

const DAYS_OPTIONS = [
  { id: 'weekend', label: 'Weekend', sub: '1–2 days', emoji: '⚡' },
  { id: 'short', label: 'Short Trip', sub: '3–4 days', emoji: '🎒' },
  { id: 'week', label: 'Full Week', sub: '5–7 days', emoji: '🌍' },
  { id: 'extended', label: 'Extended', sub: '8+ days', emoji: '✨' },
];

const WHEN_OPTIONS = [
  { id: 'this-month', label: 'This Month', emoji: '📅' },
  { id: 'next-month', label: 'Next Month', emoji: '🗓️' },
  { id: 'flexible', label: 'Flexible', emoji: '🤷' },
];

const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Budget', emoji: '💰', desc: 'Best value, smart spending' },
  { id: 'comfortable', label: 'Comfortable', emoji: '🏨', desc: 'Good hotels, private transport' },
  { id: 'premium', label: 'Premium', emoji: '⭐', desc: 'Luxury stays, curated experiences' },
  { id: 'luxury', label: 'Luxury', emoji: '👑', desc: 'Top-tier, no compromises' },
];

const STEPS = [
  { key: 'group' as const, title: "Who's traveling?", subtitle: 'Pick your travel crew' },
  { key: 'vibe' as const, title: "What's your vibe?", subtitle: 'Choose your ideal experience' },
  { key: 'days' as const, title: 'How many days?', subtitle: 'Trip duration' },
  { key: 'when' as const, title: 'When are you going?', subtitle: 'Travel timing' },
  { key: 'budget' as const, title: 'Travel style?', subtitle: 'Your comfort preference' },
];

// ─── DESTINATION DATABASE ────────────────────────────
interface Destination {
  name: string;
  state: string;
  img: string;
  tags: string[];
  groupMatch: string[];
  daysMatch: string[];
}

const DESTINATIONS: Destination[] = [
  { name: 'Mysuru Palace & Coorg', state: 'Karnataka', img: '/gallery-1-mysuru-palace.jpg', tags: ['temples', 'cities', 'nature'], groupMatch: ['family', 'couple', 'friends'], daysMatch: ['weekend', 'short'] },
  { name: 'Hampi Ruins', state: 'Karnataka', img: '/gallery-3-hampi-ruins.jpg', tags: ['temples', 'nature', 'mountains'], groupMatch: ['solo', 'friends', 'couple'], daysMatch: ['weekend', 'short'] },
  { name: 'Coorg Coffee Trails', state: 'Karnataka', img: '/gallery-4-coorg-hills.jpg', tags: ['nature', 'mountains', 'relax'], groupMatch: ['couple', 'family', 'solo'], daysMatch: ['weekend', 'short'] },
  { name: 'Chikmagalur Trek', state: 'Karnataka', img: '/gallery-4-coorg-hills.jpg', tags: ['mountains', 'nature'], groupMatch: ['friends', 'solo'], daysMatch: ['weekend'] },
  { name: 'Alleppey Backwaters', state: 'Kerala', img: '/gallery-2-kerala-backwater.jpg', tags: ['relax', 'nature', 'beaches'], groupMatch: ['couple', 'family', 'solo'], daysMatch: ['short', 'week'] },
  { name: 'Munnar Tea Gardens', state: 'Kerala', img: '/gallery-7-munnar-tea.jpg', tags: ['mountains', 'nature', 'relax'], groupMatch: ['couple', 'family', 'friends'], daysMatch: ['short', 'week'] },
  { name: 'Kovalam Beach', state: 'Kerala', img: '/gallery-5-goa-beach.jpg', tags: ['beaches', 'relax'], groupMatch: ['couple', 'family', 'solo'], daysMatch: ['weekend', 'short'] },
  { name: 'Thekkady Wildlife', state: 'Kerala', img: '/gallery-4-coorg-hills.jpg', tags: ['nature', 'mountains'], groupMatch: ['family', 'friends', 'couple'], daysMatch: ['short', 'week'] },
  { name: 'Meenakshi Temple', state: 'Tamil Nadu', img: '/gallery-8-temple.jpg', tags: ['temples', 'cities'], groupMatch: ['family', 'solo', 'couple'], daysMatch: ['weekend', 'short'] },
  { name: 'Nilgiri Toy Train', state: 'Tamil Nadu', img: '/gallery-6-ooty-train.jpg', tags: ['mountains', 'nature', 'relax'], groupMatch: ['family', 'couple', 'friends'], daysMatch: ['short', 'week'] },
  { name: 'Ooty & Coonoor', state: 'Tamil Nadu', img: '/gallery-6-ooty-train.jpg', tags: ['mountains', 'nature', 'relax'], groupMatch: ['family', 'couple', 'solo'], daysMatch: ['short', 'week'] },
  { name: 'Kodaikanal', state: 'Tamil Nadu', img: '/gallery-4-coorg-hills.jpg', tags: ['mountains', 'nature', 'relax'], groupMatch: ['couple', 'family', 'friends'], daysMatch: ['short', 'week'] },
  { name: 'Baga Beach', state: 'Goa', img: '/gallery-5-goa-beach.jpg', tags: ['beaches', 'cities'], groupMatch: ['friends', 'couple', 'solo'], daysMatch: ['weekend', 'short'] },
  { name: 'Old Goa Heritage', state: 'Goa', img: '/gallery-8-temple.jpg', tags: ['temples', 'cities'], groupMatch: ['solo', 'couple', 'family'], daysMatch: ['weekend'] },
  { name: 'Palolem Beach', state: 'Goa', img: '/gallery-5-goa-beach.jpg', tags: ['beaches', 'relax', 'nature'], groupMatch: ['couple', 'solo', 'friends'], daysMatch: ['short', 'week'] },
  { name: 'Dudhsagar Falls', state: 'Goa', img: '/gallery-4-coorg-hills.jpg', tags: ['nature', 'mountains'], groupMatch: ['friends', 'solo', 'family'], daysMatch: ['weekend'] },
  { name: 'Tirupati Temple', state: 'Andhra', img: '/gallery-8-temple.jpg', tags: ['temples'], groupMatch: ['family', 'solo'], daysMatch: ['weekend', 'short'] },
  { name: 'Araku Valley', state: 'Andhra', img: '/gallery-4-coorg-hills.jpg', tags: ['mountains', 'nature', 'relax'], groupMatch: ['couple', 'friends', 'family'], daysMatch: ['short', 'week'] },
  { name: 'Gandikota Gorge', state: 'Andhra', img: '/gallery-8-temple.jpg', tags: ['nature', 'mountains'], groupMatch: ['friends', 'solo'], daysMatch: ['weekend', 'short'] },
  { name: 'Marina Beach Chennai', state: 'Tamil Nadu', img: '/gallery-5-goa-beach.jpg', tags: ['beaches', 'cities'], groupMatch: ['family', 'friends', 'solo'], daysMatch: ['weekend'] },
];

// ─── PERSONALITY TITLES ──────────────────────────────
const PERSONALITY_TITLES: Record<string, Record<string, { title: string; emoji: string }>> = {
  family: {
    mountains: { title: 'The Adventurous Family', emoji: '🏔️👨‍👩‍👧‍👦' },
    beaches: { title: 'The Beach-loving Family', emoji: '🏖️👨‍👩‍👧‍👦' },
    temples: { title: 'The Spiritual Family', emoji: '🛕👨‍👩‍👧‍👦' },
    nature: { title: 'The Nature-exploring Family', emoji: '🌿👨‍👩‍👧‍👦' },
    cities: { title: 'The Urban Family', emoji: '🏙️👨‍👩‍👧‍👦' },
    relax: { title: 'The Chill Family', emoji: '😌👨‍👩‍👧‍👦' },
  },
  couple: {
    mountains: { title: 'The Romantic Wanderers', emoji: '🌅💑' },
    beaches: { title: 'The Beach Lovers', emoji: '🌊💑' },
    temples: { title: 'The Devotional Duo', emoji: '🛕💑' },
    nature: { title: 'The Nature-loving Couple', emoji: '🌿💑' },
    cities: { title: 'The City Explorers', emoji: '🏙️💑' },
    relax: { title: 'The Serenity Seekers', emoji: '😌💑' },
  },
  friends: {
    mountains: { title: 'The Thrill-seeking Squad', emoji: '🏔️🥳' },
    beaches: { title: 'The Party Paradisers', emoji: '🏖️🥳' },
    temples: { title: 'The Culture Crew', emoji: '🛕🥳' },
    nature: { title: 'The Adventure Gang', emoji: '🌿🥳' },
    cities: { title: 'The Urban Nomads', emoji: '🏙️🥳' },
    relax: { title: 'The Chill Squad', emoji: '😌🥳' },
  },
  solo: {
    mountains: { title: 'The Lone Peak Seeker', emoji: '🏔️🧘' },
    beaches: { title: 'The Solitary Soul-searcher', emoji: '🏖️🧘' },
    temples: { title: 'The Spiritual Pilgrim', emoji: '🛕🧘' },
    nature: { title: 'The Wilderness Wanderer', emoji: '🌿🧘' },
    cities: { title: 'The Urban Explorer', emoji: '🏙️🧘' },
    relax: { title: 'The Zen Traveler', emoji: '😌🧘' },
  },
};

// ─── MATCHING ALGORITHM ──────────────────────────────
function computeResults(answers: QuizAnswers): QuizResult {
  const scored = DESTINATIONS.map((dest) => {
    let score = 0;

    // Vibe match (highest weight)
    if (dest.tags.includes(answers.vibe)) score += 40;
    // Check partial vibe match (at least one tag overlap)
    const vibeMap: Record<string, string[]> = {
      mountains: ['mountains', 'nature'],
      beaches: ['beaches', 'relax'],
      temples: ['temples', 'cities'],
      nature: ['nature', 'mountains'],
      cities: ['cities', 'temples'],
      relax: ['relax', 'beaches', 'nature'],
    };
    if (vibeMap[answers.vibe]?.some(t => dest.tags.includes(t)) && !dest.tags.includes(answers.vibe)) {
      score += 20;
    }

    // Group match
    if (dest.groupMatch.includes(answers.group)) score += 25;

    // Days match
    if (dest.daysMatch.includes(answers.days)) score += 20;

    // Budget bonus
    if (answers.budget === 'luxury' && ['mountains', 'beaches', 'relax'].includes(answers.vibe)) score += 5;
    if (answers.budget === 'budget' && ['nature', 'mountains', 'temples'].includes(answers.vibe)) score += 5;

    return { ...dest, score: Math.min(score, 100) };
  });

  scored.sort((a, b) => b.score - a.score);

  const top3 = scored.slice(0, 3).map((d, i) => ({
    name: d.name,
    state: d.state,
    reason: getReason(d, answers),
    img: d.img,
    matchPercent: Math.max(60 + (i === 0 ? 35 : i === 1 ? 22 : 15) - i * 8 + Math.floor(Math.random() * 5), 60),
  }));

  const personality = PERSONALITY_TITLES[answers.group]?.[answers.vibe] || { title: 'The Curious Traveler', emoji: '✨' };

  return {
    score: top3[0]?.matchPercent || 85,
    title: personality.title,
    emoji: personality.emoji,
    destinations: top3,
  };
}

function getReason(dest: Destination, answers: QuizAnswers): string {
  const reasons: string[] = [];

  if (answers.group === 'family') reasons.push('family-friendly activities', 'safe environment', 'great for all ages');
  if (answers.group === 'couple') reasons.push('romantic settings', 'intimate experiences', 'perfect for two');
  if (answers.group === 'friends') reasons.push('group adventures', 'vibrant nightlife', 'unforgettable bonding');
  if (answers.group === 'solo') reasons.push('peaceful solitude', 'self-discovery', 'safe for solo travelers');

  if (answers.vibe === 'mountains') reasons.push('breathtaking mountain views');
  if (answers.vibe === 'beaches') reasons.push('stunning coastline', 'golden sands');
  if (answers.vibe === 'temples') reasons.push('rich cultural heritage');
  if (answers.vibe === 'nature') reasons.push('pristine natural beauty');
  if (answers.vibe === 'cities') reasons.push('vibrant city life');
  if (answers.vibe === 'relax') reasons.push('ultimate relaxation');

  const unique = [...new Set(reasons)];
  const picked = unique.sort(() => Math.random() - 0.5).slice(0, 2);
  return `Perfect for ${picked.join(' and ')}. Located in ${dest.state} — an experience you will remember forever.`;
}

// ─── ANIMATED NUMBER ─────────────────────────────────
function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <>{current}</>;
}

// ─── MATCH CIRCLE ────────────────────────────────────
function MatchCircle({ percent, size = 120 }: { percent: number; size?: number }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [delayedPercent, setDelayedPercent] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedPercent(percent), 300);
    const timer2 = setTimeout(() => setDelayedPercent(percent), 100);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [percent]);

  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;

  const color = delayedPercent >= 90 ? '#22c55e' : delayedPercent >= 80 ? '#f59e0b' : '#3b82f6';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[1500ms] ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-white">
          <AnimatedNumber target={percent} />
          <span className="text-sm text-white/60">%</span>
        </span>
        <span className="text-[10px] text-white/40 font-medium">MATCH</span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────
export default function TravelQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDirection, setAnimDirection] = useState<'forward' | 'backward'>('forward');
  const [showResults, setShowResults] = useState(false);

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const allAnswered = STEPS.every((s) => answers[s.key]);

  const setAnswer = useCallback((key: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setIsAnimating(true);
      setAnimDirection('forward');
      setTimeout(() => {
        setStep((s) => s + 1);
        setIsAnimating(false);
      }, 250);
    }
  }, [step]);

  const goPrev = useCallback(() => {
    if (step > 0) {
      setIsAnimating(true);
      setAnimDirection('backward');
      setTimeout(() => {
        setStep((s) => s - 1);
        setIsAnimating(false);
      }, 250);
    }
  }, [step]);

  const showResult = useCallback(() => {
    if (!allAnswered) return;
    const r = computeResults(answers as QuizAnswers);
    setResult(r);
    setIsAnimating(true);
    setAnimDirection('forward');
    setTimeout(() => {
      setStep(STEPS.length);
      setShowResults(true);
      setIsAnimating(false);
    }, 250);
  }, [allAnswered, answers]);

  const retake = useCallback(() => {
    setAnswers({});
    setStep(0);
    setResult(null);
    setShowResults(false);
  }, []);

  const getWhatsAppLink = (dest: string) => {
    const msg = result
      ? `Hi! I took the RRM Travel Quiz and got "${result.title} ${result.emoji}". I'm interested in visiting ${dest}. Can you help me plan this trip?`
      : `Hi! I'm interested in visiting ${dest}. Can you help me plan this trip?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const msg = `🧳 I'm "${result.title} ${result.emoji}" according to RRM Holidays Travel Quiz!\n\nTop match: ${result.destinations[0]?.name} (${result.destinations[0]?.matchPercent}% match)\n\nTake the quiz: https://rrmholidays.com/travel-quiz`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const currentAnswer = answers[currentStep?.key as keyof QuizAnswers];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pt-12 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles size={12} />
            Travel Quiz
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-100 mb-2">
            Find Your{' '}
            <span className="text-gradient-warm">Perfect Trip</span>
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Answer 5 quick questions and discover your ideal South India destination
          </p>
        </div>

        {/* Progress Bar */}
        {!showResults && (
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-500 font-medium">
                Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
              </span>
              <span className="text-xs text-stone-600">{Math.round((Math.min(step + 1, STEPS.length) / STEPS.length) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${(Math.min(step + 1, STEPS.length) / STEPS.length) * 100}%` }}
              />
            </div>
            {/* Step dots */}
            <div className="flex gap-2 mt-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    i < step
                      ? 'bg-amber-500/60'
                      : i === step
                        ? 'bg-amber-500'
                        : 'bg-white/[0.06]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quiz Steps */}
        {!showResults && currentStep && (
          <div className={`max-w-2xl mx-auto transition-all duration-250 ${
            isAnimating
              ? animDirection === 'forward'
                ? 'opacity-0 translate-x-8'
                : 'opacity-0 -translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}>
            {/* Step Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-100 mb-1">{currentStep.title}</h2>
              <p className="text-sm text-stone-500">{currentStep.subtitle}</p>
            </div>

            {/* Options Grid */}
            <div className="mb-8">
              {/* Group Step */}
              {currentStep.key === 'group' && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {GROUP_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = currentAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAnswer('group', opt.id)}
                        className={`relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer outline-none group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] hover:scale-[1.01]'
                        }`}
                      >
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-white/[0.04] text-stone-500 group-hover:text-stone-300'
                        }`}>
                          <Icon size={26} />
                        </div>
                        <div className="text-center">
                          <p className={`text-sm sm:text-base font-semibold transition-colors ${
                            isSelected ? 'text-amber-300' : 'text-stone-300'
                          }`}>
                            {opt.label}
                          </p>
                          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">{opt.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Vibe Step */}
              {currentStep.key === 'vibe' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {VIBE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = currentAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAnswer('vibe', opt.id)}
                        className={`relative flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer outline-none group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] hover:scale-[1.01]'
                        }`}
                      >
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-white/[0.04] text-stone-500 group-hover:text-stone-300'
                        }`}>
                          <Icon size={24} />
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-semibold transition-colors ${
                            isSelected ? 'text-amber-300' : 'text-stone-300'
                          }`}>
                            {opt.label}
                          </p>
                          <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">{opt.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Days Step */}
              {currentStep.key === 'days' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {DAYS_OPTIONS.map((opt) => {
                    const isSelected = currentAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAnswer('days', opt.id)}
                        className={`relative flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer outline-none group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] hover:scale-[1.01]'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                        <div className="text-center">
                          <p className={`text-sm sm:text-base font-semibold transition-colors ${
                            isSelected ? 'text-amber-300' : 'text-stone-300'
                          }`}>
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-stone-500">{opt.sub}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* When Step */}
              {currentStep.key === 'when' && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
                  {WHEN_OPTIONS.map((opt) => {
                    const isSelected = currentAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAnswer('when', opt.id)}
                        className={`relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer outline-none group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] hover:scale-[1.01]'
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl">{opt.emoji}</span>
                        <p className={`text-sm sm:text-base font-semibold transition-colors ${
                          isSelected ? 'text-amber-300' : 'text-stone-300'
                        }`}>
                          {opt.label}
                        </p>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Budget Step */}
              {currentStep.key === 'budget' && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = currentAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAnswer('budget', opt.id)}
                        className={`relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer outline-none group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] hover:scale-[1.01]'
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl">{opt.emoji}</span>
                        <div className="text-center">
                          <p className={`text-sm sm:text-base font-semibold transition-colors ${
                            isSelected ? 'text-amber-300' : 'text-stone-300'
                          }`}>
                            {opt.label}
                          </p>
                          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">{opt.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between max-w-xl mx-auto">
              <button
                onClick={goPrev}
                disabled={step === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer outline-none ${
                  step === 0
                    ? 'text-stone-700 cursor-not-allowed'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]'
                }`}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                onClick={isLastStep ? showResult : goNext}
                disabled={!currentAnswer}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer outline-none ${
                  currentAnswer
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105'
                    : 'bg-white/[0.04] text-stone-600 cursor-not-allowed'
                }`}
              >
                {isLastStep ? (
                  <>
                    See Results
                    <Sparkles size={16} />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && result && (
          <div className={`max-w-2xl mx-auto pb-16 transition-all duration-500 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {/* Personality Card */}
            <div className="text-center mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-500/[0.08] to-transparent border border-amber-500/10 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-3">Your Travel Personality</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {result.emoji}
                </h2>
                <h3 className="text-xl sm:text-2xl font-bold text-gradient-warm mb-4">{result.title}</h3>
                <div className="flex justify-center mb-6">
                  <MatchCircle percent={result.score} size={130} />
                </div>
                <p className="text-sm text-stone-400 max-w-md mx-auto">
                  Based on your preferences, here are your top 3 destination matches in South India
                </p>
              </div>
            </div>

            {/* Top 3 Destination Cards */}
            <div className="space-y-4 mb-8">
              {result.destinations.map((dest, idx) => (
                <div
                  key={dest.name}
                  className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 hover:border-white/[0.12]"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                      <Image
                        src={dest.img}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, 160px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 sm:bg-gradient-to-l sm:from-transparent sm:to-black/20" />
                      {/* Rank Badge */}
                      <div className={`absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        idx === 0
                          ? 'bg-amber-500 text-white'
                          : idx === 1
                            ? 'bg-stone-400 text-black'
                            : 'bg-amber-700 text-white'
                      }`}>
                        #{idx + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-stone-100">{dest.name}</h4>
                            <p className="text-xs text-stone-500">{dest.state}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            dest.matchPercent >= 90
                              ? 'bg-green-500/15 text-green-400'
                              : dest.matchPercent >= 80
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-blue-500/15 text-blue-400'
                          }`}>
                            {dest.matchPercent}% match
                          </span>
                        </div>
                        <p className="text-sm text-stone-400 leading-relaxed line-clamp-2">{dest.reason}</p>
                      </div>

                      {/* CTA */}
                      <div className="mt-3 sm:mt-4">
                        <a
                          href={getWhatsAppLink(dest.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-all duration-200 hover:scale-105"
                        >
                          <MessageCircle size={14} />
                          Plan This Trip
                          <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
              <a
                href={getWhatsAppLink(result.destinations[0]?.name || 'South India')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/20"
              >
                <MessageCircle size={18} />
                Book on WhatsApp
              </a>
              <button
                onClick={shareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-stone-300 hover:text-white hover:bg-white/[0.08] font-semibold text-sm transition-all duration-200 cursor-pointer outline-none"
              >
                <Share2 size={16} />
                Share Result
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={retake}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-300 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer outline-none"
              >
                <RotateCcw size={14} />
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
