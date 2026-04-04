'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight,
  Quote,
  ThumbsUp,
  Filter,
  ArrowLeft,
  Users,
  Award,
  CheckCircle,
} from 'lucide-react';

const WHATSAPP_NUMBER = '919108597154';

const REVIEWS = [
  {
    id: 1, name: 'Priya Sharma', location: 'New Delhi', avatar: 'PS', trip: 'Kerala Complete Tour (7 Days)', rating: 5, date: 'March 2026',
    quote: 'RRM Holidays made our Kerala trip absolutely magical! From the moment we landed in Kochi to the houseboat experience in Alleppey, everything was perfectly planned. The backwater houseboat experience was beyond words. Our driver Rajesh knew every hidden spot in Munnar and Thekkady. Will definitely book again for our next South India trip!',
    highlights: ['Houseboat stay was incredible', 'Driver was very knowledgeable', 'Hotels were clean & well-located', 'No hidden charges at all'],
  },
  {
    id: 2, name: 'Rajesh Kumar', location: 'Mumbai', avatar: 'RK', trip: 'Mysuru-Coorg Explorer (5 Days)', rating: 5, date: 'February 2026',
    quote: 'Being from North India, we were worried about language barriers. But RRM\'s local team in Mysuru made us feel completely at home. The Mysuru Palace illumination was mesmerizing, and Coorg\'s coffee estates were a dream. The entire itinerary was well-paced — not too rushed, not too slow. Highly recommend their Karnataka package!',
    highlights: ['Perfect itinerary pacing', 'Language was never a problem', 'Mysuru Palace Dasara experience', 'Coorg homestay was wonderful'],
  },
  {
    id: 3, name: 'Anita Desai', location: 'Pune', avatar: 'AD', trip: 'Ooty-Coonoor Getaway (4 Days)', rating: 5, date: 'January 2026',
    quote: 'The toy train ride through the Nilgiris was breathtaking! RRM\'s driver knew every secret viewpoint along the way. We stopped at unexpected spots that weren\'t in any travel guide. The Ooty Lake boating and Coonoor tea gardens were the highlights of our anniversary trip. Thank you RRM for making it so special!',
    highlights: ['Toy train ride was unforgettable', 'Driver suggested amazing viewpoints', 'Anniversary surprise arranged', 'Value for money package'],
  },
  {
    id: 4, name: 'Suresh Babu', location: 'Hyderabad', avatar: 'SB', trip: 'Tirupati pilgrimage (3 Days)', rating: 5, date: 'February 2026',
    quote: 'We booked a Tempo Traveller for our family pilgrimage to Tirupati. The vehicle was spotlessly clean, AC worked perfectly, and the driver was very respectful and punctual. We reached Tirumala well in time for darshan. RRM\'s per-km pricing is very transparent. Much better than other operators we tried before.',
    highlights: ['Tempo Traveller was excellent', 'Punctual and safe driving', 'Transparent per-km pricing', 'Family-friendly service'],
  },
  {
    id: 5, name: 'Meera Krishnan', location: 'Chennai', avatar: 'MK', trip: 'Karnataka Heritage Tour (6 Days)', rating: 5, date: 'December 2025',
    quote: 'Hampi was on our bucket list for years, and RRM finally made it happen! The Vijayanagara ruins are absolutely stunning, and our guide at Hampi was incredibly knowledgeable. We also visited Badami, Aihole, and Pattadakal — all UNESCO sites. The entire trip was flawlessly executed. The hotels they picked were fantastic!',
    highlights: ['Hampi ruins exceeded expectations', 'Knowledgeable guide at every site', 'Heritage hotels were amazing', 'Well-organized multi-city trip'],
  },
  {
    id: 6, name: 'Vikram Patel', location: 'Ahmedabad', avatar: 'VP', trip: 'Goa Beach Holiday (5 Days)', rating: 4, date: 'January 2026',
    quote: 'Booked an Innova Crysta for our family trip to Goa. The vehicle was pristine, and the drive from Mysuru to Goa was smooth. We visited both North and South Goa — Baga, Calangute, Palolem, and even the Dudhsagar Falls. RRM arranged everything including the spice plantation tour. Only wish we had more days!',
    highlights: ['Innova Crysta was luxurious', 'Dudhsagar Falls visit arranged', 'Spice plantation was interesting', 'Professional driver'],
  },
  {
    id: 7, name: 'Lakshmi Iyer', location: 'Bengaluru', avatar: 'LI', trip: 'Wayanad & Munnar Combo (6 Days)', rating: 5, date: 'November 2025',
    quote: 'RRM suggested this Wayanad + Munnar combo and it was the best travel decision we made! Wayanad\'s Edakkal Caves and Banasura Sagar Dam were stunning, and Munnar\'s tea gardens took our breath away. The stay at a treehouse resort in Wayanad was a dream come true for our kids. Absolutely loved it!',
    highlights: ['Treehouse stay was magical', 'Perfect combo itinerary', 'Kid-friendly destinations', 'Excellent hotel selections'],
  },
  {
    id: 8, name: 'Arjun Nair', location: 'Kochi', avatar: 'AN', trip: 'Mysuru One Day Trip', rating: 5, date: 'March 2026',
    quote: 'Took a one-day Mysuru trip from Bengaluru in RRM\'s Dzire. Covered Mysuru Palace, Chamundi Hills, Brindavan Gardens, and St. Philomena\'s Church — all in one day! The driver knew the best routes to avoid traffic. Very affordable pricing at just ₹12/km. Perfect for a quick getaway!',
    highlights: ['Covered 4 spots in one day', 'Smart route planning', 'Very affordable pricing', 'Comfortable sedan ride'],
  },
  {
    id: 9, name: 'Deepa & Ramesh', location: 'Jaipur', avatar: 'DR', trip: 'South India Grand Tour (14 Days)', rating: 5, date: 'October 2025',
    quote: 'We planned a 2-week South India trip covering Mysuru, Ooty, Munnar, Thekkady, Alleppey, Kochi, Madurai, and Rameswaram. RRM handled everything — vehicles, hotels, sightseeing, and even food recommendations. The Innova was comfortable for the entire journey. Every state felt like a different country. Incredible experience!',
    highlights: ['14-day trip flawlessly managed', 'Different vehicle for different legs', 'Hotel quality was consistent', 'Local food recommendations were spot on'],
  },
  {
    id: 10, name: 'Kavitha Reddy', location: 'Vizag', avatar: 'KR', trip: 'Araku Valley Tour (3 Days)', rating: 5, date: 'February 2026',
    quote: 'The Araku Valley trip with RRM was refreshing! The coffee plantations, Borra Caves, and the scenic train journey through the Eastern Ghats were highlights. Our driver from Vizag was very friendly and knew the local tribal areas well. The organic coffee we tasted was the best I\'ve ever had. Will visit again during the coffee festival!',
    highlights: ['Borra Caves were stunning', 'Scenic train journey included', 'Local tribal culture experience', 'Best organic coffee'],
  },
  {
    id: 11, name: 'Santosh Hegde', location: 'Mangalore', avatar: 'SH', trip: 'Corporate Team Outing (2 Days)', rating: 4, date: 'January 2026',
    quote: 'Booked a 25-seater bus for our company offsite near Chikmagalur. The bus was well-maintained with pushback seats and good AC. RRM arranged the entire 2-day itinerary including trekking at Mullayanagiri and a coffee estate visit. The team loved it! Planning to make this an annual event with RRM.',
    highlights: ['25-seater bus was comfortable', 'Corporate-friendly service', 'Trekking arrangements done', 'Repeat customer now'],
  },
  {
    id: 12, name: 'Nandini Rao', location: 'Bengaluru', avatar: 'NR', trip: 'Coorg Weekend Getaway (3 Days)', rating: 5, date: 'March 2026',
    quote: 'A perfect weekend escape from Bengaluru traffic! RRM arranged a lovely homestay in Coorg with authentic Kodava food. We visited Abbey Falls, Raja\'s Seat, Dubare Elephant Camp, and the Namdroling Monastery. The elephant bathing experience was the highlight for our kids. The Etios was comfortable and the driver was excellent.',
    highlights: ['Beautiful homestay with authentic food', 'Elephant camp was amazing for kids', 'Weekend-friendly itinerary', 'Smooth and safe driving'],
  },
  {
    id: 13, name: 'Mohammed Ashraf', location: 'Mysuru', avatar: 'MA', trip: 'Goa Family Trip (4 Days)', rating: 5, date: 'December 2025',
    quote: 'We are from Mysuru and decided to explore Goa with RRM Holidays. The Innova was perfect for our family of 6. We visited Fort Aguada, Old Goa churches, Spice Plantation, and multiple beaches. The driver doubled as a guide and suggested we visit Divar Island — which turned out to be the best part of our trip! Truly local expertise.',
    highlights: ['Family of 6 comfortably seated', 'Driver doubled as excellent guide', 'Divar Island suggestion was golden', 'Well-maintained vehicle'],
  },
  {
    id: 14, name: 'Prakash & Family', location: 'Coimbatore', avatar: 'PF', trip: 'Kodaikanal Holiday (4 Days)', rating: 5, date: 'January 2026',
    quote: 'Our family trip to Kodaikanal was wonderful! RRM arranged everything from Coimbatore pickup to Kodaikanal drop. The Coaker\'s Walk, Pillar Rocks, and the boat ride at the lake were beautiful. The weather was perfect and the hotel they chose had an amazing valley view. Very professional service from start to finish.',
    highlights: ['Door-to-door service', 'Valley view hotel was perfect', 'Coaker\'s Walk was beautiful', 'Professional and punctual'],
  },
  {
    id: 15, name: 'Revathi Sundaram', location: 'Trichy', avatar: 'RS', trip: 'Pondicherry Weekend (3 Days)', rating: 4, date: 'February 2026',
    quote: 'Pondicherry was a refreshing change! RRM arranged our trip from Trichy. The French Quarter walk, Auroville visit, Promenade Beach, and the cafes were wonderful. The driver was polite and knew all the good restaurants. We especially loved the cycling tour in the French Quarter. Great value for a weekend trip!',
    highlights: ['Auroville visit was spiritual', 'French Quarter cycling tour', 'Good restaurant recommendations', 'Affordable weekend package'],
  },
  {
    id: 16, name: 'Group of Friends', location: 'Bengaluru', avatar: 'GF', trip: 'Hampi Road Trip (3 Days)', rating: 5, date: 'November 2025',
    quote: 'Five friends, one Tempo Traveller, and the magical ruins of Hampi! This was our best road trip ever. RRM\'s Tempo was spacious and comfortable for the long drive. We explored every corner of Hampi — the boulder rides, coracle boats at Sanapur Lake, sunset at Hemakuta Hill, and the Virupaksha Temple. The driver even set up a bonfire for us one evening!',
    highlights: ['Spacious Tempo for 5 friends', 'Bonfire evening was a surprise', 'Coracle boat ride at Sanapur', 'Breathtaking sunset views'],
  },
];

const CATEGORY_FILTERS = [
  { label: 'All Reviews', value: 'all' },
  { label: 'Karnataka', value: 'karnataka' },
  { label: 'Kerala', value: 'kerala' },
  { label: 'Tamil Nadu', value: 'tamilnadu' },
  { label: 'Goa', value: 'goa' },
  { label: 'Andhra/Telangana', value: 'andhra' },
  { label: 'Multi-State', value: 'multi' },
];

const RATING_STATS = [
  { platform: 'Google Reviews', rating: '4.8', total: '1,200+', icon: '⭐', color: 'text-amber-400' },
  { platform: 'TripAdvisor', rating: '4.7', total: '800+', icon: '🦉', color: 'text-cyan-400' },
  { platform: 'Facebook', rating: '4.9', total: '600+', icon: '👍', color: 'text-blue-400' },
  { platform: 'JustDial', rating: '4.8', total: '500+', icon: '📞', color: 'text-green-400' },
];

function getCategory(review: typeof REVIEWS[0]): string {
  const trip = review.trip.toLowerCase();
  if (trip.includes('kerala') || trip.includes('munnar') || trip.includes('alleppey') || trip.includes('thekkady') || trip.includes('wayanad') || trip.includes('kochi')) return 'kerala';
  if (trip.includes('karnataka') || trip.includes('mysuru') || trip.includes('coorg') || trip.includes('hampi') || trip.includes('chikmagalur') || trip.includes('bengaluru')) return 'karnataka';
  if (trip.includes('tamil') || trip.includes('ooty') || trip.includes('kodaikanal') || trip.includes('madurai') || trip.includes('rameswaram') || trip.includes('pondicherry') || trip.includes('trichy') || trip.includes('coimbatore')) return 'tamilnadu';
  if (trip.includes('goa')) return 'goa';
  if (trip.includes('araku') || trip.includes('tirupati') || trip.includes('vizag') || trip.includes('andhra') || trip.includes('hyderabad')) return 'andhra';
  return 'multi';
}

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredReviews = activeFilter === 'all'
    ? REVIEWS
    : REVIEWS.filter(r => getCategory(r) === activeFilter);

  const displayedReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  /* ── scroll reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [visibleCount]);

  return (
    <>
      {/* ── FAQ Schema (JSON-LD) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I book a trip with RRM Holidays?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply message us on WhatsApp at +91 9108597154. Our travel experts will help you plan a custom itinerary based on your preferences, budget, and travel dates."
                }
              },
              {
                "@type": "Question",
                "name": "Does RRM Holidays offer fixed tour packages?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, we believe every trip should be unique. Instead of fixed packages, we create custom itineraries tailored to your preferences. Contact us on WhatsApp for a personalized quote."
                }
              },
              {
                "@type": "Question",
                "name": "What vehicles does RRM Holidays offer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer 12+ vehicles including Sedan (Etios, Dzire), MUV (Innova, Crysta), Tempo Traveller, Mini Bus, Bus, and Force Urbania. All with transparent per-km pricing."
                }
              }
            ]
          })
        }}
      />

      {/* ─────────── NAVIGATION ─────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-sm">R</div>
            <span className="text-lg font-bold tracking-tight text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors">Home</Link>
            <Link href="/destinations/karnataka" className="text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors">Destinations</Link>
            <Link href="/reviews" className="text-sm font-medium text-amber-400">Reviews</Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+919108597154" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-stone-200 text-sm font-medium hover:bg-white/5 transition-all">
              <Phone size={14} /> Call Us
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20read%20your%20reviews%20and%20want%20to%20book%20a%20trip.`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">
              <MessageCircle size={14} /> Book Now
            </a>
          </div>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl animate-morph" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs font-semibold text-amber-400 mb-6">
              <Star size={14} className="fill-amber-400" />
              Trusted by 5,000+ Happy Travellers
            </div>
          </div>
          <h1 className="reveal stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Customer <span className="text-gradient-warm">Reviews</span> & Experiences
          </h1>
          <p className="reveal stagger-2 text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Real stories from real travellers who explored South India with RRM Holidays. Read what they have to say about their journeys.
          </p>

          {/* Rating Stats */}
          <div className="reveal stagger-3 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            {RATING_STATS.map(r => (
              <div key={r.platform} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{r.icon}</div>
                <div className={`text-2xl font-extrabold ${r.color}`}>{r.rating}</div>
                <div className="text-xs text-stone-500 mt-0.5">{r.platform}</div>
                <div className="text-[10px] text-stone-600">{r.total} reviews</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FILTER + REVIEWS ─────────── */}
      <section className="relative py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter tabs */}
          <div className="reveal flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => { setActiveFilter(f.value); setVisibleCount(6); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === f.value
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-stone-400 hover:text-stone-200 hover:bg-white/10 border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="reveal stagger-1 text-center mb-10">
            <p className="text-sm text-stone-500">
              Showing <span className="text-amber-400 font-semibold">{displayedReviews.length}</span> of <span className="text-stone-300 font-semibold">{filteredReviews.length}</span> reviews
              {activeFilter !== 'all' && <span> in <span className="text-amber-400">{CATEGORY_FILTERS.find(f => f.value === activeFilter)?.label}</span></span>}
            </p>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review, i) => (
              <div
                key={review.id}
                className={`reveal stagger-${Math.min(i + 1, 7)} testimonial-card p-6 rounded-2xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center text-amber-400 font-bold text-sm border border-amber-500/20">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-stone-200">{review.name}</div>
                      <div className="flex items-center gap-1 text-xs text-stone-500">
                        <MapPin size={10} /> {review.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-stone-600">{review.date}</div>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className={j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-700'} />
                  ))}
                </div>

                {/* Trip name */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10 text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-3">
                  <MapPin size={10} /> {review.trip}
                </div>

                {/* Quote */}
                <p className="text-sm text-stone-300 leading-relaxed mb-4 italic">
                  &ldquo;{review.quote}&rdquo;
                </p>

                {/* Highlights */}
                <div className="space-y-1.5">
                  {review.highlights.slice(0, 3).map(h => (
                    <div key={h} className="flex items-start gap-2 text-xs text-stone-500">
                      <CheckCircle size={12} className="text-green-500/60 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="reveal text-center mt-12">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-8 py-3 rounded-full border border-white/10 text-stone-300 font-semibold text-sm hover:bg-white/5 transition-all flex items-center gap-2 mx-auto"
              >
                Load More Reviews <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* No reviews */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-500">No reviews found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─────────── WRITE REVIEW CTA ─────────── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image src="/kerala.jpg" alt="CTA Background" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="reveal text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            Ready To Create Your Own <span className="text-gradient-warm">Travel Story?</span>
          </h2>
          <p className="reveal stagger-1 text-stone-400 text-lg mb-10">
            Join thousands of happy travellers. Plan your dream South India vacation today.
          </p>
          <div className="reveal stagger-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RRM%20Holidays!%20I%20read%20your%20reviews%20and%20want%20to%20plan%20a%20trip.%20Please%20share%20details.`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">
              <MessageCircle size={18} className="text-green-700" /> WhatsApp Us
            </a>
            <a href="tel:+919108597154" className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/10 text-stone-200 font-semibold hover:bg-white/5 transition-all">
              <Phone size={18} /> Call: +91 91085 97154
            </a>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="relative border-t border-white/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold text-xs">R</div>
              <span className="text-lg font-bold text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
            </Link>
            <p className="text-xs text-stone-600">&copy; {new Date().getFullYear()} RRM Holidays. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-500 hover:text-green-400 transition-colors">WhatsApp</a>
              <a href="tel:+919108597154" className="text-xs text-stone-500 hover:text-amber-400 transition-colors">Call Us</a>
              <Link href="/" className="text-xs text-stone-500 hover:text-amber-400 transition-colors">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
