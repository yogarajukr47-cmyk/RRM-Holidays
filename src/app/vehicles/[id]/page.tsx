'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Users,
  Shield,
  Clock,
  MapPin,
  Star,
  Check,
  IndianRupee,
  Calendar,
  Navigation,
  Music,
} from 'lucide-react';

/* ─── Vehicle Data ─── */
const VEHICLE_DATA: Record<number, {
  id: number; type: string; model: string; img: string; seats: string;
  pricePerKm: string; badge: string | null; badgeColor: string;
  features: string[]; desc: string; ac: string; luggage: string;
  music: string; transmission: string;
}> = {
  1: { id: 1, type: 'Sedan', model: 'Toyota Etios', img: '/sedan-etios.jpg', seats: '4 Seaters', badge: null, badgeColor: '', features: ['AC', 'Music System', 'Comfortable Seats', 'Boot Space'], desc: 'Perfect for small family trips and city tours', ac: 'Full AC', luggage: '2 large suitcases + 2 small bags', music: 'FM/USB/Bluetooth', transmission: 'Automatic' },
  2: { id: 2, type: 'Sedan', model: 'Maruti Swift Dzire', img: '/swift-dzire.jpg', seats: '4 Seaters', badge: 'Popular', badgeColor: 'bg-amber-500', features: ['AC', 'Music System', 'Comfortable Seats', 'Fuel Efficient'], desc: 'Compact sedan ideal for city rides and short trips', ac: 'Full AC', luggage: '1 large suitcase + 2 small bags', music: 'FM/USB/Bluetooth', transmission: 'Automatic' },
  3: { id: 3, type: 'MUV', model: 'Toyota Innova', img: '/innova-muv.jpg', seats: '7 Seaters', pricePerKm: '₹18', badge: null, badgeColor: '', features: ['Spacious', 'AC', 'Music System', 'Luggage Space'], desc: 'Ideal for family vacations and group travel', ac: 'Dual Zone AC', luggage: '4 large suitcases + hand luggage', music: 'FM/USB/DVD', transmission: 'Automatic' },
  4: { id: 4, type: 'Premium MUV', model: 'Innova Crysta', img: '/innova-crysta.jpg', seats: '7 Seaters', badge: 'Premium', badgeColor: 'bg-violet-500', features: ['Premium AC', 'Luxury Seats', 'Entertainment System', 'Captain Seats'], desc: 'Premium comfort for luxury travel experiences', ac: 'Rear AC + Captain Seat AC', luggage: '4 large suitcases + hand luggage', music: 'Touchscreen + FM/USB/DVD', transmission: 'Automatic' },
  5: { id: 5, type: 'Tempo Traveller', model: 'Force Tempo Traveller', img: '/tempo-traveller.jpg', seats: '12 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Best for medium groups, corporate trips and family outings', ac: 'Powerful AC', luggage: 'Overhead + rear cabin', music: 'FM/USB', transmission: 'Manual' },
  6: { id: 6, type: 'Mini Bus', model: '21 Seater Mini Bus', img: '/mini-bus.jpg', seats: '21 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'Best for large groups, weddings and corporate events', ac: 'Rear + Overhead AC', luggage: 'Separate boot + cabin area', music: 'PA System + USB', transmission: 'Manual' },
  7: { id: 7, type: 'Bus', model: '25 Seater Bus', img: '/bus-25seater.jpg', seats: '25 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'PA System'], desc: 'Ideal for large groups, school trips and corporate outings', ac: 'Full AC', luggage: 'Under-seat + separate hold', music: 'PA System + USB', transmission: 'Manual' },
  8: { id: 8, type: 'Bus', model: '33 Seater Bus', img: '/bus-33seater.jpg', seats: '33 Seaters', badge: null, badgeColor: '', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System'], desc: 'Spacious bus for pilgrimage tours and large group travel', ac: 'Full AC', luggage: 'Under-seat + separate hold', music: 'PA System + Entertainment', transmission: 'Manual' },
  9: { id: 9, type: 'Luxury Bus', model: '50 Seater Luxury Coach', img: '/bus-50seater.jpg', seats: '50 Seaters', badge: 'Luxury', badgeColor: 'bg-cyan-500', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System', 'WiFi'], desc: 'Luxury Volvo coach for very large groups, pilgrimages & tours', ac: 'Dual Zone AC', luggage: 'Large under-belly + overhead', music: 'PA System + WiFi + TV', transmission: 'Automatic' },
  10: { id: 10, type: 'Tempo Traveller', model: 'Force Urbania 10 Seater', img: '/urbania-10.jpg', seats: '10 Seaters', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Compact yet spacious 10-seater Force Urbania, perfect for medium-sized groups exploring South India. Modern design, powerful AC, and superior ride comfort compared to older tempo travellers.', ac: 'Powerful AC', luggage: 'Rear cabin + overhead', music: 'FM/USB/Bluetooth', transmission: 'Manual' },
  11: { id: 11, type: 'Tempo Traveller', model: 'Force Urbania 13 Seater', img: '/urbania-13.jpg', seats: '13 Seaters', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'The versatile 13-seater Force Urbania is a crowd favourite for family trips, temple tours, and weekend getaways. Spacious interiors with pushback reclining seats and individual AC vents.', ac: 'Rear + Overhead AC', luggage: 'Rear cabin + overhead', music: 'FM/USB/Bluetooth', transmission: 'Manual' },
  12: { id: 12, type: 'Tempo Traveller', model: 'Force Urbania 16 Seater', img: '/urbania-16.jpg', seats: '16 Seaters',badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Extra Luggage'], desc: 'The largest Force Urbania variant with 16 comfortable pushback seats. Ideal for extended family trips, corporate outings, and large group tours requiring modern comfort and reliable performance.', ac: 'Rear + Overhead AC', luggage: 'Separate boot + cabin', music: 'FM/USB/Bluetooth', transmission: 'Manual' },
};

const WHATSAPP_NUMBER = '919108597154';

/* ─── Component ─── */
export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = Number(params.id);
  const vehicle = VEHICLE_DATA[vehicleId];

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-200 mb-4">Vehicle Not Found</h1>
          <p className="text-stone-500 mb-8">The vehicle you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/#vehicles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <ArrowLeft size={16} /> Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!pickupLocation || !dropLocation || !travelDate) {
      alert('Please fill in pickup location, drop location and travel date.');
      return;
    }
    const msg = `🚗 *Vehicle Booking — RRM Holidays*

${vehicle.badge ? `🏷️ *Vehicle Type:* ${vehicle.type}` : `🚙 *Vehicle:* ${vehicle.model}`}

📍 *Pickup:* ${pickupLocation}
📍 *Drop:* ${dropLocation}
📅 *Date:* ${travelDate}
👥 *Seating:* ${vehicle.seats}
💰 *Rate:* ${vehicle.pricePerKm}/km (custom quotation available)

${contactName ? `👤 *Name:* ${contactName}` : ''}
${contactPhone ? `📱 *Phone:* ${contactPhone}` : ''}
${notes ? `📝 *Notes:* ${notes}` : ''}

Please share a custom quotation for my trip. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

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
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+919108597154" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-stone-200 text-sm font-medium hover:bg-white/5 transition-all">
              <Phone size={14} /> Call Us
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20want%20to%20book%20a%20${encodeURIComponent(vehicle.model)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <MessageCircle size={14} /> Book Now
            </a>
          </div>
        </div>
      </nav>

      {/* ─────────── VEHICLE HERO ─────────── */}
      <section className="relative pt-28 pb-8 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-stone-500 hover:text-stone-300 transition-colors">Home</Link>
            <span className="text-stone-700">/</span>
            <Link href="/#vehicles" className="text-stone-500 hover:text-stone-300 transition-colors">Vehicles</Link>
            <span className="text-stone-700">/</span>
            <span className="text-stone-300">{vehicle.model}</span>
          </div>

          {/* Vehicle Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-w-3xl mx-auto">
            <Image src={vehicle.img} alt={vehicle.model} fill className="object-cover object-center" sizes="(max-width:1024px) 100vw, 50vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {vehicle.badge && (
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${vehicle.badgeColor}`}>
                {vehicle.badge}
              </span>
            )}
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">{vehicle.type}</span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mt-1">{vehicle.model}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── VEHICLE INFO + BOOKING FORM ─────────── */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT: Vehicle Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 text-center">
                <p className="text-xs text-amber-300/80 uppercase tracking-wider mb-2 font-semibold">Rate Per Kilometre</p>
                <p className="text-4xl font-extrabold text-amber-400 flex items-center justify-center gap-2">
                  <IndianRupee size={32} />
                  {vehicle.pricePerKm}
                </p>
                <p className="text-xs text-stone-500 mt-2">Custom quotation available for long trips & tours</p>
              </div>

              {/* Features */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-amber-400" /> Vehicle Features
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Users, label: 'Seating Capacity', value: vehicle.seats },
                    { icon: Star, label: 'Air Conditioning', value: vehicle.ac },
                    { icon: Navigation, label: 'Transmission', value: vehicle.transmission },
                    { icon: Music, label: 'Music System', value: vehicle.music },
                    { icon: Shield, label: 'Luggage Space', value: vehicle.luggage },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={14} className="text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-medium text-stone-200">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
                  <Check size={18} className="text-green-400" /> Why Choose This Vehicle?
                </h3>
                <ul className="space-y-2">
                  {vehicle.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-400">
                      <Check size={14} className="text-green-400 shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-stone-500 mt-4 leading-relaxed">{vehicle.desc}</p>
              </div>
            </div>

            {/* RIGHT: Booking Form */}
            <div className="lg:col-span-3">
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 sticky top-28">
                <h2 className="text-xl md:text-2xl font-bold text-stone-200 mb-1">Book This Vehicle</h2>
                <p className="text-sm text-stone-500 mb-6">Fill in your trip details and we&apos;ll send it to WhatsApp for a custom quotation.</p>

                <div className="space-y-4">
                  {/* Pickup Location */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                      <MapPin size={12} className="text-green-400" /> Pickup Location
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Mysuru, Bengaluru Airport..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Drop Location */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                      <MapPin size={12} className="text-blue-400" /> Drop Location
                    </label>
                    <input
                      type="text"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      placeholder="e.g. Coorg, Goa, Ooty..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Travel Date */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                      <Calendar size={12} className="text-amber-400" /> Travel Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                      👤 Your Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                      <Phone size={12} className="text-amber-400" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 9XXXX XXXXX"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                      📝 Special Requests (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements..."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 hover:border-white/20 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleBooking}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-600/20"
                  >
                    <MessageCircle size={20} />
                    Send Booking to WhatsApp
                  </button>

                  {/* Additional Info */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Clock size={12} />
                      <span>For instant reply, message us on WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Phone size={12} />
                      <span>Or call: <a href="tel:+919108597154" className="text-amber-400 hover:text-amber-300 font-medium">+91 91085 97154</a></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Star size={12} />
                      <span>Experienced driver-guide included with every booking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="relative pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold text-st-200 mb-2">Need Help Choosing a Vehicle?</h3>
            <p className="text-sm text-stone-500 mb-6">
              Our travel experts in Mysuru are available 24/7 to help you pick the perfect vehicle for your trip based on group size, budget, and route.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20need%20help%20choosing%20a%20vehicle%20for%20my%20trip."
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
      <footer className="relative border-t border-white/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="RRM Holidays" className="h-8 w-auto rounded-lg object-contain" />
              <span className="text-lg font-bold text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
            </Link>
            <p className="text-xs text-stone-600">&copy; {new Date().getFullYear()} RRM Holidays. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-400 transition-colors text-xs">WhatsApp</a>
              <a href="https://www.instagram.com/__yogaraju__?igsh=cnNkYWIycTM2MzQ4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-400 transition-colors text-xs">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
