'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Users,
  Shield,
  X,
  Calendar,
  MapPin,
  User,
  PhoneCall,
  FileText,
  IndianRupee,
  Car,
  Clock,
  Star,
} from 'lucide-react';

/* ─── Vehicle Data ─── */
const VEHICLES = [
  { id: 1, type: 'Sedan', model: 'Toyota Etios', img: '/sedan-etios.jpg', seats: '4 Seaters', seatNum: 4, pricePerKm: '₹12', badge: null, badgeColor: '', features: ['AC', 'Music System', 'Comfortable Seats', 'Boot Space'], desc: 'Perfect for small family trips and city tours. Spacious boot, comfortable interiors, and smooth highway performance.', ac: 'Full AC', luggage: '2 large + 2 small bags', transmission: 'Automatic' },
  { id: 2, type: 'Sedan', model: 'Maruti Swift Dzire', img: '/swift-dzire.jpg', seats: '4 Seaters', seatNum: 4, pricePerKm: '₹12', badge: 'Popular', badgeColor: 'bg-amber-500', features: ['AC', 'Music System', 'Comfortable Seats', 'Fuel Efficient'], desc: 'Compact sedan ideal for city rides and short trips. Known for exceptional fuel efficiency and reliable performance.', ac: 'Full AC', luggage: '1 large + 2 small bags', transmission: 'Automatic' },
  { id: 3, type: 'MUV', model: 'Toyota Innova', img: '/innova-muv.jpg', seats: '7 Seaters', seatNum: 7, pricePerKm: '₹18', badge: null, badgeColor: '', features: ['Spacious', 'AC', 'Music System', 'Luggage Space'], desc: 'Ideal for family vacations and group travel. The most trusted MUV in India with ample cabin space and powerful AC.', ac: 'Dual Zone AC', luggage: '4 large + hand luggage', transmission: 'Automatic' },
  { id: 4, type: 'Premium MUV', model: 'Innova Crysta', img: '/innova-crysta.jpg', seats: '7 Seaters', seatNum: 7, pricePerKm: '₹18', badge: 'Premium', badgeColor: 'bg-violet-500', features: ['Premium AC', 'Luxury Seats', 'Entertainment', 'Captain Seats'], desc: 'Premium comfort for luxury travel. Captain seats with armrests, touchscreen entertainment, and rear AC vents.', ac: 'Rear + Captain AC', luggage: '4 large + hand luggage', transmission: 'Automatic' },
  { id: 10, type: 'Tempo Traveller', model: 'Force Urbania 10 Seater', img: '/urbania-10.jpg', seats: '10 Seaters', seatNum: 10, pricePerKm: '₹33', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Compact yet spacious 10-seater Urbania, perfect for medium groups exploring South India with modern comfort.', ac: 'Powerful AC', luggage: 'Rear cabin + overhead', transmission: 'Manual' },
  { id: 11, type: 'Tempo Traveller', model: 'Force Urbania 13 Seater', img: '/urbania-13.jpg', seats: '13 Seaters', seatNum: 13, pricePerKm: '₹36', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'Versatile 13-seater Urbania, a crowd favourite for family trips, temple tours, and weekend getaways.', ac: 'Rear + Overhead AC', luggage: 'Rear cabin + overhead', transmission: 'Manual' },
  { id: 5, type: 'Tempo Traveller', model: 'Force Tempo Traveller 12 Seater', img: '/tempo-traveller.jpg', seats: '12 Seaters', seatNum: 12, pricePerKm: '₹21', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Best for medium groups, corporate trips and family outings with pushback reclining seats and powerful AC.', ac: 'Powerful AC', luggage: 'Overhead + rear cabin', transmission: 'Manual' },
  { id: 12, type: 'Tempo Traveller', model: 'Force Urbania 16 Seater', img: '/urbania-16.jpg', seats: '16 Seaters', seatNum: 16, pricePerKm: '₹39', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Extra Luggage'], desc: 'Largest Force Urbania variant with 16 comfortable pushback seats for extended family and corporate trips.', ac: 'Rear + Overhead AC', luggage: 'Separate boot + cabin', transmission: 'Manual' },
  { id: 6, type: 'Mini Bus', model: '21 Seater Mini Bus', img: '/mini-bus.jpg', seats: '21 Seaters', seatNum: 21, pricePerKm: '₹30', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'Best for large groups, weddings and corporate events with comfortable pushback seating and individual AC vents.', ac: 'Rear + Overhead AC', luggage: 'Separate boot + cabin', transmission: 'Manual' },
  { id: 7, type: 'Bus', model: '25 Seater Bus', img: '/bus-25seater.jpg', seats: '25 Seaters', seatNum: 25, pricePerKm: '₹35', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'PA System'], desc: 'Ideal for large groups, school trips and corporate outings with well-maintained pushback seats.', ac: 'Full AC', luggage: 'Under-seat + separate hold', transmission: 'Manual' },
  { id: 8, type: 'Bus', model: '33 Seater Bus', img: '/bus-33seater.jpg', seats: '33 Seaters', seatNum: 33, pricePerKm: '₹38', badge: null, badgeColor: '', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System'], desc: 'Spacious bus for pilgrimage tours and large group travel with recliner seats and ample legroom.', ac: 'Full AC', luggage: 'Under-seat + separate hold', transmission: 'Manual' },
  { id: 9, type: 'Luxury Bus', model: '50 Seater Luxury Coach', img: '/bus-50seater.jpg', seats: '50 Seaters', seatNum: 50, pricePerKm: '₹55', badge: 'Luxury', badgeColor: 'bg-cyan-500', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System', 'WiFi'], desc: 'Luxury Volvo coach for very large groups with premium recliner seats, dual-zone AC, onboard WiFi.', ac: 'Dual Zone AC', luggage: 'Large under-belly + overhead', transmission: 'Automatic' },
];

const WHATSAPP_NUMBER = '919108597154';

/* ─── Booking Form Modal ─── */
function BookingModal({ vehicle, onClose }: { vehicle: typeof VEHICLES[number]; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    pickup: '',
    date: '',
    placeToVisit: '',
    members: '',
    phone: '',
    requirements: '',
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const message =
      `🚗 *Vehicle Booking Request — RRM Holidays*\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Vehicle Selected:*\n` +
      `📦 ${vehicle.model} (${vehicle.type})\n` +
      `💺 ${vehicle.seats}\n` +
      `💰 ${vehicle.pricePerKm}/km\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `*Customer Details:*\n` +
      `👤 Name: ${formData.name}\n` +
      `📍 Pickup Address: ${formData.pickup}\n` +
      `📅 Travel Date: ${formData.date}\n` +
      `🗺️ Places to Visit: ${formData.placeToVisit}\n` +
      `👥 No. of Members: ${formData.members}\n` +
      `📱 Phone: ${formData.phone}\n` +
      `📝 Requirements: ${formData.requirements || 'None'}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `— Sent from RRM Holidays Website`;

    setTimeout(() => {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        '_blank'
      );
      setSending(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>

        {/* Vehicle header */}
        <div className="relative h-48 overflow-hidden rounded-t-3xl">
          <Image
            src={vehicle.img}
            alt={vehicle.model}
            fill
            className="object-cover"
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          {vehicle.badge && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${vehicle.badgeColor}`}>
              {vehicle.badge}
            </span>
          )}
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">{vehicle.type}</span>
            <h3 className="text-xl font-bold text-white">{vehicle.model}</h3>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-stone-300">
                <Users size={12} className="text-amber-400" /> {vehicle.seats}
              </span>
              <span className="flex items-center gap-1 text-xs text-stone-300">
                <IndianRupee size={12} className="text-amber-400" /> {vehicle.pricePerKm}/km
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
          <p className="text-xs text-stone-500 text-center -mt-1 mb-2">
            Fill in your trip details — we&apos;ll get back instantly via WhatsApp
          </p>

          {/* Name */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              <User size={12} className="text-amber-400" /> Your Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Pickup Address */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              <MapPin size={12} className="text-amber-400" /> Pickup Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="pickup"
              required
              value={formData.pickup}
              onChange={handleChange}
              placeholder="e.g. Mysuru Railway Station, Bangalore Airport..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Date + Members row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                <Calendar size={12} className="text-amber-400" /> Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                <Users size={12} className="text-amber-400" /> Members <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="members"
                required
                min="1"
                max="60"
                value={formData.members}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          {/* Places to Visit */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              <MapPin size={12} className="text-amber-400" /> Places to Visit <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="placeToVisit"
              required
              value={formData.placeToVisit}
              onChange={handleChange}
              placeholder="e.g. Ooty, Coonoor, Mudumalai..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              <PhoneCall size={12} className="text-amber-400" /> Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9108597154"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              <FileText size={12} className="text-amber-400" /> Special Requirements
            </label>
            <textarea
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Any special needs? e.g. child seat, extra luggage, wheelchair access, specific pickup time..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-sm hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MessageCircle size={18} /> Book via WhatsApp
              </>
            )}
          </button>

          <p className="text-[10px] text-stone-600 text-center">
            By submitting, your details will be sent to our WhatsApp for instant booking confirmation.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page (Same as listing, but auto-opens modal for the ID) ─── */
export default function VehicleByIdPage() {
  const params = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLES[number] | null>(null);

  /* ── Auto-open modal + scroll to card on mount ── */
  useEffect(() => {
    const id = Number(params.id);
    const vehicle = VEHICLES.find((v) => v.id === id);
    if (!vehicle) return;

    // Small delay so the carousel renders first, then scroll + open modal
    const timer = setTimeout(() => {
      // Scroll the specific card into view
      const cardEl = cardRefs.current.get(id);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
      // Then open the booking modal after a brief scroll
      setTimeout(() => {
        setSelectedVehicle(vehicle);
      }, 500);
    }, 300);

    return () => clearTimeout(timer);
  }, [params.id]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  /* ── Highlight border for the active vehicle ── */
  const activeId = Number(params.id);

  return (
    <>
      {/* ─────────── NAVIGATION ─────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="RRM Holidays" className="h-9 w-auto rounded-lg object-contain" />
            <span className="text-lg font-bold tracking-tight text-stone-100">
              RRM <span className="text-amber-400">Holidays</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors">Home</Link>
            <Link href="/#destinations" className="text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors">Destinations</Link>
            <Link href="/vehicles" className="text-sm font-medium text-amber-400 transition-colors">Vehicles</Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+919108597154" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-stone-200 text-sm font-medium hover:bg-white/5 transition-all">
              <Phone size={14} /> Call Us
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20want%20to%20book%20a%20vehicle.`}
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
      <section className="relative pt-28 pb-6 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl animate-morph" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-stone-500 hover:text-stone-300 transition-colors">Home</Link>
            <span className="text-stone-700">/</span>
            <Link href="/vehicles" className="text-stone-500 hover:text-stone-300 transition-colors">Vehicles</Link>
            <span className="text-stone-700">/</span>
            <span className="text-stone-300">{VEHICLES.find((v) => v.id === activeId)?.model || 'Vehicle'}</span>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-stone-300 mb-6">
              <Car size={14} className="text-amber-400" />
              Our Complete Fleet — {VEHICLES.length} Vehicles
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Choose Your Perfect{' '}
              <span className="text-gradient-warm">Ride</span>
            </h1>
            <p className="text-stone-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Browse our fleet, click any vehicle to book instantly. Transparent per-km pricing with no hidden charges.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── HORIZONTAL VEHICLE CAROUSEL ─────────── */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Carousel container */}
          <div className="relative group/carousel">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-neutral-900/90 border border-white/10 text-stone-300 hover:text-white hover:border-amber-500/40 hover:bg-neutral-800 transition-all shadow-xl hidden md:flex opacity-0 group-hover/carousel:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-neutral-900/90 border border-white/10 text-stone-300 hover:text-white hover:border-amber-500/40 hover:bg-neutral-800 transition-all shadow-xl hidden md:flex opacity-0 group-hover/carousel:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>

            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none hidden md:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none hidden md:block" />

            {/* Scrollable track */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-2 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {VEHICLES.map((vehicle) => {
                const isActive = vehicle.id === activeId;
                return (
                  <div
                    key={vehicle.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(vehicle.id, el);
                    }}
                    className="snap-start flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] cursor-pointer group"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div
                      className={`relative rounded-2xl overflow-hidden bg-neutral-900/80 transition-all duration-300 hover-lift ${
                        isActive
                          ? 'border-2 border-amber-500/60 shadow-lg shadow-amber-500/10'
                          : 'border border-white/5 group-hover:border-amber-500/30'
                      }`}
                    >
                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="absolute top-3 right-3 z-10 h-3 w-3 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50" />
                      )}

                      {/* Vehicle Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={vehicle.img}
                          alt={vehicle.model}
                          fill
                          className={`object-cover transition-transform duration-500 ${isActive ? 'scale-100' : 'group-hover:scale-105'}`}
                          sizes="(max-width:640px) 300px, (max-width:768px) 340px, 380px"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badge */}
                        {vehicle.badge && (
                          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${vehicle.badgeColor}`}>
                            {vehicle.badge}
                          </span>
                        )}

                        {/* Click hint */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                            <MessageCircle size={14} className="text-white" />
                          </div>
                        </div>

                        {/* Bottom info overlay */}
                        <div className="absolute bottom-3 left-4 right-4">
                          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">{vehicle.type}</span>
                          <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{vehicle.model}</h3>
                        </div>
                      </div>

                      {/* Card footer */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-stone-400">
                            <Users size={12} className="text-amber-400" /> {vehicle.seats}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-stone-400">
                            <IndianRupee size={12} className="text-amber-400" /> {vehicle.pricePerKm}/km
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
                          {isActive ? 'Selected' : 'Book Now'}
                          <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll hint for mobile */}
          <div className="flex items-center justify-center gap-2 mt-5 md:hidden">
            <div className="h-1 w-8 rounded-full bg-amber-500/40" />
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-[10px] text-stone-600 ml-2">Swipe to explore →</span>
          </div>

          {/* Vehicle count pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Sedan', 'MUV', 'Tempo Traveller', 'Mini Bus', 'Bus'].map((type) => {
              const count = VEHICLES.filter((v) => v.type.includes(type)).length;
              return (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] text-stone-500"
                >
                  {count} {type}{count !== 1 ? 's' : ''}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── QUICK PRICING TABLE ─────────── */}
      <section className="relative py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-stone-200 mb-2">
              Transparent <span className="text-gradient-warm">Per-Km Pricing</span>
            </h2>
            <p className="text-sm text-stone-500">No hidden charges. What you see is what you pay.</p>
          </div>

          <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 px-4 md:px-6 py-3 bg-white/5 border-b border-white/10">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Vehicle</span>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center">Type</span>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center">Seats</span>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-right">Per Km</span>
            </div>
            {/* Table rows */}
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`grid grid-cols-4 gap-2 px-4 md:px-6 py-3 border-b border-white/5 hover:bg-white/5 transition-colors w-full text-left group/row ${
                  v.id === activeId ? 'bg-amber-500/5 border-l-2 border-l-amber-500' : ''
                }`}
              >
                <span className={`text-sm font-medium truncate transition-colors ${v.id === activeId ? 'text-amber-400' : 'text-stone-300 group-hover/row:text-amber-400'}`}>
                  {v.model}
                </span>
                <span className="text-xs text-stone-500 text-center self-center">{v.type}</span>
                <span className="text-xs text-stone-500 text-center self-center">{v.seats}</span>
                <span className="text-sm font-bold text-amber-400 text-right self-center">{v.pricePerKm}</span>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-stone-600 text-center mt-4">
            * Prices are per kilometre. Minimum km charges apply. Driver allowance, toll &amp; parking extra as applicable.
          </p>
        </div>
      </section>

      {/* ─────────── WHY RRM FLEET ─────────── */}
      <section className="relative py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-200 mb-3">
              Why Travel With <span className="text-gradient-warm">RRM Holidays</span>?
            </h2>
            <p className="text-sm text-stone-500 max-w-xl mx-auto">
              Every vehicle comes with professional drivers, comprehensive insurance, and 24/7 support.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'Fully Insured', desc: 'Comprehensive vehicle and passenger insurance for every trip' },
              { icon: Users, title: 'Expert Drivers', desc: 'Professional driver-guides who know every route in South India' },
              { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock assistance via WhatsApp and phone' },
              { icon: Star, title: 'Well Maintained', desc: 'Regularly serviced vehicles with AC, music, and clean interiors' },
            ].map((item) => (
              <div key={item.title} className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 text-center hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={20} className="text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-stone-200 mb-1">{item.title}</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="relative pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold text-stone-200 mb-2">Can&apos;t Decide? Talk to Us!</h3>
            <p className="text-sm text-stone-400 mb-6 max-w-lg mx-auto">
              Our travel experts in Mysuru are available 24/7 to help you pick the perfect vehicle for your trip.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20need%20help%20choosing%20a%20vehicle%20for%20my%20trip.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>
              <a
                href="tel:+919108597154"
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-stone-200 font-bold text-base hover:bg-white/10 transition-all"
              >
                <Phone size={20} className="text-amber-400" /> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer />

      {/* ─────────── BOOKING MODAL ─────────── */}
      {selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </>
  );
}