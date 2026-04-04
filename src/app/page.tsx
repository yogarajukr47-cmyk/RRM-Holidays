'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '#contact' },
];

const STATE_CARDS = [
  { name: 'Karnataka', slug: 'karnataka', img: '/states/karnataka-cover.jpg', places: 26, tag: 'Heritage & Nature', tagColor: 'text-amber-400 border-amber-400/30', icon: '🏛️', desc: 'Royal palaces of Mysuru, misty hills of Coorg, ancient ruins of Hampi, coffee estates of Chikmagalur & pristine beaches of Mangalore.' },
  { name: 'Kerala', slug: 'kerala', img: '/states/kerala-cover.jpg', places: 13, tag: "God's Own Country", tagColor: 'text-cyan-400 border-cyan-400/30', icon: '🛶', desc: 'Backwaters of Alleppey, tea gardens of Munnar, wildlife of Thekkady, beaches of Kovalam, temples of Thrissur & hills of Wayanad.' },
  { name: 'Tamil Nadu', slug: 'tamilnadu', img: '/states/tamilnadu-cover.jpg', places: 22, tag: 'Temple Heritage', tagColor: 'text-purple-400 border-purple-400/30', icon: '🛕', desc: 'Meenakshi Temple Madurai, Marina Beach Chennai, Ooty hill station, Rameswaram pilgrimage, Kodaikanal & French charm of Pondicherry.' },
  { name: 'Goa', slug: 'goa', img: '/states/goa-cover.jpg', places: 16, tag: 'Beach Paradise', tagColor: 'text-pink-400 border-pink-400/30', icon: '🏖️', desc: 'Sun-kissed beaches of Baga & Palolem, Portuguese heritage of Old Goa, Dudhsagar Falls, Fort Aguada & charming Fontainhas.' },
  { name: 'Andhra Pradesh', slug: 'andhra', img: '/states/andhra-cover.jpg', places: 19, tag: 'Pilgrimage & Nature', tagColor: 'text-orange-400 border-orange-400/30', icon: '⛰️', desc: 'Sacred Tirupati Temple, Araku Valley coffee plantations, Visakhapatnam beaches, Gandikota Fort & historic Amaravati.' },
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
  /* ── auth ── */
  const { data: session } = useSession();

  /* ── state ── */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [backToTop, setBackToTop] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const toastIdRef = useRef(0);

  /* ── booking form state ── */
  const [bookingDestination, setBookingDestination] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMembers, setBookingMembers] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingVehicle, setBookingVehicle] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  /* ── vehicle detail panel state ── */
  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLES[0] | null>(null);

  const WHATSAPP_NUMBER = '919108597154';

  const DESTINATIONS = [
    'Mysuru', 'Bengaluru', 'Coorg', 'Hampi', 'Chikmagalur', 'Mangalore', 'Ooty', 'Kodaikanal',
    'Kerala', 'Munnar', 'Kochi', 'Alleppey', 'Kovalam', 'Thekkady', 'Wayanad',
    'Goa', 'Panaji', 'Baga Beach', 'Old Goa', 'Dudhsagar Falls',
    'Tamil Nadu', 'Chennai', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Pondicherry',
    'Andhra Pradesh', 'Tirupati', 'Visakhapatnam', 'Araku Valley', 'Vijayawada',
    'Hyderabad', 'Telangana',
  ];

  const handleBookingSubmit = () => {
    if (!bookingDestination || !bookingDate || !bookingMembers) {
      showToast('⚠️ Please select destination, date & members');
      return;
    }
    const msg = `🎉 *New Booking Enquiry — RRM Holidays*

📍 *Destination:* ${bookingDestination}
📅 *Travel Date:* ${bookingDate}
👥 *No. of Travellers:* ${bookingMembers}
${bookingName ? `👤 *Name:* ${bookingName}` : ''}
${bookingPhone ? `📱 *Phone:* ${bookingPhone}` : ''}
${bookingVehicle ? `🚗 *Vehicle Preference:* ${bookingVehicle}` : ''}
${bookingNotes ? `📝 *Notes:* ${bookingNotes}` : ''}

Please share packages & pricing. Thank you!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    showToast('✅ Opening WhatsApp with your enquiry!');
  };

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
    const sections = NAV_LINKS.filter(l => l.href.startsWith('#')).map((l) => l.href.replace('#', ''));
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

  /* ── contact form submit → WhatsApp ── */
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactDest, setContactDest] = useState('');
  const [contactDate, setContactDate] = useState('');
  const [contactTravellers, setContactTravellers] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = () => {
    if (!contactName || !contactPhone) {
      showToast('⚠️ Please enter your name and phone number');
      return;
    }
    const msg = `📋 *New Enquiry — RRM Holidays*

👤 *Name:* ${contactName}
📱 *Phone:* ${contactPhone}
${contactEmail ? `📧 *Email:* ${contactEmail}` : ''}
${contactDest ? `📍 *Destination:* ${contactDest}` : ''}
${contactDate ? `📅 *Travel Date:* ${contactDate}` : ''}
${contactTravellers ? `👥 *Travellers:* ${contactTravellers}` : ''}
${contactMsg ? `💬 *Message:* ${contactMsg}` : ''}

Please get back to me. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('✅ Opening WhatsApp with your enquiry!');
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
            <img src="/logo.png" alt="RRM Holidays" className="h-10 w-auto rounded-lg object-contain" />
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
            {/* Auth buttons / User menu */}
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={(session.user as { role?: string })?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">
                    {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-2 rounded-full text-sm text-stone-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
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
          <div className="mt-auto space-y-2">
            {!session ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 rounded-full text-stone-300 font-medium text-sm hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={(session.user as { role?: string })?.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 rounded-full text-stone-300 font-medium text-sm hover:bg-white/5 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="block w-full text-center py-3 rounded-full text-red-400 font-medium text-sm hover:bg-red-500/5 transition-all"
                >
                  Logout
                </button>
              </>
            )}
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

          {/* Booking Enquiry Form */}
          <div className="glass rounded-2xl p-4 md:p-6 max-w-5xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-green-400" />
              <span className="text-sm font-semibold text-stone-200">Book Your Trip — Instant WhatsApp Enquiry</span>
            </div>
            {/* Row 1: Destination, Date, Members, Vehicle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <select value={bookingDestination} onChange={e => setBookingDestination(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer">
                  <option value="">Select Destination</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" />
              </div>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <select value={bookingMembers} onChange={e => setBookingMembers(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer">
                  <option value="">Travellers</option>
                  <option>1 Person</option>
                  <option>2 Persons</option>
                  <option>3-5 Persons</option>
                  <option>6-10 Persons</option>
                  <option>11-20 Persons</option>
                  <option>21-35 Persons</option>
                  <option>35+ Persons</option>
                </select>
              </div>
              <div className="relative">
                <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <select value={bookingVehicle} onChange={e => setBookingVehicle(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer">
                  <option value="">Vehicle (Optional)</option>
                  <option>Sedan (Etios/Dzire)</option>
                  <option>Innova</option>
                  <option>Innova Crysta</option>
                  <option>Tempo Traveller</option>
                  <option>Mini Bus (21 Seater)</option>
                  <option>Bus (25/33 Seater)</option>
                  <option>Luxury Coach (50 Seater)</option>
                  <option>Need Suggestion</option>
                </select>
              </div>
            </div>
            {/* Row 2: Name, Phone, Notes, Submit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">👤</span>
                <input type="text" placeholder="Your Name" value={bookingName} onChange={e => setBookingName(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="tel" placeholder="Phone Number" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">📝</span>
                <input type="text" placeholder="Special Requests (Optional)" value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" />
              </div>
              <button
                onClick={handleBookingSubmit}
                className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-500 transition-all text-sm"
              >
                <MessageCircle size={16} />
                Enquire on WhatsApp
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

          <div className="reveal stagger-2 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-neutral-900/50">
              <Image
                src="/south-india-coverage.jpeg"
                alt="South India Coverage"
                width={1344}
                height={768}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="reveal stagger-3 grid grid-cols-3 gap-3 mt-10 max-w-md mx-auto">
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
      </section>

      {/* ─────────── DESTINATIONS ─────────── */}
      <section id="destinations" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Destinations
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Explore <span className="text-gradient-warm">South Indian States</span>
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              Click on any state to discover its top destinations, plan your trip, and book with us instantly.
            </p>
          </div>

          {/* State cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STATE_CARDS.map((state, idx) => (
              <Link
                key={state.slug}
                href={`/destinations/${state.slug}`}
                className={`reveal stagger-${idx + 2 <= 7 ? idx + 2 : 7} group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift card-shine block`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={state.img}
                    alt={state.name}
                    fill
                    className="pkg-img object-cover"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className={`absolute top-3 left-3 category-tag ${state.tagColor}`}>
                    {state.icon} {state.tag}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{state.name}</h3>
                    <p className="text-xs text-stone-300 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {state.places} Top Places to Visit
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-stone-400 leading-relaxed mb-4 line-clamp-2">
                    {state.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">{state.places} destinations</span>
                    <span className="text-sm font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
                      Explore {state.name} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── VEHICLES / OUR FLEET — LIVE STREAM SCROLL ─────────── */}
      <section id="vehicles" className="relative py-20 md:py-32 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Our Fleet
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              Choose Your Perfect{' '}
              <span className="text-gradient-warm">Ride</span>
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              Transparent per kilometer pricing for all vehicles. Scroll through our complete fleet!
            </p>
          </div>

          {/* Need help banner */}
          <div className="reveal stagger-2 glass rounded-2xl p-3 mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <Phone size={16} className="text-amber-400" />
            <span className="text-sm text-stone-300">Need help choosing the right vehicle?</span>
            <a href="tel:+919108597154" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              Call us: +91 91085 97154
            </a>
          </div>
        </div>

        {/* ── Live Stream Horizontal Scroll Track ── */}
        <div className="reveal stagger-3 relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
          {/* Glow edge accents */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/60 to-transparent z-10 pointer-events-none" />

          {/* Row 1: scroll left */}
          <div className="flex animate-marquee-vehicles hover:[animation-play-state:paused]">
            {[...VEHICLES, ...VEHICLES, ...VEHICLES, ...VEHICLES].map((v, i) => (
              <div
                key={`r1-${v.id}-${i}`}
                onClick={() => setSelectedVehicle(v)}
                className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] mx-3 rounded-2xl overflow-hidden bg-neutral-900/80 border cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 card-shine ${selectedVehicle?.id === v.id ? 'ring-2 ring-amber-500 border-amber-500/40 scale-[1.03]' : 'border-white/5'}`}
              >
                <div className="relative h-[140px] sm:h-[160px] overflow-hidden">
                  <Image src={v.img} alt={v.model} fill className="object-cover" sizes="340px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {v.badge && (
                    <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider ${v.badgeColor}`}>{v.badge}</span>
                  )}
                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="text-[9px] font-semibold text-amber-400 uppercase tracking-widest">{v.type}</span>
                    <h3 className="text-sm font-bold text-white leading-tight">{v.model}</h3>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-bold text-amber-400">{v.price}</span>
                    <span className="text-[10px] text-stone-400">{v.priceUnit}</span>
                  </div>
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">{v.seats}</span>
                  <span className="text-[11px] font-medium text-amber-400/80 flex items-center gap-1">
                    View Details <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: scroll right (reversed) */}
          <div className="flex mt-4 animate-marquee-vehicles-reverse hover:[animation-play-state:paused]" style={{ animationDirection: 'reverse' }}>
            {[...VEHICLES.slice().reverse(), ...VEHICLES.slice().reverse(), ...VEHICLES.slice().reverse(), ...VEHICLES.slice().reverse()].map((v, i) => (
              <div
                key={`r2-${v.id}-${i}`}
                onClick={() => setSelectedVehicle(v)}
                className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] mx-3 rounded-2xl overflow-hidden bg-neutral-900/80 border cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 card-shine ${selectedVehicle?.id === v.id ? 'ring-2 ring-amber-500 border-amber-500/40 scale-[1.03]' : 'border-white/5'}`}
              >
                <div className="relative h-[140px] sm:h-[160px] overflow-hidden">
                  <Image src={v.img} alt={v.model} fill className="object-cover" sizes="340px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {v.badge && (
                    <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider ${v.badgeColor}`}>{v.badge}</span>
                  )}
                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="text-[9px] font-semibold text-amber-400 uppercase tracking-widest">{v.type}</span>
                    <h3 className="text-sm font-bold text-white leading-tight">{v.model}</h3>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-bold text-amber-400">{v.price}</span>
                    <span className="text-[10px] text-stone-400">{v.priceUnit}</span>
                  </div>
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">{v.seats}</span>
                  <span className="text-[11px] font-medium text-amber-400/80 flex items-center gap-1">
                    View Details <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vehicle Detail Panel (Glass Morphism) ── */}
        {selectedVehicle && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
            <div className="reveal glass rounded-2xl overflow-hidden border border-white/5 animate-[fade-up_0.4s_ease]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Image */}
                <div className="relative h-[250px] md:h-[320px] overflow-hidden">
                  <Image src={selectedVehicle.img} alt={selectedVehicle.model} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                  {selectedVehicle.badge && (
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${selectedVehicle.badgeColor}`}>{selectedVehicle.badge}</span>
                  )}
                  {/* Close button */}
                  <button onClick={() => setSelectedVehicle(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10">
                    <X size={16} />
                  </button>
                </div>

                {/* Right: Details */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest mb-1">{selectedVehicle.type}</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{selectedVehicle.model}</h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-extrabold text-amber-400">{selectedVehicle.price}</span>
                    <span className="text-sm text-stone-400">{selectedVehicle.priceUnit}</span>
                  </div>

                  <p className="text-sm text-stone-500 mb-1">Per Kilometer &bull; {selectedVehicle.seats}</p>
                  <p className="text-sm text-stone-400 leading-relaxed mb-5">{selectedVehicle.desc}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedVehicle.features.map((f) => (
                      <span key={f} className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 border border-white/5">
                        <IndianRupee size={10} className="text-amber-500/60" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20book%20a%20${encodeURIComponent(selectedVehicle.model)}.%20Please%20share%20availability%20and%20pricing.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Book on WhatsApp
                    </a>
                    <a
                      href="tel:+919108597154"
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-stone-200 text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Phone size={16} />
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing note */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
          <div className="reveal stagger-4 glass rounded-2xl p-6 text-center">
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

      {/* ─────────── 6 STATES, 6 EXPERIENCES ─────────── */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">
              Why South India
            </span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
              6 States, <span className="text-gradient-warm">6 Unique</span> Experiences
            </h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
              Each South Indian state offers something completely different. From ancient temples to tropical beaches, from misty mountains to royal palaces — discover what makes each state special.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { state: 'Karnataka', icon: '🏛️', color: 'amber', title: 'Royal Heritage & Coffee Hills', desc: 'Explore the magnificent Mysuru Palace illuminated by 97,000 bulbs, walk through the ruins of the Vijayanagara Empire at Hampi, trek to Mullayanagiri — Karnataka\'s highest peak, and sip freshly brewed coffee in Coorg\'s misty plantations. From the tech hub of Bengaluru to the stone temples of Belur and Halebidu, Karnataka is a treasure trove of history, nature, and culture.', experiences: ['Palace & Dasara Festival', 'Hampi UNESCO Ruins', 'Coorg Coffee Trails', 'Western Ghats Trekking'], slug: 'karnataka' },
              { state: 'Kerala', icon: '🛶', color: 'cyan', title: 'Backwaters, Beaches & Ayurveda', desc: 'Cruise through the serene backwaters of Alleppey on a traditional houseboat, watch the sun rise over Munnar\'s endless tea gardens, encounter wildlife at Thekkady\'s Periyar Tiger Reserve, and rejuvenate with authentic Ayurvedic treatments. Kerala\'s unique blend of natural beauty, rich culture, and world-class hospitality makes it God\'s Own Country.', experiences: ['Alleppey Houseboats', 'Munnar Tea Gardens', 'Kathakali Performances', 'Ayurvedic Wellness'], slug: 'kerala' },
              { state: 'Tamil Nadu', icon: '🛕', color: 'purple', title: 'Ancient Temples & French Charm', desc: 'Marvel at the towering gopurams of Madurai\'s Meenakshi Temple, ride the UNESCO-listed toy train through Ooty\'s Nilgiri Hills, walk the French Quarter of Pondicherry, and witness the confluence of three oceans at Kanyakumari. Tamil Nadu\'s living temple traditions, classical dance, and culinary heritage span thousands of years.', experiences: ['Meenakshi Temple', 'Ooty Toy Train', 'Pondicherry French Quarter', 'Marina Beach'], slug: 'tamilnadu' },
              { state: 'Goa', icon: '🏖️', color: 'pink', title: 'Sun, Sand & Portuguese Heritage', desc: 'Soak up the sun on world-famous beaches like Baga and Palolem, explore the colonial churches of Old Goa (a UNESCO World Heritage Site), chase the thundering Dudhsagar Falls, and party the night away at beachside shacks. Goa\'s unique Indo-Portuguese culture, seafood cuisine, and laid-back vibe make it India\'s favourite holiday destination.', experiences: ['Baga & Palolem Beaches', 'Old Goa Churches', 'Dudhsagar Falls', 'Nightlife & Cuisine'], slug: 'goa' },
              { state: 'Andhra Pradesh', icon: '⛰️', color: 'orange', title: 'Sacred Temples & Tribal Valleys', desc: 'Seek blessings at Tirupati — the world\'s most-visited pilgrimage site, explore the coffee plantations and tribal culture of Araku Valley, discover the stunning Gandikota Grand Canyon (India\'s own Grand Canyon), and relax on Visakhapatnam\'s pristine beaches. Andhra Pradesh offers a perfect mix of spirituality, nature, and adventure.', experiences: ['Tirupati Balaji Temple', 'Araku Valley Coffee', 'Gandikota Canyon', 'Vizag Beaches'], slug: 'andhra' },
              { state: 'Telangana', icon: '🏙️', color: 'blue', title: 'Nizami Grandeur & Tech City', desc: 'Explore Hyderabad — the City of Pearls and Biryanis, marvel at the iconic Charminar and Golconda Fort\'s acoustic marvel, shop at Laad Bazaar\'s dazzling bangle market, and taste the legendary Hyderabadi Dum Biryani. From the historic Nizam\'s legacy to HITEC City\'s modern tech scene, Telangana bridges two worlds beautifully.', experiences: ['Charminar & Golconda Fort', 'Hyderabadi Biryani Trail', 'Ramoji Film City', 'Hussain Sagar Lake'], slug: 'karnataka' },
            ].map((item, i) => (
              <div
                key={item.state}
                onClick={() => window.location.href = `/destinations/${item.slug}`}
                className={`reveal stagger-${i + 2 <= 7 ? i + 2 : 7} group p-6 rounded-2xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift cursor-pointer`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-stone-100">{item.state}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{item.title}</p>
                  </div>
                </div>
                <p className="text-sm text-stone-400 leading-relaxed mb-4">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.experiences.map(e => (
                    <span key={e} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{e}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href={`https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20want%20to%20explore%20${encodeURIComponent(item.state)}.%20Please%20share%20packages.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-xs font-semibold text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                  >
                    <MessageCircle size={12} /> Enquire on WhatsApp
                  </a>
                  <span className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── REVIEWS TEASER ─────────── */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-3xl p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="reveal">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={20} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                    <span className="text-gradient-warm">4.8</span> Average Rating
                  </h2>
                  <p className="text-stone-400 leading-relaxed mb-6">
                    Over 3,500+ verified reviews from travellers across India. Read their stories, see their photos, and understand why families, couples, and corporate groups trust RRM Holidays for their South India adventures.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {[
                      { platform: 'Google', rating: '4.8', reviews: '1,200+' },
                      { platform: 'TripAdvisor', rating: '4.7', reviews: '800+' },
                      { platform: 'Facebook', rating: '4.9', reviews: '600+' },
                    ].map(r => (
                      <div key={r.platform} className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-sm font-bold text-amber-400">{r.rating}</div>
                        <div className="text-[10px] text-stone-500">{r.platform}</div>
                        <div className="text-[10px] text-stone-600">{r.reviews}</div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all"
                  >
                    Read All Reviews <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="reveal stagger-2 space-y-4">
                  {TESTIMONIALS.map((t) => (
                    <div key={t.name} className="testimonial-card p-5 rounded-xl bg-neutral-900/80 border border-white/5">
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-stone-300 leading-relaxed mb-3 italic">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-stone-200">{t.name}</div>
                          <div className="text-[10px] text-stone-500">{t.trip}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              href="tel:+919108597154"
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
                  lines: ['+91 91085 97154'],
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
                <a href="https://www.instagram.com/__yogaraju__?igsh=cnNkYWIycTM2MzQ4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-neutral-900/80 border border-white/5 flex items-center justify-center text-stone-400 hover:text-pink-400 hover:border-pink-500/20 transition-all" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20found%20you%20on%20your%20website.`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-neutral-900/80 border border-white/5 flex items-center justify-center text-stone-400 hover:text-green-400 hover:border-green-500/20 transition-all" aria-label="WhatsApp">
                  <MessageCircle size={18} />
                </a>
                <a href="tel:+919108597154" className="w-10 h-10 rounded-lg bg-neutral-900/80 border border-white/5 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/20 transition-all" aria-label="Call Us">
                  <Phone size={18} />
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20found%20you%20on%20YouTube.`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-neutral-900/80 border border-white/5 flex items-center justify-center text-stone-400 hover:text-red-400 hover:border-red-500/20 transition-all" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Right: Form → WhatsApp */}
            <div className="reveal stagger-3">
              <div className="space-y-4 p-6 md:p-8 rounded-2xl bg-neutral-900/80 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={16} className="text-green-400" />
                  <span className="text-sm font-semibold text-stone-200">Send Enquiry via WhatsApp</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600"
                />
                <select
                  value={contactDest}
                  onChange={e => setContactDest(e.target.value)}
                  className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-400 appearance-none cursor-pointer"
                >
                  <option value="">Select Destination</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="Custom Package">Custom Package</option>
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={contactDate}
                    onChange={e => setContactDate(e.target.value)}
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-400"
                  />
                  <select
                    value={contactTravellers}
                    onChange={e => setContactTravellers(e.target.value)}
                    className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-400 appearance-none cursor-pointer"
                  >
                    <option value="">Travellers</option>
                    <option value="1 Person">1 Person</option>
                    <option value="2 Persons">2 Persons</option>
                    <option value="3-5 Persons">3-5 Persons</option>
                    <option value="6-10 Persons">6-10 Persons</option>
                    <option value="10+ Persons">10+ Persons</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  placeholder="Special Requirements (optional)"
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 placeholder:text-stone-600 resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleContactSubmit}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 transition-all"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Us
                  </button>
                  <a
                    href="tel:+919108597154"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
                  >
                    <Phone size={16} />
                    Call Us Now
                  </a>
                </div>
                <p className="text-center text-[10px] text-stone-600 mt-1">
                  Your enquiry goes directly to our WhatsApp. We reply within 30 minutes during business hours.
                </p>
              </div>
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
                <img src="/logo.png" alt="RRM Holidays" className="h-8 w-auto rounded-lg object-contain" />
                <span className="text-lg font-bold text-stone-100">
                  RRM <span className="text-amber-400">Holidays</span>
                </span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">
                Your trusted travel partner for magical South India experiences.
                Based in Mysuru, serving with passion since 2015.
              </p>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/__yogaraju__?igsh=cnNkYWIycTM2MzQ4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-stone-500 hover:text-pink-400 transition-colors" aria-label="Instagram">
                  <Instagram size={14} />
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-stone-500 hover:text-green-400 transition-colors" aria-label="WhatsApp">
                  <MessageCircle size={14} />
                </a>
                <a href="tel:+919108597154" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-stone-500 hover:text-amber-400 transition-colors" aria-label="Call">
                  <Phone size={14} />
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-stone-500 hover:text-red-400 transition-colors" aria-label="YouTube">
                  <Youtube size={14} />
                </a>
              </div>
            </div>

            {/* Col 2: Top Destinations */}
            <div>
              <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
                Top Destinations
              </h4>
              <ul className="space-y-2">
                {[
                  { name: 'Karnataka', href: '/destinations/karnataka' },
                  { name: 'Kerala', href: '/destinations/kerala' },
                  { name: 'Tamil Nadu', href: '/destinations/tamilnadu' },
                  { name: 'Goa', href: '/destinations/goa' },
                  { name: 'Andhra Pradesh', href: '/destinations/andhra' },
                ].map((d) => (
                  <li key={d.name}>
                    <Link
                      href={d.href}
                      className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-stone-200 mb-4 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'About Us', href: '#about' },
                  { label: 'Our Fleet', href: '#vehicles' },
                  { label: 'Destinations', href: '#destinations' },
                  { label: 'Gallery', href: '#gallery' },
                  { label: 'Reviews', href: '/reviews' },
                  { label: 'Contact Us', href: '#contact' },
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                ].map(
                  (item) => (
                    <li key={item.label}>
                      {item.href.startsWith('/') ? (
                        <Link
                          href={item.href}
                          className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                        >
                          {item.label}
                        </a>
                      )}
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
