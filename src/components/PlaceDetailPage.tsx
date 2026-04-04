'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, MessageCircle, ArrowLeft, ArrowRight, Calendar, Clock, Star, Sparkles, ChevronLeft, ChevronUp } from 'lucide-react';
import { StateData, Place } from '@/lib/places-data';

const WHATSAPP_NUMBER = '919108597154';
const CALL_NUMBER = '+919108597154';

const ACCENT_COLORS: Record<string, { bg: string; border: string; text: string; gradient: string; lightBg: string; hoverBorder: string }> = {
  amber:  { bg: 'bg-amber-500', border: 'border-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-500 to-amber-600', lightBg: 'bg-amber-900/20', hoverBorder: 'hover:border-amber-500/30' },
  cyan:   { bg: 'bg-cyan-500', border: 'border-cyan-500/20', text: 'text-cyan-400', gradient: 'from-cyan-500 to-cyan-600', lightBg: 'bg-cyan-900/20', hoverBorder: 'hover:border-cyan-500/30' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-900/20', hoverBorder: 'hover:border-purple-500/30' },
  orange: { bg: 'bg-orange-500', border: 'border-orange-500/20', text: 'text-orange-400', gradient: 'from-orange-500 to-orange-600', lightBg: 'bg-orange-900/20', hoverBorder: 'hover:border-orange-500/30' },
  pink:   { bg: 'bg-pink-500', border: 'border-pink-500/20', text: 'text-pink-400', gradient: 'from-pink-500 to-pink-600', lightBg: 'bg-pink-900/20', hoverBorder: 'hover:border-pink-500/30' },
};

export default function PlaceDetailPage({ state, place, prevPlace, nextPlace }: { state: StateData; place: Place; prevPlace: Place | null; nextPlace: Place | null }) {
  const colors = ACCENT_COLORS[state.accentColor] || ACCENT_COLORS.amber;

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi RRM Holidays! I'm interested in visiting ${place.name}, ${state.name}. Please share travel packages, vehicle options, and pricing details.`)}`;
  const callLink = `tel:${CALL_NUMBER}`;

  // Find nearby places (excluding current)
  const currentIndex = state.places.findIndex(p => p.slug === place.slug);
  const nearbyPlaces = state.places.filter((_, i) => i !== currentIndex).sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/destinations/${state.slug}`} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-200 transition-colors">
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">{state.name}</span>
            </Link>
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-stone-300 transition-colors">Destinations</Link>
            <span>/</span>
            <Link href={`/destinations/${state.slug}`} className={`hover:text-stone-300 transition-colors ${colors.text}`}>{state.name}</Link>
            <span>/</span>
            <span className="text-stone-300">{place.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">{place.emoji}</span>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${colors.text} ${colors.lightBg} border ${colors.border} uppercase tracking-wider mb-1`}>{place.category}</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">{place.name}</h1>
            </div>
          </div>
          <p className="text-stone-300 text-sm flex items-center gap-1 mb-2"><MapPin size={14} /> {state.name}, India</p>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
              <Calendar size={14} className={colors.text} />
              <span className="text-xs text-stone-300">Best Time: <strong className="text-white">{place.bestTime}</strong></span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
              <Clock size={14} className={colors.text} />
              <span className="text-xs text-stone-300">Duration: <strong className="text-white">{place.duration}</strong></span>
            </div>
          </div>

          {/* Enquiry Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-500 transition-all">
              <MessageCircle size={18} /> WhatsApp Enquiry
            </a>
            <a href={callLink} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">
              <Phone size={18} /> Call +91 91085 97154
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Description */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-stone-100 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className={colors.text} /> About {place.name}
                </h2>
                <p className="text-stone-400 leading-relaxed text-base mb-6">{place.desc}</p>

                {/* Highlights Grid */}
                <h3 className="text-lg font-bold text-stone-200 mb-3 flex items-center gap-2">
                  <Star size={18} className={colors.text} /> Top Attractions & Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {place.highlights.map((h, i) => (
                    <div key={h} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                      <span className={`w-8 h-8 rounded-lg ${colors.lightBg} flex items-center justify-center text-sm font-bold ${colors.text}`}>{i + 1}</span>
                      <span className="text-sm text-stone-300 font-medium">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Big Enquiry Section */}
                <div className={`rounded-2xl p-6 border ${colors.border} ${colors.lightBg} text-center`}>
                  <h3 className="text-xl font-bold text-stone-100 mb-2">Want to Visit {place.name}?</h3>
                  <p className="text-stone-400 text-sm mb-4">Book your {place.name} trip with RRM Holidays. Choose from our fleet of vehicles — sedans, SUVs, tempo travellers, and buses.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2">
                      <MessageCircle size={16} /> Chat on WhatsApp
                    </a>
                    <a href={callLink} className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2">
                      <Phone size={16} /> Call +91 91085 97154
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Book Card */}
              <div className="glass rounded-2xl p-6 sticky top-20">
                <h3 className="text-lg font-bold text-stone-100 mb-4">Quick Enquiry</h3>
                <p className="text-sm text-stone-400 mb-4">Get instant response on WhatsApp or call us directly.</p>
                
                <div className="space-y-3">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 transition-all flex items-center justify-center gap-2">
                    <MessageCircle size={18} /> WhatsApp Us
                  </a>
                  <a href={callLink} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2">
                    <Phone size={18} /> +91 91085 97154
                  </a>
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
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={`mt-3 block text-center text-xs font-semibold ${colors.text} hover:underline`}>Book any vehicle →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Places */}
      {nearbyPlaces.length > 0 && (
        <section className="pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-stone-100 mb-6">More Places to Visit in {state.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {nearbyPlaces.map(np => (
                <Link key={np.slug} href={`/destinations/${state.slug}/${np.slug}`} className="group rounded-xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift">
                  <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl opacity-30">{np.emoji}</span></div>
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

      {/* Previous / Next Navigation */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPlace && (
              <Link href={`/destinations/${state.slug}/${prevPlace.slug}`} className={`group flex items-center gap-4 p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all ${colors.hoverBorder}`}>
                <ArrowLeft size={20} className="text-stone-500 group-hover:text-stone-300 transition-colors" />
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Previous Place</span>
                  <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">{prevPlace.emoji} {prevPlace.name}</h4>
                </div>
              </Link>
            )}
            {nextPlace && (
              <Link href={`/destinations/${state.slug}/${nextPlace.slug}`} className={`group flex items-center justify-end gap-4 p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all text-right ${colors.hoverBorder}`}>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Next Place</span>
                  <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2 justify-end">{nextPlace.emoji} {nextPlace.name}</h4>
                </div>
                <ArrowRight size={20} className="text-stone-500 group-hover:text-stone-300 transition-colors" />
              </Link>
            )}
          </div>
          <div className="text-center mt-6">
            <Link href={`/destinations/${state.slug}`} className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${colors.border} text-sm font-semibold ${colors.text} hover:bg-white/5 transition-all`}>
              <ChevronLeft size={16} /> View All {state.name} Places
            </Link>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi RRM Holidays! I need help planning my ${place.name} trip.`)}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:bg-green-400 transition-all whatsapp-float">
        <MessageCircle size={26} className="text-white" />
      </a>
      <Link href="#" className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:border-amber-500/30 transition-all">
        <ChevronUp size={18} className="text-stone-300" />
      </Link>
    </div>
  );
}
