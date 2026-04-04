'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Star,
  Search,
  Users,
  Calendar,
  Shield,
  IndianRupee,
  Headphones,
  Route,
  Hotel,
  Car,
  ChevronUp,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowRight,
  Award,
  Heart,
  Compass,
  Sparkles,
  Globe,
  Send,
} from 'lucide-react';

/* ──────────────────────────── data constants ──────────────────────────── */

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Coverage', href: '#coverage' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Vehicles', href: '#vehicles' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const DESTINATIONS = [
  { id: 1, name: 'Mysuru', location: 'Karnataka', img: '/mysuru-palace.jpg', tag: 'Our Home', tagColor: 'text-amber-400 border-amber-400/30', cat: 'Heritage', desc: 'Royal palaces, sandalwood, silk sarees & the grand Dasara festival in the City of Palaces.' },
  { id: 2, name: 'Coorg', location: 'Karnataka', img: '/coorg.jpg', tag: 'Trending', tagColor: 'text-emerald-400 border-emerald-400/30', cat: 'Nature & Beach', desc: 'Lush coffee plantations, misty hills, cascading waterfalls & Kodava culture.' },
  { id: 3, name: 'Kerala', location: 'God\'s Own Country', img: '/kerala.jpg', tag: 'Leisure', tagColor: 'text-cyan-400 border-cyan-400/30', cat: 'Nature & Beach', desc: 'Backwater houseboats, Munnar tea gardens, Ayurveda retreats & pristine beaches.' },
  { id: 4, name: 'Ooty', location: 'Tamil Nadu', img: '/ooty.jpg', tag: null, tagColor: '', cat: 'Hill Stations', desc: 'The Queen of Hill Stations — botanical gardens, toy train & Nilgiri mountain serenity.' },
  { id: 5, name: 'Hampi', location: 'Karnataka', img: '/hampi.jpg', tag: 'UNESCO Heritage', tagColor: 'text-rose-400 border-rose-400/30', cat: 'Heritage', desc: 'Ancient Vijayanagara ruins, boulder-strewn landscapes & a timeless spiritual aura.' },
  { id: 6, name: 'Goa', location: 'India\'s Beach Capital', img: '/goa.jpg', tag: 'Leisure + Adventure', tagColor: 'text-violet-400 border-violet-400/30', cat: 'Nature & Beach', desc: 'Sun-kissed beaches, Portuguese heritage, vibrant nightlife & water adventure sports.' },
];

const VEHICLES = [
  { id: 1, type: 'Sedan', model: 'Toyota Etios', img: '/sedan-etios.jpg', price: '₹12', priceUnit: '/km', seats: '4 Seaters', badge: null, badgeColor: '', features: ['AC', 'Music System', 'Comfortable Seats', 'Boot Space'], desc: 'Perfect for small family trips and city tours' },
  { id: 2, type: 'Sedan', model: 'Maruti Swift Dzire', img: '/swift-dzire.jpg', price: '₹12', priceUnit: '/km', seats: '4 Seaters', badge: 'Popular', badgeColor: 'bg-amber-500', features: ['AC', 'Music System', 'Comfortable Seats', 'Fuel Efficient'], desc: 'Compact sedan ideal for city rides and short trips' },
  { id: 3, type: 'MUV', model: 'Toyota Innova', img: '/innova-muv.jpg', price: '₹18', priceUnit: '/km', seats: '7 Seaters', badge: null, badgeColor: '', features: ['Spacious', 'AC', 'Music System', 'Luggage Space'], desc: 'Ideal for family vacations and group travel' },
  { id: 4, type: 'Premium MUV', model: 'Innova Crysta', img: '/innova-crysta.jpg', price: '₹20', priceUnit: '/km', seats: '7 Seaters', badge: 'Premium', badgeColor: 'bg-violet-500', features: ['Premium AC', 'Luxury Seats', 'Entertainment System', 'Captain Seats'], desc: 'Premium comfort for luxury travel experiences' },
  { id: 5, type: 'Tempo Traveller', model: 'Force Tempo Traveller', img: '/tempo-traveller.jpg', price: '₹22', priceUnit: '/km', seats: '12 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Best for medium groups, corporate trips & family outings' },
  { id: 6, type: 'Mini Bus', model: '21 Seater Mini Bus', img: '/mini-bus.jpg', price: '₹32', priceUnit: '/km', seats: '21 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'Best for large groups, weddings and corporate events' },
  { id: 7, type: 'Bus', model: '25 Seater Bus', img: '/bus-25seater.jpg', price: '₹36', priceUnit: '/km', seats: '25 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'PA System'], desc: 'Ideal for large groups, school trips and corporate outings' },
  { id: 8, type: 'Bus', model: '33 Seater Bus', img: '/bus-33seater.jpg', price: '₹42', priceUnit: '/km', seats: '33 Seaters', badge: null, badgeColor: '', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System'], desc: 'Spacious bus for pilgrimage tours and large group travel' },
  { id: 9, type: 'Luxury Bus', model: '50 Seater Luxury Coach', img: '/bus-50seater.jpg', price: '₹52', priceUnit: '/km', seats: '50 Seaters', badge: 'Luxury', badgeColor: 'bg-cyan-500', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System', 'WiFi'], desc: 'Luxury Volvo coach for very large groups, pilgrimages & tours' },
];

const STATES = [
  { name: 'Karnataka', color: '#f59e0b', glow: 'rgba(245,158,11,0.15)', destinations: 20, icon: '🏛️' },
  { name: 'Kerala', color: '#06b6d4', glow: 'rgba(6,182,212,0.15)', destinations: 12, icon: '🛶' },
  { name: 'Tamil Nadu', color: '#a855f7', glow: 'rgba(168,85,247,0.15)', destinations: 10, icon: '🛕' },
  { name: 'Andhra Pradesh', color: '#f97316', glow: 'rgba(249,115,22,0.15)', destinations: 6, icon: '⛰️' },
  { name: 'Telangana', color: '#10b981', glow: 'rgba(16,185,129,0.15)', destinations: 5, icon: '🏰' },
  { name: 'Goa', color: '#ec4899', glow: 'rgba(236,72,153,0.15)', destinations: 7, icon: '🏖️' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', trip: 'Kerala Complete Tour', rating: 5, quote: 'RRM Holidays made our Kerala trip absolutely magical! The backwater houseboat experience was beyond words. Every detail was perfectly planned.' },
  { name: 'Rajesh Kumar', trip: 'Mysuru-Coorg Explorer', rating: 5, quote: 'Being from North India, we were worried about language barriers. But RRM\'s local team in Mysuru made us feel completely at home.' },
  { name: 'Anita Desai', trip: 'Ooty-Coonoor Getaway', rating: 5, quote: 'The toy train ride through the Nilgiris was breathtaking! RRM\'s driver knew every secret viewpoint. Will definitely book again.' },
];

const WHY_US = [
  { icon: Shield, title: 'Safe Travel', desc: 'Government-licensed tours with comprehensive insurance coverage and verified accommodations.' },
  { icon: IndianRupee, title: 'Best Price Guarantee', desc: 'Transparent pricing with no hidden charges. We match or beat any competitor\'s offer.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock assistance during your entire trip. One call and we\'re there for you.' },
  { icon: Route, title: 'Custom Itineraries', desc: 'Tailor-made tour plans based on your interests, pace and budget. Your trip, your way.' },
  { icon: Hotel, title: 'Hotel Partnerships', desc: 'Handpicked hotels across South India with quality-assured rooms and prime locations.' },
  { icon: Car, title: 'Own Fleet of Cabs', desc: 'Well-maintained AC cabs with experienced drivers who double up as local guides.' },
];

/* ──────────────────────────── main component ──────────────────────────── */

export default function Home() {
  /* ── state ── */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [destFilter, setDestFilter] = useState('All');
  const [backToTop, setBackToTop] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [highlightedState, setHighlightedState] = useState<string | null>(null);
  const toastIdRef = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  /* ── toast helper ── */
  const showToast = useCallback((msg: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  /* ── scroll handlers ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── intersection observer for reveals ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── active section tracking ── */
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveSection(e.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* ── filtered destinations ── */
  const filteredDests = destFilter === 'All'
    ? DESTINATIONS
    : DESTINATIONS.filter((d) => d.cat === destFilter);

  /* ── form submit ── */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('✅ Enquiry submitted! We\'ll call you within 2 hours.');
    formRef.current?.reset();
  };

  /* ── handle state card click ── */
  const handleStateClick = (state: string) => {
    setHighlightedState(state);
    showToast(`🗺️ Exploring ${state} — ${STATES.find((s) => s.name === state)?.destinations}+ destinations await!`);
    setTimeout(() => setHighlightedState(null), 3000);
  };

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <>
      {/* ─────────── NAVIGATION ─────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass py-2' : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-sm">
              R
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-100">
              RRM <span className="text-amber-400">Holidays</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              Get Quote
            </a>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-stone-300 hover:text-white p-2"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────── MOBILE MENU ─────────── */}
      <div
        className={`mobile-menu fixed inset-0 z-[60] ${
          mobileMenuOpen ? 'open' : ''
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-neutral-900/95 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-bold text-stone-100">
              RRM <span className="text-amber-400">Holidays</span>
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-400 hover:text-white"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-auto">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm"
            >
              Get Quote
            </a>
          </div>
        </div>
      </div>

      {/* ─────────── HERO ─────────── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* BG Image */}
        <Image
          src="/hero-mysuru.jpg"
          alt="Mysuru Palace"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="hero-overlay absolute inset-0" />

        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl animate-morph" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24 pb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-stone-300 mb-6">
            <Sparkles size={14} className="text-amber-400" />
            Based in Mysuru • Serving South India
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Discover{' '}
            <span className="text-gradient-warm">Magical</span>
            <br />
            South India
          </h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated tours across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh,
            Telangana & Goa. Your dream vacation starts here.
          </p>

          {/* Search form */}
          <div className="glass rounded-2xl p-4 md:p-6 max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <select className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer">
                  <option>Select Destination</option>
                  <option>Mysuru</option>
                  <option>Coorg</option>
                  <option>Kerala</option>
                  <option>Ooty</option>
                  <option>Hampi</option>
                  <option>Goa</option>
                  <option>Hyderabad</option>
                  <option>Tirupati</option>
                </select>
              </div>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="date"
                  className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200"
                />
              </div>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <select className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer">
                  <option>Travellers</option>
                  <option>1 Person</option>
                  <option>2 Persons</option>
                  <option>3-5 Persons</option>
                  <option>6-10 Persons</option>
                  <option>10+ Persons</option>
                </select>
              </div>
              <button
                onClick={() => showToast('🔍 Searching best packages for you...')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold py-3 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all text-sm"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '5,000+', label: 'Happy Travellers' },
              { value: '150+', label: 'Vehicles & Fleet' },
              { value: '6', label: 'States Covered' },
              { value: '9+', label: 'Years of Trust' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="stat-number text-2xl md:text-3xl font-extrabold">
                  {stat.value}
                </div>
                <div className="text-stone-500 text-xs md:text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-stone-500 text-xs">Scroll to Explore</span>
            <ChevronDown size={18} className="text-stone-500" />
          </div>
        </div>
      </section>

      {/* ─────────── ABOUT ─────────── */}
      <section id="about" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="reveal stagger-1 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/mysuru-palace.jpg"
                  alt="Mysuru Palace"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold text-amber-400">
                    <MapPin size={14} />
                    Our Home Base — Mysuru
                  </span>
                </div>
              </div>
              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-amber-500/10 rounded-2xl animate-rotate-slow" />
            </div>

            {/* Content */}
            <div>
              <div className="reveal stagger-2">
                <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">
                  About Us
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-6 leading-tight">
                  Born In Mysuru,{' '}
                  <span className="text-gradient-warm">Serving</span> South India
                </h2>
              </div>
              <div className="reveal stagger-3 space-y-4 text-stone-400 leading-relaxed mb-8">
                <p>
                  RRM Holidays was founded with a simple vision — to share the
                  beauty, culture and warmth of South India with travellers from
                  across the world. Based in the royal city of Mysuru, we bring
                  deep local knowledge and genuine hospitality to every tour.
                </p>
                <p>
                  From the misty hills of Coorg to the backwaters of Kerala, from
                  the ancient ruins of Hampi to the golden beaches of Goa — we
                  craft each journey with passion, precision and personal care.
                </p>
              </div>

              {/* Feature cards */}
              <div className="reveal stagger-4 grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: MapPin, title: 'Mysuru Based', desc: 'Deep local roots & knowledge' },
                  { icon: Compass, title: 'Local Guides', desc: 'Authentic experiences with locals' },
                  { icon: Heart, title: 'Personal Touch', desc: 'Customised tours, not cookie-cutter' },
                  { icon: Globe, title: 'South Indian Cuisine', desc: 'Food trails & culinary delights' },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all"
                  >
                    <feat.icon size={20} className="text-amber-400 mb-2" />
                    <div className="text-sm font-semibold text-stone-200 mb-0.5">
                      {feat.title}
                    </div>
                    <div className="text-xs text-stone-500">{feat.desc}</div>
                  </div>
                ))}
              </div>

              <a
                href="#vehicles"
                className="reveal stagger-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                View Our Fleet
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── COVERAGE ─────────── */}
      <section id="coverage" className="relative py-20 md:py-32 overflow-hidden">
        {/* BG pattern */}
        <div className="grid-pattern absolute inset-0 opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Our Coverage
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Across <span className="text-gradient-warm">6 States</span> of
              South India
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              From Karnataka&apos;s cultural heartland to Kerala&apos;s tropical
              paradise, we cover the best of South India.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            {/* India Map */}
            <div className="reveal stagger-2 lg:col-span-3 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-neutral-900/50 p-4">
                <Image
                  src="/india-map.png"
                  alt="India Map - South India Coverage"
                  width={800}
                  height={700}
                  className="w-full h-auto object-contain"
                />
                {/* Pulsing dot indicators on approximate South India positions */}
                <div className="absolute top-[48%] left-[42%] w-3 h-3 bg-amber-400 rounded-full animate-pin-bounce cursor-pointer" onClick={() => handleStateClick('Karnataka')} title="Karnataka" />
                <div className="absolute top-[58%] left-[40%] w-3 h-3 bg-cyan-400 rounded-full animate-pin-bounce cursor-pointer" style={{ animationDelay: '0.3s' }} onClick={() => handleStateClick('Kerala')} title="Kerala" />
                <div className="absolute top-[50%] left-[48%] w-3 h-3 bg-purple-400 rounded-full animate-pin-bounce cursor-pointer" style={{ animationDelay: '0.6s' }} onClick={() => handleStateClick('Tamil Nadu')} title="Tamil Nadu" />
                <div className="absolute top-[52%] left-[52%] w-3 h-3 bg-orange-400 rounded-full animate-pin-bounce cursor-pointer" style={{ animationDelay: '0.9s' }} onClick={() => handleStateClick('Andhra Pradesh')} title="Andhra Pradesh" />
                <div className="absolute top-[48%] left-[50%] w-3 h-3 bg-emerald-400 rounded-full animate-pin-bounce cursor-pointer" style={{ animationDelay: '1.2s' }} onClick={() => handleStateClick('Telangana')} title="Telangana" />
                <div className="absolute top-[40%] left-[34%] w-3 h-3 bg-pink-400 rounded-full animate-pin-bounce cursor-pointer" style={{ animationDelay: '1.5s' }} onClick={() => handleStateClick('Goa')} title="Goa" />
              </div>
            </div>

            {/* State cards */}
            <div className="reveal stagger-3 lg:col-span-2 space-y-3">
              {STATES.map((state) => (
                <button
                  key={state.name}
                  onClick={() => handleStateClick(state.name)}
                  className="state-card-interactive w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900/80 border border-white/5 text-left"
                  style={{
                    '--card-color': state.color,
                    '--card-glow': state.glow,
                  } as React.CSSProperties}
                  onMouseEnter={() => setHighlightedState(state.name)}
                  onMouseLeave={() => setHighlightedState(null)}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: state.glow }}
                  >
                    {state.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-200">
                        {state.name}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: state.color }}
                      />
                    </div>
                    <span className="text-xs text-stone-500">
                      {state.destinations}+ destinations
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-stone-600"
                  />
                </button>
              ))}

              {/* Category tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {[
                  { label: 'Leisure', color: 'text-cyan-400 border-cyan-400/30' },
                  { label: 'Adventure', color: 'text-emerald-400 border-emerald-400/30' },
                  { label: 'Pilgrim', color: 'text-orange-400 border-orange-400/30' },
                  { label: 'Heritage', color: 'text-amber-400 border-amber-400/30' },
                ].map((cat) => (
                  <span
                    key={cat.label}
                    className={`category-tag ${cat.color}`}
                  >
                    {cat.label}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[
                  { value: '50+', label: 'Destinations' },
                  { value: '6', label: 'States' },
                  { value: '50+', label: 'Vehicles' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                    <div className="stat-number text-lg font-bold">{s.value}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── DESTINATIONS ─────────── */}
      <section id="destinations" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Destinations
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Explore <span className="text-gradient-warm">Top Destinations</span>
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              Hand-picked destinations that showcase the best of South India&apos;s
              diverse beauty.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="reveal stagger-2 flex flex-wrap justify-center gap-2 mb-10">
            {['All', 'Hill Stations', 'Heritage', 'Nature & Beach', 'Pilgrimage'].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setDestFilter(tab)}
                  className={`dest-tab px-5 py-2 rounded-full text-sm font-medium border border-white/10 text-stone-400 hover:text-stone-200 ${
                    destFilter === tab ? 'active' : ''
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDests.map((dest) => (
              <div
                key={dest.id}
                className="reveal stagger-3 pkg-card group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-white/10 transition-all hover-lift card-shine"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={dest.img}
                    alt={dest.name}
                    fill
                    className="pkg-img object-cover"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {dest.tag && (
                    <span
                      className={`absolute top-3 left-3 category-tag ${dest.tagColor}`}
                    >
                      {dest.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-stone-100 mb-1">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mb-3">
                    <MapPin size={12} />
                    {dest.location}
                  </p>
                  <p className="text-sm text-stone-400 leading-relaxed mb-4 line-clamp-2">
                    {dest.desc}
                  </p>
                  <div className="flex items-center justify-end">
                    <a
                      href={`https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20explore%20${encodeURIComponent(dest.name)}.%20Please%20share%20trip%20details.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      <MessageCircle size={14} />
                      Enquire
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDests.length === 0 && (
            <div className="text-center py-16 text-stone-500">
              No destinations found for this category.
            </div>
          )}
        </div>
      </section>

      {/* ─────────── MYSORE TEMPLE & CHAMUNDI BETTA ─────────── */}
      <section id="mysore-places" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Mysuru Specials
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Mysuru Temple &amp;{' '}
              <span className="text-gradient-warm">Chamundi Betta</span>
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              Experience the divine heritage of Mysuru — from the magnificent Chamundeshwari Temple atop Chamundi Hills to the breathtaking panoramic views of the city below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chamundeshwari Temple Card */}
            <div className="reveal stagger-2 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/mysore-temple.jpg"
                  alt="Chamundeshwari Temple Mysuru"
                  fill
                  className="pkg-img object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-amber-400 border-amber-400/30">
                  🛕 Heritage Temple
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">Chamundeshwari Temple</h3>
                  <p className="text-sm text-stone-300 flex items-center gap-1">
                    <MapPin size={14} /> Chamundi Hills, Mysuru
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">
                  The Chamundeshwari Temple is one of the most prominent temples in Mysuru, perched atop the famous Chamundi Hills at an elevation of about 1,000 feet. Dedicated to Goddess Chamundeshwari, the deity of the Mysuru Royal Family, this temple features a magnificent seven-story gopuram (tower) adorned with intricate carvings and is a major pilgrimage destination visited by thousands of devotees every day.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['7-Story Gopuram', 'Dravidian Architecture', '1000 Steps', 'Panoramic Views', 'Free Darshan'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <a
                  href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20visit%20Chamundeshwari%20Temple%20Mysuru.%20Please%20share%20the%20trip%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>

            {/* Chamundi Betta Card */}
            <div className="reveal stagger-3 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/chamundi-betta.jpg"
                  alt="Chamundi Betta Hills Mysuru View"
                  fill
                  className="pkg-img object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-emerald-400 border-emerald-400/30">
                  ⛰️ Hill Viewpoint
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">Chamundi Betta (Betta means Hill)</h3>
                  <p className="text-sm text-stone-300 flex items-center gap-1">
                    <MapPin size={14} /> Chamundi Hills, Mysuru
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">
                  Chamundi Betta, standing at 3,489 feet above sea level, offers a spectacular panoramic view of the entire city of Mysuru. The hill is named after Goddess Chamundi and features the famous Nandi Statue — a massive monolith of Lord Nandi carved out of a single black granite rock. The drive up the hill is itself a beautiful experience through lush green forests with multiple viewpoints along the way.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Panoramic City View', 'Nandi Monolith', 'Sunspot Views', 'Nature Drive', 'Photography'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <a
                  href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20visit%20Chamundi%20Betta%20Mysuru.%20Please%20share%20the%20trip%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── VEHICLES / OUR FLEET ─────────── */}
      <section id="vehicles" className="relative py-20 md:py-32 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Our Fleet
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Choose Your Perfect{' '}
              <span className="text-gradient-warm">Ride</span>
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              Transparent per kilometer pricing for all vehicles. No hidden charges!
            </p>
          </div>

          {/* Need help banner */}
          <div className="reveal stagger-2 glass rounded-2xl p-4 mb-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <Phone size={18} className="text-amber-400" />
            <span className="text-sm text-stone-300">
              Need help choosing the right vehicle?
            </span>
            <a href="tel:+919876543210" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              Call us: +91 98765 43210
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEHICLES.map((v) => (
              <div
                key={v.id}
                className="reveal stagger-3 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift card-shine"
              >
                {/* Vehicle image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={v.img}
                    alt={v.model}
                    fill
                    className="pkg-img object-cover"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Badge */}
                  {v.badge && (
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${v.badgeColor}`}
                    >
                      {v.badge}
                    </span>
                  )}
                  {/* Vehicle type overlay */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">{v.type}</span>
                    <h3 className="text-lg font-bold text-white leading-tight">{v.model}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Per km price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold text-amber-400">{v.price}</span>
                    <span className="text-sm text-stone-400">{v.priceUnit}</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">Per Kilometer • {v.seats}</p>
                  <p className="text-sm text-stone-400 leading-relaxed mb-4">{v.desc}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {v.features.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1"
                      >
                        <IndianRupee size={10} className="text-amber-500/60" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Book on WhatsApp CTA */}
                  <a
                    href={`https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20book%20a%20${encodeURIComponent(v.model)}.%20Please%20share%20availability%20and%20pricing.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Book on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <div className="reveal stagger-4 mt-10 glass rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <IndianRupee size={20} className="text-amber-400" />
              <h4 className="text-base font-bold text-stone-200">Transparent Per KM Pricing</h4>
            </div>
            <p className="text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
              All prices are per kilometer. Minimum billing: 250 km/day. Toll charges, parking, and state taxes are extra as applicable.
              Driver allowance of ₹500/day included. Night halt charges apply for outstation trips.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── WHY CHOOSE US ─────────── */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              The RRM <span className="text-gradient-warm">Advantage</span>
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              What makes thousands of travellers trust us with their South India
              holidays.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((item, i) => (
              <div
                key={item.title}
                className={`reveal stagger-${i + 2 <= 7 ? i + 2 : 7} group p-6 rounded-2xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <item.icon size={22} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-stone-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── TAMIL NADU DESTINATIONS ─────────── */}
      <section id="tamilnadu" className="relative py-20 md:py-32 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Tamil Nadu
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Explore{' '}
              <span className="text-gradient-warm">Tamil Nadu</span>
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              Discover the ancient temples, serene hill stations, and pristine beaches of Tamil Nadu — the land of Dravidian culture and heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chennai */}
            <div className="reveal stagger-2 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-white/10 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/chennai-marina.jpg" alt="Marina Beach Chennai" fill className="pkg-img object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-cyan-400 border-cyan-400/30">🏖️ Beach</span>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-xl font-bold text-white">Chennai — Marina Beach</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">The longest urban beach in India, stretching 13 km along the Bay of Bengal. Home to the iconic lighthouse, Vivekananda House, and stunning sunrise views that are unmatched anywhere on the east coast.</p>
                <a href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20trip%20to%20Chennai%20Marina%20Beach.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={16} /> Enquire on WhatsApp</a>
              </div>
            </div>

            {/* Madurai */}
            <div className="reveal stagger-3 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-white/10 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/madurai-temple.jpg" alt="Meenakshi Temple Madurai" fill className="pkg-img object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-amber-400 border-amber-400/30">🛕 Heritage Temple</span>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-xl font-bold text-white">Madurai — Meenakshi Temple</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">One of the oldest and most magnificent temples in India, the Meenakshi Amman Temple features 14 towering gopurams covered in thousands of colorful stucco figures. A masterpiece of Dravidian architecture and a living cultural institution.</p>
                <a href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20visit%20Meenakshi%20Temple%20Madurai.%20Please%20share%20trip%20details." target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={16} /> Enquire on WhatsApp</a>
              </div>
            </div>

            {/* Rameswaram */}
            <div className="reveal stagger-4 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-white/10 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/rameswaram.jpg" alt="Rameswaram Temple" fill className="pkg-img object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-orange-400 border-orange-400/30">🙏 Pilgrimage</span>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-xl font-bold text-white">Rameswaram Temple</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">One of the four sacred Char Dham pilgrimage sites, Rameswaram is home to the Ramanathaswamy Temple with the world&apos;s longest temple corridor featuring 1,212 magnificently carved granite pillars stretching over 1,200 feet.</p>
                <a href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20visit%20Rameswaram%20Temple.%20Please%20share%20trip%20details." target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={16} /> Enquire on WhatsApp</a>
              </div>
            </div>

            {/* Kodaikanal */}
            <div className="reveal stagger-5 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-white/10 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/kodaikanal.jpg" alt="Kodaikanal Hill Station" fill className="pkg-img object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-emerald-400 border-emerald-400/30">⛰️ Hill Station</span>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-xl font-bold text-white">Kodaikanal — Princess of Hills</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">Known as the &quot;Princess of Hill Stations,&quot; Kodaikanal sits at 7,200 feet in the Palani Hills. The star-shaped lake, Coaker&apos;s Walk, Bryant Park, and misty mountain roads make it a perfect romantic getaway destination.</p>
                <a href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20Kodaikanal%20trip.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={16} /> Enquire on WhatsApp</a>
              </div>
            </div>

            {/* Ooty */}
            <div className="reveal stagger-6 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-white/10 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/ooty.jpg" alt="Ooty Hill Station" fill className="pkg-img object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-violet-400 border-violet-400/30">🚂 Toy Train</span>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-xl font-bold text-white">Ooty — Queen of Hill Stations</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">The famous Nilgiri Mountain Railway, a UNESCO World Heritage toy train, takes you through 208 curves and 16 tunnels to reach Ooty at 7,350 feet. Botanical Garden, Ooty Lake, Doddabetta Peak, and endless tea estates await you.</p>
                <a href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20an%20Ooty%20trip.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={16} /> Enquire on WhatsApp</a>
              </div>
            </div>

            {/* Pondicherry */}
            <div className="reveal stagger-7 group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-white/10 transition-all hover-lift card-shine">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/kerala.jpg" alt="Pondicherry French Colony" fill className="pkg-img object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 category-tag text-rose-400 border-rose-400/30">🇫🇷 French Heritage</span>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-xl font-bold text-white">Pondicherry — French Colony</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-stone-400 leading-relaxed mb-4">A unique blend of French colonial charm and Tamil culture. Walk through the picturesque French Quarter with its yellow buildings, visit the Auroville township, relax at Promenade Beach, and enjoy the finest French-Tamil fusion cuisine in India.</p>
                <a href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20Pondicherry%20trip.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={16} /> Enquire on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── GALLERY ─────────── */}
      <section id="gallery" className="relative py-20 md:py-32 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Gallery
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Glimpses of <span className="text-gradient-warm">South India</span>
            </h2>
          </div>

          {/* Masonry grid */}
          <div className="reveal stagger-2 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {[
              { src: '/mysuru-palace.jpg', alt: 'Mysuru Palace', h: 'h-64' },
              { src: '/coorg.jpg', alt: 'Coorg Hills', h: 'h-80' },
              { src: '/kerala.jpg', alt: 'Kerala Backwaters', h: 'h-56' },
              { src: '/ooty.jpg', alt: 'Ooty Tea Gardens', h: 'h-72' },
              { src: '/hampi.jpg', alt: 'Hampi Ruins', h: 'h-64' },
              { src: '/goa.jpg', alt: 'Goa Beaches', h: 'h-80' },
              { src: '/hero-mysuru.jpg', alt: 'Mysuru Landscape', h: 'h-56' },
            ].map((img, i) => (
              <div
                key={i}
                className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={400}
                  className={`w-full ${img.h} object-cover transition-transform duration-700 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── TESTIMONIALS ─────────── */}
      <section id="reviews" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Reviews
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              What Our <span className="text-gradient-warm">Travellers</span> Say
            </h2>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`reveal stagger-${i + 2 <= 7 ? i + 2 : 7} testimonial-card p-6 rounded-2xl bg-neutral-900/80 border border-white/5`}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-stone-300 leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-200">
                      {t.name}
                    </div>
                    <div className="text-xs text-stone-500">{t.trip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Marquee ratings */}
          <div className="reveal overflow-hidden">
            <div className="animate-marquee flex gap-8 whitespace-nowrap">
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex gap-8">
                  {[
                    { platform: 'Google', rating: '4.8', reviews: '1200+', icon: '⭐' },
                    { platform: 'TripAdvisor', rating: '4.7', reviews: '800+', icon: '🦉' },
                    { platform: 'Facebook', rating: '4.9', reviews: '600+', icon: '👍' },
                    { platform: 'JustDial', rating: '4.8', reviews: '500+', icon: '📞' },
                    { platform: 'HolidayIQ', rating: '4.6', reviews: '400+', icon: '✈️' },
                  ].map((r) => (
                    <div
                      key={`${setIdx}-${r.platform}`}
                      className="flex items-center gap-3 px-6 py-3 rounded-full glass shrink-0"
                    >
                      <span className="text-xl">{r.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-stone-200">
                          {r.platform}
                        </div>
                        <div className="text-xs text-stone-400">
                          {r.rating} ({r.reviews} reviews)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image
          src="/kerala.jpg"
          alt="CTA Background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="reveal text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Ready To Explore{' '}
            <span className="text-gradient-warm">South India?</span>
          </h2>
          <p className="reveal stagger-1 text-stone-400 text-lg mb-10">
            Plan your dream vacation today. Call or WhatsApp us for instant
            assistance.
          </p>
          <div className="reveal stagger-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <Phone size={18} />
              Call Now
            </a>
            <a
              href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20South%20India%20trip.%20Please%20share%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/10 text-stone-200 font-semibold hover:bg-white/5 transition-all"
            >
              <MessageCircle size={18} className="text-green-400" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ─────────── CONTACT ─────────── */}
      <section id="contact" className="relative py-20 md:py-32">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Contact Us
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Get In <span className="text-gradient-warm">Touch</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Info cards */}
            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: 'Office Address',
                  lines: ['123, Sayyaji Rao Road,', 'Near Maharaja\'s College, Mysuru — 570001'],
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  lines: ['+91 98765 43210', '+91 87654 32100'],
                },
                {
                  icon: Mail,
                  title: 'Email',
                  lines: ['info@rrmholidays.com', 'bookings@rrmholidays.com'],
                },
                {
                  icon: Clock,
                  title: 'Working Hours',
                  lines: ['Mon–Sat: 9:00 AM – 7:00 PM', 'Sunday: 10:00 AM – 2:00 PM'],
                },
              ].map((card, i) => (
                <div
                  key={card.title}
                  className={`reveal stagger-${i + 2 <= 7 ? i + 2 : 7} flex gap-4 p-5 rounded-xl bg-neutral-900/80 border border-white/5`}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <card.icon size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-200 mb-1">
                      {card.title}
                    </div>
                    {card.lines.map((line) => (
                      <p key={line} className="text-sm text-stone-400">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Social icons */}
              <div className="reveal stagger-6 flex gap-3 pt-4">
                {[
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Twitter, label: 'Twitter' },
                  { Icon: Youtube, label: 'YouTube' },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => showToast(`Opening ${label}...`)}
                    className="w-10 h-10 rounded-lg bg-neutral-900/80 border border-white/5 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/20 transition-all"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="reveal stagger-3">
              <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className="space-y-4 p-6 md:p-8 rounded-2xl bg-neutral-900/80 border border-white/5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name *"
                    required
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600"
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600"
                />
                <select
                  name="destination"
                  className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-400 appearance-none cursor-pointer"
                >
                  <option>Select Destination</option>
                  <option>Mysuru</option>
                  <option>Coorg</option>
                  <option>Kerala</option>
                  <option>Ooty</option>
                  <option>Hampi</option>
                  <option>Goa</option>
                  <option>Hyderabad</option>
                  <option>Tirupati</option>
                  <option>Custom Package</option>
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="date"
                    type="date"
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-400"
                  />
                  <select
                    name="travellers"
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-400 appearance-none cursor-pointer"
                  >
                    <option>Travellers</option>
                    <option>1 Person</option>
                    <option>2 Persons</option>
                    <option>3-5 Persons</option>
                    <option>6-10 Persons</option>
                    <option>10+ Persons</option>
                  </select>
                </div>
                <textarea
                  name="requirements"
                  rows={3}
                  placeholder="Special Requirements (optional)"
                  className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600 resize-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
                >
                  <Send size={16} />
                  Submit Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="relative border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Logo + description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-xs">
                  R
                </div>
                <span className="text-lg font-bold text-stone-100">
                  RRM <span className="text-amber-400">Holidays</span>
                </span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">
                Your trusted travel partner for magical South India experiences.
                Based in Mysuru, serving with passion since 2015.
              </p>
              <div className="flex gap-3">
                {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                  <button
                    key={i}
                    onClick={() => showToast('Opening social media...')}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-stone-500 hover:text-amber-400 transition-colors"
                    aria-label="Social"
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Col 2: Top Destinations */}
            <div>
              <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
                Top Destinations
              </h4>
              <ul className="space-y-2">
                {['Mysuru', 'Coorg', 'Ooty', 'Kerala', 'Hampi', 'Goa', 'Hyderabad', 'Tirupati'].map(
                  (d) => (
                    <li key={d}>
                      <a
                        href="#destinations"
                        className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                      >
                        {d}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {['About Us', 'Our Fleet', 'Destinations', 'Gallery', 'Testimonials', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(
                  (l) => (
                    <li key={l}>
                      <a
                        href="#contact"
                        className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
                Newsletter
              </h4>
              <p className="text-sm text-stone-500 mb-4">
                Get exclusive offers and travel tips delivered to your inbox.
              </p>
              <div className="flex gap-2 mb-6">
                <input
                  type="email"
                  placeholder="Your email"
                  className="search-input flex-1 px-3 py-2.5 rounded-lg text-sm text-stone-200 placeholder:text-stone-600"
                />
                <button
                  onClick={() => showToast('📬 Subscribed successfully!')}
                  className="px-4 py-2.5 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
              {/* Certification badge */}
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                <Award size={16} className="text-amber-400" />
                <span className="text-xs text-stone-400">
                  Govt. Licensed Tour Operator
                </span>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-600">
              © {new Date().getFullYear()} RRM Holidays. All rights reserved.
            </p>
            <p className="text-xs text-stone-600">
              Made with ❤️ in Mysuru, Karnataka
            </p>
          </div>
        </div>
      </footer>

      {/* ─────────── WHATSAPP FLOAT ─────────── */}
      <a
        href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20plan%20a%20South%20India%20trip.%20Please%20share%20details."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} className="text-white" />
      </a>

      {/* ─────────── TOAST CONTAINER ─────────── */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-xs">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast glass px-5 py-3 rounded-xl text-sm text-stone-200 font-medium"
          >
            {toast.msg}
          </div>
        ))}
      </div>

      {/* ─────────── BACK TO TOP ─────────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-all ${
          backToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ transition: 'all 0.4s ease' }}
        aria-label="Back to top"
      >
        <ChevronUp size={18} />
      </button>
    </>
  );
}
