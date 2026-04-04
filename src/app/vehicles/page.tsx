'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Users,
  Shield,
  Clock,
  Star,
  Check,
  IndianRupee,
  Navigation,
  Music,
  Car,
  Search,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

/* ─── Vehicle Data ─── */
const VEHICLES = [
  { id: 1, type: 'Sedan', model: 'Toyota Etios', img: '/sedan-etios.jpg', seats: '4 Seaters', pricePerKm: '₹14', badge: null, badgeColor: '', features: ['AC', 'Music System', 'Comfortable Seats', 'Boot Space'], desc: 'Perfect for small family trips and city tours. Spacious boot, comfortable interiors, and smooth highway performance make it an ideal companion for short getaways and business travel.', ac: 'Full AC', luggage: '2 large suitcases + 2 small bags', music: 'FM/USB/Bluetooth', transmission: 'Automatic' },
  { id: 2, type: 'Sedan', model: 'Maruti Swift Dzire', img: '/swift-dzire.jpg', seats: '4 Seaters', pricePerKm: '₹13', badge: 'Popular', badgeColor: 'bg-amber-500', features: ['AC', 'Music System', 'Comfortable Seats', 'Fuel Efficient'], desc: 'Compact sedan ideal for city rides and short trips. Known for exceptional fuel efficiency and reliable performance on both city roads and highways across South India.', ac: 'Full AC', luggage: '1 large suitcase + 2 small bags', music: 'FM/USB/Bluetooth', transmission: 'Automatic' },
  { id: 3, type: 'MUV', model: 'Toyota Innova', img: '/innova-muv.jpg', seats: '7 Seaters', pricePerKm: '₹18', badge: null, badgeColor: '', features: ['Spacious', 'AC', 'Music System', 'Luggage Space'], desc: 'Ideal for family vacations and group travel. The most trusted MUV in India with ample cabin space, powerful AC, and enough room for the entire family plus luggage.', ac: 'Dual Zone AC', luggage: '4 large suitcases + hand luggage', music: 'FM/USB/DVD', transmission: 'Automatic' },
  { id: 4, type: 'Premium MUV', model: 'Innova Crysta', img: '/innova-crysta.jpg', seats: '7 Seaters', pricePerKm: '₹22', badge: 'Premium', badgeColor: 'bg-violet-500', features: ['Premium AC', 'Luxury Seats', 'Entertainment System', 'Captain Seats'], desc: 'Premium comfort for luxury travel experiences. Captain seats with armrests, touchscreen entertainment, rear AC vents, and a smoother ride quality for discerning travellers.', ac: 'Rear AC + Captain Seat AC', luggage: '4 large suitcases + hand luggage', music: 'Touchscreen + FM/USB/DVD', transmission: 'Automatic' },
  { id: 10, type: 'Tempo Traveller', model: 'Force Urbania 10 Seater', img: '/urbania-10.jpg', seats: '10 Seaters', pricePerKm: '₹33', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Compact yet spacious 10-seater Force Urbania, perfect for medium-sized groups exploring South India. Modern design, powerful AC, and superior ride comfort compared to older tempo travellers.', ac: 'Powerful AC', luggage: 'Rear cabin + overhead', music: 'FM/USB/Bluetooth', transmission: 'Manual' },
  { id: 11, type: 'Tempo Traveller', model: 'Force Urbania 13 Seater', img: '/urbania-13.jpg', seats: '13 Seaters', pricePerKm: '₹36', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'The versatile 13-seater Force Urbania is a crowd favourite for family trips, temple tours, and weekend getaways. Spacious interiors with pushback reclining seats and individual AC vents.', ac: 'Rear + Overhead AC', luggage: 'Rear cabin + overhead', music: 'FM/USB/Bluetooth', transmission: 'Manual' },
  { id: 5, type: 'Tempo Traveller', model: 'Force Tempo Traveller 12 Seater', img: '/tempo-traveller.jpg', seats: '12 Seaters', pricePerKm: '₹25', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Best for medium groups, corporate trips and family outings. Pushback reclining seats, powerful air conditioning, and generous luggage space make it the go-to choice for groups of 8-12.', ac: 'Powerful AC', luggage: 'Overhead + rear cabin', music: 'FM/USB', transmission: 'Manual' },
  { id: 12, type: 'Tempo Traveller', model: 'Force Urbania 16 Seater', img: '/urbania-16.jpg', seats: '16 Seaters', pricePerKm: '₹39', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Extra Luggage'], desc: 'The largest Force Urbania variant with 16 comfortable pushback seats. Ideal for extended family trips, corporate outings, and large group tours requiring modern comfort and reliable performance.', ac: 'Rear + Overhead AC', luggage: 'Separate boot + cabin', music: 'FM/USB/Bluetooth', transmission: 'Manual' },
  { id: 6, type: 'Mini Bus', model: '21 Seater Mini Bus', img: '/mini-bus.jpg', seats: '21 Seaters', pricePerKm: '₹32', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'Best for large groups, weddings and corporate events. Comfortable pushback seating, individual AC vents, and a separate luggage compartment ensure a pleasant journey for every passenger.', ac: 'Rear + Overhead AC', luggage: 'Separate boot + cabin area', music: 'PA System + USB', transmission: 'Manual' },
  { id: 7, type: 'Bus', model: '25 Seater Bus', img: '/bus-25seater.jpg', seats: '25 Seaters', pricePerKm: '₹35', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'PA System'], desc: 'Ideal for large groups, school trips and corporate outings. Well-maintained pushback seats, effective air conditioning, and a public address system for guided tours and announcements.', ac: 'Full AC', luggage: 'Under-seat + separate hold', music: 'PA System + USB', transmission: 'Manual' },
  { id: 8, type: 'Bus', model: '33 Seater Bus', img: '/bus-33seater.jpg', seats: '33 Seaters', pricePerKm: '₹38', badge: null, badgeColor: '', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System'], desc: 'Spacious bus for pilgrimage tours and large group travel. Recliner seats with ample legroom, full air conditioning, and entertainment options make long-distance journeys comfortable and enjoyable.', ac: 'Full AC', luggage: 'Under-seat + separate hold', music: 'PA System + Entertainment', transmission: 'Manual' },
  { id: 9, type: 'Luxury Bus', model: '50 Seater Luxury Coach', img: '/bus-50seater.jpg', seats: '50 Seaters', pricePerKm: '₹45', badge: 'Luxury', badgeColor: 'bg-cyan-500', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System', 'WiFi'], desc: 'Luxury Volvo coach for very large groups, pilgrimages and tours. Premium recliner seats, dual-zone climate control, onboard WiFi, entertainment screens, and massive luggage capacity for extended tours.', ac: 'Dual Zone AC', luggage: 'Large under-belly + overhead', music: 'PA System + WiFi + TV', transmission: 'Automatic' },
];

const WHATSAPP_NUMBER = '919108597154';

const VEHICLE_TYPES = ['All', 'Sedan', 'MUV', 'Premium MUV', 'Tempo Traveller', 'Mini Bus', 'Bus', 'Luxury Bus'];
const SEAT_FILTERS = ['All', '4', '7', '10', '12', '13', '16', '21', '25', '33', '50'];

/* ─── Single Vehicle Card ─── */
function VehicleCard({ vehicle, index }: { vehicle: typeof VEHICLES[number]; index: number }) {
  /* Alternate: even = full-width horizontal, odd = split into 2 cols */
  const isFullWidth = index % 2 === 0;

  if (isFullWidth) {
    return (
      <div className="w-full">
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift card-shine"
        >
          {/* Left: Image */}
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
            <Image
              src={vehicle.img}
              alt={vehicle.model}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/60" />
            {vehicle.badge && (
              <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${vehicle.badgeColor}`}>
                {vehicle.badge}
              </span>
            )}
            {/* Mobile overlay info */}
            <div className="absolute bottom-3 left-4 right-4 md:hidden">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">{vehicle.type}</span>
              <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{vehicle.model}</h3>
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-5 md:p-8 flex flex-col justify-center">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest hidden md:block">{vehicle.type}</span>
            <h3 className="text-xl md:text-2xl font-bold text-stone-100 leading-tight mt-1 mb-3">{vehicle.model}</h3>
            <p className="text-sm text-stone-400 leading-relaxed mb-5 line-clamp-3">{vehicle.desc}</p>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                <Users size={16} className="text-amber-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-stone-300">{vehicle.seats}</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                <IndianRupee size={16} className="text-amber-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-stone-300">{vehicle.pricePerKm}/km</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                <Navigation size={16} className="text-amber-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-stone-300">{vehicle.transmission}</p>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-5">
              {vehicle.features.map((feat, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-[11px] text-stone-400 border border-white/5">
                  <Check size={10} className="text-green-400" /> {feat}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[11px] text-stone-600">Per-km rate shown</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  /* Compact horizontal card (single column, image left, text right — used in 2-col grid) */
  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr] gap-0 rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift card-shine"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={vehicle.img}
          alt={vehicle.model}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="220px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
        {vehicle.badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider ${vehicle.badgeColor}`}>
            {vehicle.badge}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col justify-center">
        <span className="text-[9px] font-semibold text-amber-400 uppercase tracking-widest">{vehicle.type}</span>
        <h3 className="text-sm sm:text-base font-bold text-stone-100 leading-tight mt-0.5 mb-1.5">{vehicle.model}</h3>
        <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">{vehicle.desc}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-stone-400">
            <Users size={12} className="text-amber-400" />
            <span className="text-[11px] font-medium">{vehicle.seats}</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <IndianRupee size={12} className="text-amber-400" />
            <span className="text-[11px] font-medium">{vehicle.pricePerKm}/km</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <Navigation size={12} className="text-amber-400" />
            <span className="text-[11px] font-medium">{vehicle.transmission}</span>
          </div>
        </div>

        {/* CTA */}
        <span className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
          View Details <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

/* ─── Component ─── */
export default function VehiclesPage() {
  const [activeType, setActiveType] = useState('All');
  const [activeSeats, setActiveSeats] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = VEHICLES.filter((v) => {
    const matchesType = activeType === 'All' || v.type === activeType;
    const seatNum = v.seats.replace(/\D/g, '');
    const matchesSeats = activeSeats === 'All' || seatNum === activeSeats;
    const matchesSearch = searchQuery === '' ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSeats && matchesSearch;
  });

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
      <section className="relative pt-28 pb-8 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl animate-morph" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-stone-500 hover:text-stone-300 transition-colors">Home</Link>
            <span className="text-stone-700">/</span>
            <span className="text-stone-300">Vehicles</span>
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
              From comfortable sedans to luxury coaches, we have the perfect vehicle for every trip.
              Browse our fleet and get a custom quotation via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── FILTERS ─────────── */}
      <section className="relative py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles by name or type..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                suppressHydrationWarning
              />
            </div>

            {/* Type Filters */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Vehicle Type</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeType === type
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200 border border-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Seat Filters */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Seating Capacity</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SEAT_FILTERS.map((seats) => (
                  <button
                    key={seats}
                    onClick={() => setActiveSeats(seats)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeSeats === seats
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200 border border-white/5'
                    }`}
                  >
                    {seats === 'All' ? 'All Seats' : `${seats} Seaters`}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-stone-500">
                Showing <span className="text-amber-400 font-semibold">{filteredVehicles.length}</span> vehicle{filteredVehicles.length !== 1 ? 's' : ''}
              </p>
              {(activeType !== 'All' || activeSeats !== 'All' || searchQuery !== '') && (
                <button
                  onClick={() => { setActiveType('All'); setActiveSeats('All'); setSearchQuery(''); }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── VEHICLE LIST (Alternating 1/2 layout) ─────────── */}
      <section className="relative pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredVehicles.length > 0 ? (
            <div className="space-y-6">
              {/* Group vehicles into rows: 1 card, then 2 cards, repeating */}
              {Array.from({ length: Math.ceil(filteredVehicles.length / 3) }, (_, rowIdx) => {
                const rowStart = rowIdx * 3;
                const fullVehicle = filteredVehicles[rowStart];
                const pairA = filteredVehicles[rowStart + 1];
                const pairB = filteredVehicles[rowStart + 2];
                return (
                  <React.Fragment key={rowIdx}>
                    {/* Full-width card */}
                    {fullVehicle && (
                      <div className="w-full">
                        <VehicleCard vehicle={fullVehicle} index={rowStart} />
                      </div>
                    )}
                    {/* 2-column pair */}
                    {pairA && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <VehicleCard vehicle={pairA} index={rowStart + 1} />
                        {pairB ? (
                          <VehicleCard vehicle={pairB} index={rowStart + 2} />
                        ) : (
                          <div className="hidden md:flex rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-6 flex-col items-center justify-center text-center">
                            <MessageCircle size={28} className="text-amber-400 mb-3" />
                            <h4 className="text-sm font-bold text-stone-200 mb-1">Need Help Choosing?</h4>
                            <p className="text-xs text-stone-500 mb-4">Our experts will help you pick the right vehicle</p>
                            <a
                              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20need%20help%20choosing%20a%20vehicle.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-semibold hover:from-green-500 hover:to-green-600 transition-all"
                            >
                              <MessageCircle size={12} /> Chat on WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            /* No results */
            <div className="text-center py-20">
              <Car size={48} className="text-stone-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-stone-300 mb-2">No Vehicles Found</h3>
              <p className="text-sm text-stone-500 mb-6">Try adjusting your filters or search query to find the perfect vehicle.</p>
              <button
                onClick={() => { setActiveType('All'); setActiveSeats('All'); setSearchQuery(''); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────── WHY RRM FLEET ─────────── */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-200 mb-3">
              Why Travel With <span className="text-gradient-warm">RRM Holidays</span>?
            </h2>
            <p className="text-sm text-stone-500 max-w-xl mx-auto">
              Every vehicle comes with professional drivers, comprehensive insurance, and 24/7 support throughout your journey.
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
            <h3 className="text-xl font-bold text-stone-200 mb-2">Need Help Choosing the Right Vehicle?</h3>
            <p className="text-sm text-stone-400 mb-6 max-w-lg mx-auto">
              Our travel experts in Mysuru are available 24/7 to help you pick the perfect vehicle for your trip based on group size, route, and travel preferences.
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
    </>
  );
}
