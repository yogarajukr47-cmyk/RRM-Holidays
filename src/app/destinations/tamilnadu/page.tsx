'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Phone, MapPin, MessageCircle, Search, Sparkles, Home, ChevronUp } from 'lucide-react';

import { ScrollReveal } from '../ScrollReveal';
import { TAMIL_NADU } from '@/lib/places-data';

const WHATSAPP_NUMBER = '919108597154';
const CALL_NUMBER = '+919108597154';
const PLACES = TAMIL_NADU.places;

function getWhatsAppLink(placeName: string) {
  const msg = `Hi RRM Holidays! I'm interested in visiting ${placeName}, Tamil Nadu. Please share travel packages, vehicle options, and pricing details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function TamilNaduPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = PLACES.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
    <div className="min-h-screen bg-[#0a0a0a]">
      <ScrollReveal />
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-sm">R</div>
            <span className="text-lg font-bold tracking-tight text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1"><Home size={14} /> Home</Link>
            <Link href="#places" className="text-sm font-medium text-amber-400 flex items-center gap-1"><MapPin size={14} /> Tamil Nadu Places</Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi RRM Holidays! I want to plan a trip to Tamil Nadu. Please share details.')}`} target="_blank" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">Plan My Trip</a>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-stone-300 hover:text-white p-2"><Menu size={22} /></button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-neutral-900/95 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-stone-400 hover:text-white"><X size={22} /></button>
            </div>
            <div className="flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 text-sm font-medium">🏠 Home</Link>
              <Link href="#places" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 text-sm font-medium">📍 Tamil Nadu Places</Link>
              <a href={`tel:${CALL_NUMBER}`} onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 text-sm font-medium">📞 Call Us</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 text-sm font-medium">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <Image src="/states/tamilnadu-cover.jpg" alt="Tamil Nadu" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-[#0a0a0a]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-stone-300 mb-6">
            <Sparkles size={14} className="text-purple-400" /> Temple Heritage & Culture
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-4">
            Discover <span className="text-gradient-warm">Tamil Nadu</span>
          </h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
            From the magnificent Meenakshi Temple of Madurai to the toy trains of Ooty, from Marina Beach to Rameswaram — explore the land of temples.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi RRM Holidays! I want to plan a complete Tamil Nadu tour. Please share itineraries and pricing.')}`} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-500 transition-all"><MessageCircle size={18} /> WhatsApp Enquiry</a>
            <a href={`tel:${CALL_NUMBER}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"><Phone size={18} /> Call +91 91085 97154</a>
          </div>
        </div>
      </section>

      <section id="places" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="text" placeholder="Search places... (e.g., Madurai, Ooty, Chennai)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-black">All</button>
              </div>
            </div>
          </div>
          <p className="text-stone-500 text-sm mt-3 text-center">{filteredPlaces.length} places found</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div key={place.name} className="reveal group rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-lift card-shine">
                <Link href={`/destinations/tamilnadu/${place.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={place.img || `/states/tamilnadu-cover.jpg`} alt={place.name} fill className="object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 uppercase tracking-wider">{place.category}</span>
                  <div className="absolute bottom-3 left-4 right-4"><h3 className="text-xl font-bold text-white">{place.name}</h3><p className="text-xs text-stone-300 flex items-center gap-1 mt-1"><MapPin size={12} /> Tamil Nadu, India</p></div>
                </div>
                </Link>
                <div className="p-5">
                  <p className="text-sm text-stone-400 leading-relaxed mb-3 line-clamp-2">{place.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">{place.highlights.slice(0, 4).map(h => (<span key={h} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{h}</span>))}</div>
                  <div className="flex items-center justify-between">
                    <Link href={`/destinations/tamilnadu/${place.slug}`} className="text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">View Details →</Link>
                    <div className="flex gap-2">
                      <a href={getWhatsAppLink(place.name)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-[10px] font-semibold hover:bg-green-500 transition-all flex items-center gap-1"><MessageCircle size={12} /> WhatsApp</a>
                      <a href={`tel:${CALL_NUMBER}`} onClick={e => e.stopPropagation()} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-1"><Phone size={12} /> Call</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Plan Your <span className="text-gradient-warm">Tamil Nadu</span> Trip</h2>
            <p className="text-stone-400 max-w-xl mx-auto mb-8 leading-relaxed">From temple tours to hill station getaways, we craft unforgettable Tamil Nadu experiences with expert drivers and comfortable vehicles.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi RRM Holidays! I want to book a Tamil Nadu trip. Please share vehicle options and pricing.')}`} target="_blank" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-500 transition-all"><MessageCircle size={18} /> WhatsApp Us</a>
              <a href={`tel:${CALL_NUMBER}`} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all"><Phone size={18} /> +91 91085 97154</a>
            </div>
          </div>
        </div>
      </section>

      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi RRM Holidays! I need help planning my Tamil Nadu trip.')}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:bg-green-400 transition-all whatsapp-float"><MessageCircle size={26} className="text-white" /></a>
      <Link href="#" className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:border-amber-500/30 transition-all"><ChevronUp size={18} className="text-stone-300" /></Link>
    </div>
    </>
  );
}