'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  CalendarDays,
  Users,
  Car,
  MapPin,
  MessageCircle,
  Phone,
  ArrowRight,
  ChevronRight,
  Clock,
  Route,
  Heart,
  Star,
  Zap,
  Sun,
  Mountain,
  Waves,
  Landmark,
} from 'lucide-react';

// ──────────────────────────── DATA ────────────────────────────

type MoodKey = 'relax' | 'adventure' | 'spiritual' | 'romantic' | 'beach';

interface Place {
  name: string;
  state: string;
  desc: string;
  img: string;
}

interface MoodData {
  emoji: string;
  label: string;
  gradient: string;
  glowColor: string;
  iconBg: string;
  places: Place[];
}

const MOODS: Record<MoodKey, MoodData> = {
  relax: {
    emoji: '😌',
    label: 'Relax',
    gradient: 'from-teal-500 to-cyan-500',
    glowColor: 'shadow-teal-500/30',
    iconBg: 'bg-teal-500/20',
    places: [
      { name: 'Munnar', state: 'Kerala', desc: 'Tea gardens, misty mountains, serene lakes', img: '/gallery-7-munnar-tea.jpg' },
      { name: 'Alleppey', state: 'Kerala', desc: 'Houseboat backwaters, coconut groves', img: '/gallery-2-kerala-backwater.jpg' },
      { name: 'Coorg', state: 'Karnataka', desc: 'Coffee estates, waterfalls, misty hills', img: '/gallery-4-coorg-hills.jpg' },
      { name: 'Kovalam', state: 'Kerala', desc: 'Pristine beaches, Ayurvedic spas', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Wayanad', state: 'Kerala', desc: 'Green forests, wildlife, bamboo rafting', img: '/gallery-4-coorg-hills.jpg' },
      { name: 'Ooty', state: 'Tamil Nadu', desc: 'Toy train, botanical gardens, cool climate', img: '/gallery-6-ooty-train.jpg' },
    ],
  },
  adventure: {
    emoji: '🧗',
    label: 'Adventure',
    gradient: 'from-orange-500 to-red-500',
    glowColor: 'shadow-orange-500/30',
    iconBg: 'bg-orange-500/20',
    places: [
      { name: 'Hampi', state: 'Karnataka', desc: 'Boulder climbing, ancient ruins exploration', img: '/gallery-3-hampi-ruins.jpg' },
      { name: 'Dudhsagar Falls', state: 'Goa', desc: "Trek to India's tallest waterfall", img: '/gallery-5-goa-beach.jpg' },
      { name: 'Gandikota', state: 'Andhra', desc: 'Grand Canyon of India, rappelling, kayaking', img: '/gallery-8-temple.jpg' },
      { name: 'Bandipur', state: 'Karnataka', desc: 'Wildlife safari, elephant spotting', img: '/gallery-4-coorg-hills.jpg' },
      { name: 'Araku Valley', state: 'Andhra', desc: 'Cave exploration, tribal culture, coffee', img: '/gallery-8-temple.jpg' },
      { name: 'Coorg', state: 'Karnataka', desc: 'River rafting, trekking, coffee trails', img: '/gallery-4-coorg-hills.jpg' },
    ],
  },
  spiritual: {
    emoji: '🛕',
    label: 'Spiritual',
    gradient: 'from-purple-500 to-violet-500',
    glowColor: 'shadow-purple-500/30',
    iconBg: 'bg-purple-500/20',
    places: [
      { name: 'Tirupati', state: 'Andhra', desc: 'Sri Venkateswara Temple, sacred hills', img: '/gallery-8-temple.jpg' },
      { name: 'Madurai', state: 'Tamil Nadu', desc: 'Meenakshi Amman Temple, divine architecture', img: '/gallery-8-temple.jpg' },
      { name: 'Rameswaram', state: 'Tamil Nadu', desc: 'Pamban Bridge, sacred Ramanathaswamy Temple', img: '/gallery-8-temple.jpg' },
      { name: 'Mysuru', state: 'Karnataka', desc: 'Chamundi Hills, sacred temples, royal heritage', img: '/gallery-1-mysuru-palace.jpg' },
      { name: 'Gokarna', state: 'Karnataka', desc: 'Om Beach, Mahabaleshwar Temple', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Sabarimala', state: 'Kerala', desc: 'Ayyappa Temple, holy pilgrimage', img: '/gallery-2-kerala-backwater.jpg' },
    ],
  },
  romantic: {
    emoji: '❤️',
    label: 'Romantic',
    gradient: 'from-pink-500 to-rose-500',
    glowColor: 'shadow-pink-500/30',
    iconBg: 'bg-pink-500/20',
    places: [
      { name: 'Munnar', state: 'Kerala', desc: 'Candlelit dinners among tea gardens', img: '/gallery-7-munnar-tea.jpg' },
      { name: 'Alleppey', state: 'Kerala', desc: 'Private houseboat under stars', img: '/gallery-2-kerala-backwater.jpg' },
      { name: 'Goa', state: 'Goa', desc: 'Sunset beach walks, candlelight cafes', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Coonoor', state: 'Tamil Nadu', desc: 'Nilgiri mountain romance, toy train', img: '/gallery-6-ooty-train.jpg' },
      { name: 'Pondicherry', state: 'Tamil Nadu', desc: 'French colonial charm, seaside promenade', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Chikmagalur', state: 'Karnataka', desc: 'Coffee estate stays, mountain sunrises', img: '/gallery-4-coorg-hills.jpg' },
    ],
  },
  beach: {
    emoji: '🏖️',
    label: 'Beach',
    gradient: 'from-blue-500 to-sky-500',
    glowColor: 'shadow-blue-500/30',
    iconBg: 'bg-blue-500/20',
    places: [
      { name: 'Goa', state: 'Goa', desc: 'Baga, Palolem, Calangute — beach paradise', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Kovalam', state: 'Kerala', desc: 'Lighthouse beach, shallow waters', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Varkala', state: 'Kerala', desc: 'Cliff beach, natural springs, sunset', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Gokarna', state: 'Karnataka', desc: 'Om Beach, Kudle Beach, pristine shores', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Mahabalipuram', state: 'Tamil Nadu', desc: 'Shore Temple, heritage beach town', img: '/gallery-5-goa-beach.jpg' },
      { name: 'Visakhapatnam', state: 'Andhra', desc: 'RK Beach, submarine museum, golden sands', img: '/gallery-5-goa-beach.jpg' },
    ],
  },
};

const MOOD_KEYS: MoodKey[] = ['relax', 'adventure', 'spiritual', 'romantic', 'beach'];

const MOOD_ICONS: Record<MoodKey, React.ReactNode> = {
  relax: <Sun className="w-6 h-6" />,
  adventure: <Mountain className="w-6 h-6" />,
  spiritual: <Landmark className="w-6 h-6" />,
  romantic: <Heart className="w-6 h-6" />,
  beach: <Waves className="w-6 h-6" />,
};

const VEHICLES = [
  { type: 'Sedan (Etios/Dzire)', seats: 4, perKm: 12 },
  { type: 'MUV (Innova)', seats: 7, perKm: 16 },
  { type: 'Premium (Crysta)', seats: 7, perKm: 20 },
  { type: 'Tempo Traveller', seats: 12, perKm: 22 },
  { type: 'Urbania (10 seater)', seats: 10, perKm: 18 },
  { type: 'Mini Bus (21 seater)', seats: 21, perKm: 28 },
  { type: 'Bus (33 seater)', seats: 33, perKm: 35 },
];

function getAutoVehicle(people: number) {
  if (people <= 4) return VEHICLES[0]; // Sedan
  if (people <= 7) return VEHICLES[1]; // Innova
  if (people <= 10) return VEHICLES[4]; // Urbania
  if (people <= 12) return VEHICLES[3]; // Tempo
  if (people <= 21) return VEHICLES[5]; // Mini Bus
  return VEHICLES[6]; // Bus
}

interface ItineraryDay {
  day: number;
  place: string;
  state: string;
  activities: string[];
}

function generateItinerary(mood: MoodKey, days: number): ItineraryDay[] {
  const places = MOODS[mood].places;
  const moodActivities: Record<MoodKey, string[][]> = {
    relax: [
      ['Morning yoga session', 'Explore local tea gardens', 'Relaxing spa & Ayurveda massage'],
      ['Scenic boat ride', 'Visit botanical gardens', 'Sunset viewpoint'],
      ['Nature walk through forests', 'Bird watching tour', 'Campfire evening'],
    ],
    adventure: [
      ['Early morning trek', 'Rock climbing & rappelling', 'Explore ancient ruins'],
      ['Wildlife safari', 'Waterfall trek', 'River crossing adventure'],
      ['Mountain biking trail', 'Cave exploration', 'Night camping under stars'],
    ],
    spiritual: [
      ['Morning temple darshan', 'Visit sacred ghats', 'Evening aarti ceremony'],
      ['Heritage temple tour', 'Meditation session', 'Explore ancient architecture'],
      ['Pilgrimage walk', 'Sacred river bathing', 'Spiritual discourse'],
    ],
    romantic: [
      ['Private sunrise viewpoint', 'Candlelit breakfast', 'Couple spa session'],
      ['Scenic couple walk', 'Private boat ride', 'Romantic dinner setup'],
      ['Explore quaint towns', 'Wine tasting experience', 'Stargazing night'],
    ],
    beach: [
      ['Morning beach walk', 'Snorkeling & water sports', 'Beachside lunch'],
      ['Island hopping tour', 'Cliff diving spot', 'Beach bonfire'],
      ['Surfing lesson', 'Coastal heritage walk', 'Sunset cruise'],
    ],
  };

  const itinerary: ItineraryDay[] = [];
  const activities = moodActivities[mood];

  for (let i = 0; i < days; i++) {
    const place = places[i % places.length];
    const dayActivities = activities[i % activities.length];
    itinerary.push({
      day: i + 1,
      place: place.name,
      state: place.state,
      activities: dayActivities,
    });
  }
  return itinerary;
}

// ──────────────────────────── COMPONENT ────────────────────────────

export default function MoodSearchPage() {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(4);
  const [vehicleOverride, setVehicleOverride] = useState<number>(-1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);

  // Scroll reveal
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-reveal]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [showResults]);

  const handleMoodClick = useCallback((mood: MoodKey) => {
    setSelectedMood(mood);
    setShowResults(false);
    setTimeout(() => {
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 300);
  }, []);

  const activeVehicle = vehicleOverride >= 0 ? VEHICLES[vehicleOverride] : getAutoVehicle(people);
  const itinerary = useMemo(() => {
    if (!selectedMood) return [];
    return generateItinerary(selectedMood, days);
  }, [selectedMood, days]);

  const estimatedKmPerDay = useMemo(() => {
    if (!selectedMood) return 0;
    const kmByMood: Record<MoodKey, number> = {
      relax: 120,
      adventure: 180,
      spiritual: 150,
      romantic: 100,
      beach: 80,
    };
    return kmByMood[selectedMood];
  }, [selectedMood]);

  const whatsAppMessage = useMemo(() => {
    if (!selectedMood) return '';
    const mood = MOODS[selectedMood];
    const msg = `Hi! I want a ${days}-day ${mood.label} trip for ${people} people. Suggest the best route and vehicle!`;
    return encodeURIComponent(msg);
  }, [selectedMood, days, people]);

  const placeWhatsAppMessage = (place: Place) => {
    if (!selectedMood) return '';
    const mood = MOODS[selectedMood];
    const msg = `Hi! I'm interested in a ${mood.label} trip to ${place.name}, ${place.state}. Please suggest the best itinerary for ${people} people for ${days} days.`;
    return encodeURIComponent(msg);
  };

  const stateColors: Record<string, string> = {
    Kerala: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Karnataka: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Goa: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Tamil Nadu': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Andhra: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  const handleVehicleChange = (idx: number) => {
    setVehicleOverride(idx);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ──────── HERO ──────── */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-stone-300">Mood-Based Travel Discovery</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-stone-100 via-stone-200 to-stone-400 bg-clip-text text-transparent">
              How are you feeling
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              today?
            </span>
          </h1>

          <p className="text-stone-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4">
            Pick your mood, and we&apos;ll match you with the perfect South India getaway.
            <span className="hidden sm:inline"> No planning stress — just vibes.</span>
          </p>
          <p className="text-stone-500 text-sm">Click a mood below to discover your ideal destinations</p>
        </div>
      </section>

      {/* ──────── MOOD CARDS ──────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {MOOD_KEYS.map((mood, idx) => {
            const data = MOODS[mood];
            const isSelected = selectedMood === mood;
            return (
              <button
                key={mood}
                onClick={() => handleMoodClick(mood)}
                className={`
                  group relative overflow-hidden rounded-2xl p-6 sm:p-8
                  border transition-all duration-500 ease-out
                  cursor-pointer text-left
                  ${isSelected
                    ? `bg-gradient-to-br ${data.gradient} border-white/20 shadow-2xl ${data.glowColor} scale-[1.02]`
                    : `bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.15] hover:scale-[1.04] hover:shadow-xl ${data.glowColor}`
                  }
                `}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 transition-colors duration-300 ${isSelected ? 'bg-white/20' : `${data.iconBg}`}`}>
                    {MOOD_ICONS[mood]}
                  </div>
                  <div className="text-3xl sm:text-4xl mb-2">{data.emoji}</div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-1 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-stone-100 group-hover:text-white'}`}>
                    {data.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60">
                    {data.places.length} destinations
                  </p>
                </div>

                {/* Bottom arrow */}
                <div className={`absolute bottom-4 right-4 transition-all duration-300 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'}`}>
                  <ArrowRight className="w-5 h-5 text-white/80" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ──────── RESULTS ──────── */}
      {showResults && selectedMood && (
        <div ref={resultsRef}>
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${MOODS[selectedMood].gradient} text-sm font-semibold`}>
                <span>{MOODS[selectedMood].emoji}</span>
                <span>{MOODS[selectedMood].label}</span>
              </div>
              <span className="text-stone-500">→</span>
              <span className="text-stone-300 text-sm">Perfect destinations for you</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              <span className="bg-gradient-to-r from-stone-100 to-stone-300 bg-clip-text text-transparent">
                Your Dream Destinations
              </span>
            </h2>

            {/* Destination cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MOODS[selectedMood].places.map((place, idx) => (
                <div
                  key={`${place.name}-${idx}`}
                  data-reveal={`place-${idx}`}
                  className={`group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-xl hover:-translate-y-1 ${visibleSections.has(`place-${idx}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={place.img}
                      alt={`${place.name}, ${place.state}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* State badge */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${stateColors[place.state] || 'bg-white/10 text-white border-white/20'}`}>
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {place.state}
                    </div>

                    {/* Rank badge */}
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-r ${MOODS[selectedMood].gradient} text-white shadow-lg`}>
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-stone-100 mb-1.5 group-hover:text-white transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-sm text-stone-400 mb-4 leading-relaxed">
                      {place.desc}
                    </p>

                    {/* WhatsApp CTA */}
                    <a
                      href={`https://wa.me/919108597154?text=${placeWhatsAppMessage(place)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r ${MOODS[selectedMood].gradient} hover:opacity-90 hover:shadow-lg`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enquire on WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ──────── TRIP SIMULATOR ──────── */}
          <section ref={simulatorRef} className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Dynamic Simulator
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-stone-100 to-stone-300 bg-clip-text text-transparent">
                Trip Simulator
              </span>
            </h2>
            <p className="text-stone-400 mb-8">Customize your {MOODS[selectedMood].label.toLowerCase()} trip and see a live itinerary preview</p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* ─── Left: Controls ─── */}
              <div className="lg:col-span-2 space-y-5">
                {/* Days slider */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                      <CalendarDays className="w-4 h-4 text-amber-400" />
                      Trip Duration
                    </label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f97316 ${(days - 1) / 9 * 100}%, rgba(255,255,255,0.1) ${(days - 1) / 9 * 100}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-stone-500 mt-2">
                    <span>1 Day</span>
                    <span>10 Days</span>
                  </div>
                </div>

                {/* People slider */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                      <Users className="w-4 h-4 text-amber-400" />
                      Travellers
                    </label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                      {people}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={people}
                    onChange={(e) => {
                      setPeople(Number(e.target.value));
                      setVehicleOverride(-1);
                    }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f97316 ${(people - 1) / 49 * 100}%, rgba(255,255,255,0.1) ${(people - 1) / 49 * 100}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-stone-500 mt-2">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Vehicle selector */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                      <Car className="w-4 h-4 text-amber-400" />
                      Vehicle
                    </label>
                    <span className="text-xs text-stone-500">
                      {vehicleOverride >= 0 ? 'Custom' : 'Auto-selected'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {VEHICLES.map((v, idx) => {
                      const isActive = (vehicleOverride >= 0 ? VEHICLES[vehicleOverride] : activeVehicle) === v;
                      const isAutoSuggested = vehicleOverride < 0 && getAutoVehicle(people) === v;
                      return (
                        <button
                          key={v.type}
                          onClick={() => handleVehicleChange(idx)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 border cursor-pointer
                            ${isActive
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                              : 'bg-white/[0.02] border-white/[0.06] text-stone-400 hover:bg-white/[0.05] hover:border-white/[0.1] hover:text-stone-300'
                            }
                          `}
                        >
                          <div>
                            <div className="font-medium">{v.type}</div>
                            <div className="text-xs text-stone-500 mt-0.5">{v.seats} seats &middot; ₹{v.perKm}/km</div>
                          </div>
                          {isAutoSuggested && vehicleOverride < 0 && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Recommended
                            </span>
                          )}
                          {isActive && !isAutoSuggested && (
                            <div className="w-5 h-5 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stats mini cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
                    <Route className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-stone-100">{estimatedKmPerDay}</div>
                    <div className="text-[11px] text-stone-500">km / day</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
                    <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-stone-100">{days * estimatedKmPerDay}</div>
                    <div className="text-[11px] text-stone-500">total km</div>
                  </div>
                </div>
              </div>

              {/* ─── Right: Live Itinerary ─── */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden">
                  {/* Itinerary header */}
                  <div className={`bg-gradient-to-r ${MOODS[selectedMood].gradient} p-5 sm:p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Live Itinerary Preview
                        </h3>
                        <p className="text-sm text-white/70 mt-0.5">
                          {days} days &middot; {people} people &middot; {activeVehicle.type}
                        </p>
                      </div>
                      <div className="text-3xl">{MOODS[selectedMood].emoji}</div>
                    </div>
                  </div>

                  {/* Itinerary body */}
                  <div className="p-4 sm:p-6 max-h-[520px] overflow-y-auto custom-scrollbar">
                    {itinerary.length === 0 ? (
                      <div className="text-center py-12 text-stone-500">
                        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>Select a mood and duration to preview your itinerary</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {itinerary.map((day) => (
                          <div
                            key={day.day}
                            className={`rounded-xl border transition-all duration-300 cursor-pointer ${
                              expandedDay === day.day
                                ? 'bg-white/[0.05] border-white/[0.12]'
                                : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08]'
                            }`}
                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                          >
                            {/* Day header */}
                            <div className="flex items-center gap-3 px-4 py-3">
                              <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${MOODS[selectedMood].gradient} flex items-center justify-center text-xs font-bold text-white`}>
                                D{day.day}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-stone-200 truncate">{day.place}</div>
                                <div className="text-xs text-stone-500">{day.state} &middot; ~{estimatedKmPerDay} km</div>
                              </div>
                              <ChevronRight className={`w-4 h-4 text-stone-500 transition-transform duration-300 flex-shrink-0 ${expandedDay === day.day ? 'rotate-90' : ''}`} />
                            </div>

                            {/* Expanded activities */}
                            {expandedDay === day.day && (
                              <div className="px-4 pb-4 pt-1 border-t border-white/[0.05]">
                                <div className="space-y-2 mt-3">
                                  {day.activities.map((activity, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                                        i === 0 ? 'bg-amber-500/20 text-amber-300' :
                                        i === 1 ? 'bg-sky-500/20 text-sky-300' :
                                        'bg-purple-500/20 text-purple-300'
                                      }`}>
                                        {i === 0 ? '☀' : i === 1 ? '🌤' : '🌙'}
                                      </div>
                                      <div>
                                        <span className={`text-xs font-medium ${i === 0 ? 'text-amber-300' : i === 1 ? 'text-sky-300' : 'text-purple-300'}`}>
                                          {i === 0 ? 'Morning' : i === 1 ? 'Afternoon' : 'Evening'}
                                        </span>
                                        <p className="text-sm text-stone-300 mt-0.5">{activity}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Itinerary footer */}
                  {itinerary.length > 0 && (
                    <div className={`border-t border-white/[0.06] bg-gradient-to-r ${MOODS[selectedMood].gradient} p-4 sm:p-5`}>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={`https://wa.me/919108597154?text=${whatsAppMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-white text-neutral-900 font-semibold py-3 rounded-xl hover:bg-white/90 transition-all duration-200 hover:shadow-lg"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Get This Trip on WhatsApp
                        </a>
                        <a
                          href="tel:+919108597154"
                          className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-medium py-3 px-5 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                        >
                          <Phone className="w-5 h-5" />
                          Call Us
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ──────── BOTTOM CTA ──────── */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${MOODS[selectedMood].gradient} p-8 sm:p-12 lg:p-16 text-center`}>
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              </div>

              <div className="relative z-10">
                <div className="text-5xl mb-4">{MOODS[selectedMood].emoji}</div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                  Ready for your {MOODS[selectedMood].label.toLowerCase()} getaway?
                </h3>
                <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                  Our travel experts will craft the perfect itinerary for you. Share your preferences and get a custom plan — no commitment!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`https://wa.me/919108597154?text=${whatsAppMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-white/90 transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Plan on WhatsApp
                  </a>
                  <a
                    href="tel:+919108597154"
                    className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/25 transition-all duration-200 border border-white/20"
                  >
                    <Phone className="w-6 h-6" />
                    Call Now
                  </a>
                </div>
                <p className="text-white/50 text-sm mt-5">
                  Free consultation &middot; No obligation &middot; Expert planning
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ──────── FOOTER INFO (when no mood selected) ──────── */}
      {!selectedMood && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Sparkles className="w-5 h-5 text-amber-400" />, title: 'AI-Matched', desc: 'Destinations picked by your mood' },
              { icon: <MapPin className="w-5 h-5 text-teal-400" />, title: '30+ Places', desc: 'Across 5 South Indian states' },
              { icon: <Car className="w-5 h-5 text-purple-400" />, title: 'Vehicle Options', desc: 'Sedan to Bus, any group size' },
              { icon: <MessageCircle className="w-5 h-5 text-green-400" />, title: 'Instant Plan', desc: 'Get itinerary on WhatsApp' },
            ].map((f, i) => (
              <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 text-center hover:bg-white/[0.05] transition-colors">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.05] mb-3">
                  {f.icon}
                </div>
                <h4 className="text-sm font-semibold text-stone-200 mb-1">{f.title}</h4>
                <p className="text-xs text-stone-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-8 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-100 mb-3">
              Can&apos;t decide? Talk to an expert!
            </h3>
            <p className="text-stone-400 mb-6 max-w-lg mx-auto">
              Our travel advisors have planned 5000+ trips across South India. Tell us what you like, and we&apos;ll craft the perfect holiday.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919108597154?text=Hi!%20I%20need%20help%20planning%20a%20South%20India%20trip.%20Can%20you%20suggest%20the%20best%20destinations?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-3.5 px-7 rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <a
                href="tel:+919108597154"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-stone-200 font-medium py-3.5 px-7 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                Call +91 91085 97154
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ──────── GLOBAL FOOTER ──────── */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>RRM Holidays &mdash; Your South India Travel Partner</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-500">
            <a href="/" className="hover:text-stone-300 transition-colors">Home</a>
            <a href="https://wa.me/919108597154" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a href="tel:+919108597154" className="hover:text-stone-300 transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          </div>
        </div>
      </footer>

      {/* ──────── CUSTOM SCROLLBAR STYLES (injected) ──────── */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.6);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
