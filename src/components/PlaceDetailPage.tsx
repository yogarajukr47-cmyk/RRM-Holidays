'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, MessageCircle, ArrowLeft, ArrowRight, Calendar, Clock, Star, Sparkles, ChevronLeft, ChevronUp, ChevronRight, Users, Shield, X, Car, IndianRupee, User, PhoneCall, FileText } from 'lucide-react';
import { StateData, Place } from '@/lib/places-data';

const WHATSAPP_NUMBER = '919108597154';
const CALL_NUMBER = '+919108597154';

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

const ACCENT_COLORS: Record<string, { bg: string; border: string; text: string; gradient: string; lightBg: string; hoverBorder: string }> = {
  amber:  { bg: 'bg-amber-500', border: 'border-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-500 to-amber-600', lightBg: 'bg-amber-900/20', hoverBorder: 'hover:border-amber-500/30' },
  cyan:   { bg: 'bg-cyan-500', border: 'border-cyan-500/20', text: 'text-cyan-400', gradient: 'from-cyan-500 to-cyan-600', lightBg: 'bg-cyan-900/20', hoverBorder: 'hover:border-cyan-500/30' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-900/20', hoverBorder: 'hover:border-purple-500/30' },
  orange: { bg: 'bg-orange-500', border: 'border-orange-500/20', text: 'text-orange-400', gradient: 'from-orange-500 to-orange-600', lightBg: 'bg-orange-900/20', hoverBorder: 'hover:border-orange-500/30' },
  pink:   { bg: 'bg-pink-500', border: 'border-pink-500/20', text: 'text-pink-400', gradient: 'from-pink-500 to-pink-600', lightBg: 'bg-pink-900/20', hoverBorder: 'hover:border-pink-500/30' },
};

/* ─── Booking Modal ─── */
function BookingModal({ vehicle, placeName, onClose }: { vehicle: typeof VEHICLES[number]; placeName: string; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '', pickup: '', date: '', placeToVisit: placeName, members: '', phone: '', requirements: '',
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
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      setSending(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 transition-all"><X size={16} /></button>
        <div className="relative h-48 overflow-hidden rounded-t-3xl">
          <Image src={vehicle.img} alt={vehicle.model} fill className="object-cover" sizes="512px" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          {vehicle.badge && <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${vehicle.badgeColor}`}>{vehicle.badge}</span>}
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">{vehicle.type}</span>
            <h3 className="text-xl font-bold text-white">{vehicle.model}</h3>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-stone-300"><Users size={12} className="text-amber-400" /> {vehicle.seats}</span>
              <span className="flex items-center gap-1 text-xs text-stone-300"><IndianRupee size={12} className="text-amber-400" /> {vehicle.pricePerKm}/km</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
          <p className="text-xs text-stone-500 text-center -mt-1 mb-2">Fill in your trip details — we&apos;ll get back instantly via WhatsApp</p>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5"><User size={12} className="text-amber-400" /> Your Name <span className="text-red-400">*</span></label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5"><MapPin size={12} className="text-amber-400" /> Pickup Address <span className="text-red-400">*</span></label>
            <input type="text" name="pickup" required value={formData.pickup} onChange={handleChange} placeholder="e.g. Mysuru Railway Station, Bangalore Airport..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5"><Calendar size={12} className="text-amber-400" /> Date <span className="text-red-400">*</span></label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all [color-scheme:dark]" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5"><Users size={12} className="text-amber-400" /> Members <span className="text-red-400">*</span></label>
              <input type="number" name="members" required min="1" max="60" value={formData.members} onChange={handleChange} placeholder="e.g. 5" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5"><MapPin size={12} className="text-amber-400" /> Places to Visit <span className="text-red-400">*</span></label>
            <input type="text" name="placeToVisit" required value={formData.placeToVisit} onChange={handleChange} placeholder="e.g. Ooty, Coonoor, Mudumalai..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5"><PhoneCall size={12} className="text-amber-400" /> Phone Number <span className="text-red-400">*</span></label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="e.g. 9108597154" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5"><FileText size={12} className="text-amber-400" /> Special Requirements</label>
            <textarea name="requirements" rows={3} value={formData.requirements} onChange={handleChange} placeholder="Any special needs? e.g. child seat, extra luggage, wheelchair access..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none" />
          </div>
          <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-sm hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
            {sending ? (<><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>) : (<><MessageCircle size={18} /> Book via WhatsApp</>)}
          </button>
          <p className="text-[10px] text-stone-600 text-center">By submitting, your details will be sent to our WhatsApp for instant booking confirmation.</p>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function PlaceDetailPage({ state, place, prevPlace, nextPlace }: { state: StateData; place: Place; prevPlace: Place | null; nextPlace: Place | null }) {
  const colors = ACCENT_COLORS[state.accentColor] || ACCENT_COLORS.amber;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLES[number] | null>(null);

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi RRM Holidays! I'm interested in visiting ${place.name}, ${state.name}. Please share travel packages, vehicle options, and pricing details.`)}`;
  const callLink = `tel:${CALL_NUMBER}`;

  const currentIndex = state.places.findIndex(p => p.slug === place.slug);
  const nearbyPlaces = state.places.filter((_, i) => i !== currentIndex).sort(() => Math.random() - 0.5).slice(0, 3);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  }, []);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rrmholidays.com" },
      { "@type": "ListItem", "position": 2, "name": "Destinations", "item": "https://rrmholidays.com/destinations" },
      { "@type": "ListItem", "position": 3, "name": state.name, "item": `https://rrmholidays.com/destinations/${state.slug}` },
      { "@type": "ListItem", "position": 4, "name": place.name, "item": `https://rrmholidays.com/destinations/${state.slug}/${place.slug}` },
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/destinations/${state.slug}`} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-200 transition-colors"><ChevronLeft size={18} /><span className="hidden sm:inline">{state.name}</span></Link>
            <span className="text-stone-600">|</span>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-xs">R</div>
              <span className="text-sm font-bold text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href={`/destinations/${state.slug}`} className={`text-sm font-medium ${colors.text} transition-colors flex items-center gap-1`}><MapPin size={14} /> {state.name} Places</Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi RRM Holidays! I want to plan a trip to ${state.name}. Please share details.`)}`} target="_blank" className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">Plan My Trip</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <Image src={state.coverImg} alt={state.name} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 ${colors.bg}/5 rounded-full blur-3xl animate-float`} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full pt-28 pb-10">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link><span>/</span>
            <Link href="/destinations" className="hover:text-stone-300 transition-colors">Destinations</Link><span>/</span>
            <Link href={`/destinations/${state.slug}`} className={`hover:text-stone-300 transition-colors ${colors.text}`}>{state.name}</Link><span>/</span>
            <span className="text-stone-300">{place.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            {place.img && (<div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shadow-lg"><Image src={place.img} alt={place.name} width={56} height={56} className="object-cover" /></div>)}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${colors.text} ${colors.lightBg} border ${colors.border} uppercase tracking-wider mb-1`}>{place.category}</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">{place.name}</h1>
            </div>
          </div>
          <p className="text-stone-300 text-sm flex items-center gap-1 mb-2"><MapPin size={14} /> {state.name}, India</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5"><Calendar size={14} className={colors.text} /><span className="text-xs text-stone-300">Best Time: <strong className="text-white">{place.bestTime}</strong></span></div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5"><Clock size={14} className={colors.text} /><span className="text-xs text-stone-300">Duration: <strong className="text-white">{place.duration}</strong></span></div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-500 transition-all"><MessageCircle size={18} /> WhatsApp Enquiry</a>
            <a href={callLink} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"><Phone size={18} /> Call +91 91085 97154</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-stone-100 mb-4 flex items-center gap-2"><Sparkles size={20} className={colors.text} /> About {place.name}</h2>
                <p className="text-stone-400 leading-relaxed text-base mb-6">{place.desc}</p>
                <h3 className="text-lg font-bold text-stone-200 mb-3 flex items-center gap-2"><Star size={18} className={colors.text} /> Top Attractions & Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {place.highlights.map((h, i) => (
                    <div key={h} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                      <span className={`w-8 h-8 rounded-lg ${colors.lightBg} flex items-center justify-center text-sm font-bold ${colors.text}`}>{i + 1}</span>
                      <span className="text-sm text-stone-300 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
                <div className={`rounded-2xl p-6 border ${colors.border} ${colors.lightBg} text-center`}>
                  <h3 className="text-xl font-bold text-stone-100 mb-2">Want to Visit {place.name}?</h3>
                  <p className="text-stone-400 text-sm mb-4">Book your {place.name} trip with RRM Holidays. Choose from our fleet of vehicles — sedans, SUVs, tempo travellers, and buses.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={16} /> Chat on WhatsApp</a>
                    <a href={callLink} className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"><Phone size={16} /> Call +91 91085 97154</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 sticky top-20">
                <h3 className="text-lg font-bold text-stone-100 mb-4">Quick Enquiry</h3>
                <p className="text-sm text-stone-400 mb-4">Get instant response on WhatsApp or call us directly.</p>
                <div className="space-y-3">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2"><MessageCircle size={18} /> WhatsApp Us</a>
                  <a href={callLink} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"><Phone size={18} /> +91 91085 97154</a>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <h4 className="text-sm font-semibold text-stone-300 mb-2">Our Fleet for {place.name}</h4>
                  <div className="space-y-2 text-xs text-stone-400">
                    <div className="flex justify-between p-2 rounded-lg bg-white/[0.03]"><span>Etios / Dzire</span><span className="text-amber-400 font-semibold">₹12/km</span></div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/[0.03]"><span>Innova</span><span className="text-amber-400 font-semibold">₹18/km</span></div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/[0.03]"><span>Innova Crysta</span><span className="text-amber-400 font-semibold">₹20/km</span></div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/[0.03]"><span>Tempo Traveller</span><span className="text-amber-400 font-semibold">₹22/km</span></div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/[0.03]"><span>Mini Bus (21)</span><span className="text-amber-400 font-semibold">₹32/km</span></div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/[0.03]"><span>Bus (25/33/50)</span><span className="text-amber-400 font-semibold">₹36-52/km</span></div>
                  </div>
                  <a href="#vehicle-section" className="mt-3 block text-center text-xs font-semibold text-amber-400 hover:underline">Book any vehicle ↓</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VEHICLE BOOKING BLOCK ═══════════ */}
      <section id="vehicle-section" className="relative py-16 border-t border-white/5">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400 mb-6"><Car size={14} /> Book a Vehicle for {place.name}</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-4">Choose Your Perfect <span className="text-gradient-warm">Ride</span></h2>
            <p className="text-stone-400 max-w-2xl mx-auto">Select a vehicle below to book your {place.name} trip. &quot;Places to Visit&quot; will be auto-filled for you.</p>
          </div>

          {/* Carousel */}
          <div className="relative group/carousel mb-10">
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-neutral-900/90 border border-white/10 text-stone-300 hover:text-white hover:border-amber-500/40 hover:bg-neutral-800 transition-all shadow-xl hidden md:flex opacity-0 group-hover/carousel:opacity-100" aria-label="Scroll left"><ChevronLeft size={20} /></button>
            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-neutral-900/90 border border-white/10 text-stone-300 hover:text-white hover:border-amber-500/40 hover:bg-neutral-800 transition-all shadow-xl hidden md:flex opacity-0 group-hover/carousel:opacity-100" aria-label="Scroll right"><ChevronRight size={20} /></button>
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none hidden md:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none hidden md:block" />
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-2 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {VEHICLES.map((vehicle) => (
                <div key={vehicle.id} className="snap-start flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] cursor-pointer group" onClick={() => setSelectedVehicle(vehicle)}>
                  <div className="relative rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 group-hover:border-amber-500/30 transition-all duration-300 hover-lift">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={vehicle.img} alt={vehicle.model} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 300px, (max-width:768px) 340px, 380px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {vehicle.badge && <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${vehicle.badgeColor}`}>{vehicle.badge}</span>}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20"><MessageCircle size={14} className="text-white" /></div>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">{vehicle.type}</span>
                        <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{vehicle.model}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-stone-400"><Users size={12} className="text-amber-400" /> {vehicle.seats}</span>
                        <span className="flex items-center gap-1 text-xs text-stone-400"><IndianRupee size={12} className="text-amber-400" /> {vehicle.pricePerKm}/km</span>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">Book Now <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 md:hidden">
            <div className="h-1 w-8 rounded-full bg-amber-500/40" /><div className="h-1 w-1 rounded-full bg-white/20" /><div className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-[10px] text-stone-600 ml-2">Swipe to explore →</span>
          </div>

          {/* Pricing Table */}
          <div className="mt-10">
            <h3 className="text-xl md:text-2xl font-extrabold text-stone-200 mb-2 text-center">Transparent <span className="text-gradient-warm">Per-Km Pricing</span></h3>
            <p className="text-sm text-stone-500 text-center mb-6">No hidden charges. What you see is what you pay.</p>
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-4 gap-2 px-4 md:px-6 py-3 bg-white/5 border-b border-white/10">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Vehicle</span>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center">Type</span>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center">Seats</span>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-right">Per Km</span>
              </div>
              {VEHICLES.map((v) => (
                <button key={v.id} onClick={() => setSelectedVehicle(v)} className="grid grid-cols-4 gap-2 px-4 md:px-6 py-3 border-b border-white/5 hover:bg-white/5 transition-colors w-full text-left group/row">
                  <span className="text-sm font-medium truncate text-stone-300 group-hover/row:text-amber-400 transition-colors">{v.model}</span>
                  <span className="text-xs text-stone-500 text-center self-center">{v.type}</span>
                  <span className="text-xs text-stone-500 text-center self-center">{v.seats}</span>
                  <span className="text-sm font-bold text-amber-400 text-right self-center">{v.pricePerKm}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-600 text-center mt-4">* Prices are per kilometre. Minimum km charges apply. Driver allowance, toll &amp; parking extra as applicable.</p>
          </div>

          {/* Why RRM */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { icon: Shield, title: 'Fully Insured', desc: 'Comprehensive vehicle and passenger insurance' },
              { icon: Users, title: 'Expert Drivers', desc: 'Professional driver-guides who know every route' },
              { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock WhatsApp and phone support' },
              { icon: Star, title: 'Well Maintained', desc: 'Regularly serviced with AC, music, clean interiors' },
            ].map((item) => (
              <div key={item.title} className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 text-center hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3"><item.icon size={20} className="text-amber-400" /></div>
                <h3 className="text-sm font-bold text-stone-200 mb-1">{item.title}</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Places */}
      {nearbyPlaces.length > 0 && (
        <section className="py-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-stone-100 mb-6">More Places to Visit in {state.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {nearbyPlaces.map(np => (
                <Link key={np.slug} href={`/destinations/${state.slug}/${np.slug}`} className="group rounded-xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift">
                  <div className="relative aspect-[16/8] overflow-hidden">
                    <Image src={np.img || '/states/default-cover.jpg'} alt={np.name} fill className="object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3">
                      <span className={`text-[10px] font-bold ${colors.text} uppercase tracking-wider`}>{np.category}</span>
                      <h4 className="text-sm font-bold text-white">{np.name}</h4>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-stone-500 line-clamp-2">{np.desc}</p>
                    <span className={`text-xs font-semibold ${colors.text} group-hover:underline mt-1 inline-block`}>View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Previous / Next */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPlace && (
              <Link href={`/destinations/${state.slug}/${prevPlace.slug}`} className={`group flex items-center gap-4 p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all ${colors.hoverBorder}`}>
                <ArrowLeft size={20} className="text-stone-500 group-hover:text-stone-300 transition-colors" />
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Previous Place</span>
                  <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                    {prevPlace.img ? (<span className="w-6 h-6 rounded overflow-hidden inline-block"><Image src={prevPlace.img} alt={prevPlace.name} width={24} height={24} className="object-cover" /></span>) : null}
                    {prevPlace.name}
                  </h4>
                </div>
              </Link>
            )}
            {nextPlace && (
              <Link href={`/destinations/${state.slug}/${nextPlace.slug}`} className={`group flex items-center justify-end gap-4 p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all text-right ${colors.hoverBorder}`}>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Next Place</span>
                  <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2 justify-end">
                    {nextPlace.name}
                    {nextPlace.img ? (<span className="w-6 h-6 rounded overflow-hidden inline-block"><Image src={nextPlace.img} alt={nextPlace.name} width={24} height={24} className="object-cover" /></span>) : null}
                  </h4>
                </div>
                <ArrowRight size={20} className="text-stone-500 group-hover:text-stone-300 transition-colors" />
              </Link>
            )}
          </div>
          <div className="text-center mt-6">
            <Link href={`/destinations/${state.slug}`} className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${colors.border} text-sm font-semibold ${colors.text} hover:bg-white/5 transition-all`}><ChevronLeft size={16} /> View All {state.name} Places</Link>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi RRM Holidays! I need help planning my ${place.name} trip.`)}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:bg-green-400 transition-all whatsapp-float"><MessageCircle size={26} className="text-white" /></a>
      <Link href="#" className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:border-amber-500/30 transition-all"><ChevronUp size={18} className="text-stone-300" /></Link>

      {/* Booking Modal */}
      {selectedVehicle && (
        <BookingModal vehicle={selectedVehicle} placeName={place.name} onClose={() => setSelectedVehicle(null)} />
      )}
    </div>
  );
}