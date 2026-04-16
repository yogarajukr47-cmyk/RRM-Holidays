'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  Menu, X, Phone, Mail, MapPin, Clock, ChevronDown, Star, Search, Users, Calendar,
  Shield, Headphones, Route, Car, ChevronUp, MessageCircle, Instagram, Youtube,
  ArrowRight, Award, Compass, Sparkles, Globe, Send, Bot, Plane, CheckCircle2,
  ChevronLeft, ChevronRight, Camera, Moon, Sun, MapPinned, UserCheck,
  ThumbsUp, TrendingUp, Navigation, BarChart3,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import useEmblaCarousel from 'embla-carousel-react';
import dynamic from 'next/dynamic';

const IndiaMap = dynamic(() => import('@/components/IndiaMap'), { ssr: false });

/* ═════════════════════════════ DATA CONSTANTS ═══════════════════════════ */

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Vehicles', href: '#vehicles' },
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '#contact' },
];

const STATE_CARDS = [
  { name: 'Karnataka', slug: 'karnataka', img: '/states/karnataka-cover.jpg', places: 38, tag: 'Heritage & Nature', tagColor: 'text-amber-400 border-amber-400/30', icon: '🏛️', desc: 'Royal palaces of Mysuru, misty hills of Coorg, ancient ruins of Hampi, coffee estates of Chikmagalur & pristine beaches of Mangalore.', popular: true },
  { name: 'Kerala', slug: 'kerala', img: '/states/kerala-cover.jpg', places: 13, tag: "God's Own Country", tagColor: 'text-cyan-400 border-cyan-400/30', icon: '🛶', desc: 'Backwaters of Alleppey, tea gardens of Munnar, wildlife of Thekkady, beaches of Kovalam, temples of Thrissur & hills of Wayanad.', popular: false },
  { name: 'Tamil Nadu', slug: 'tamilnadu', img: '/states/tamilnadu-cover.jpg', places: 22, tag: 'Temple Heritage', tagColor: 'text-purple-400 border-purple-400/30', icon: '🛕', desc: 'Meenakshi Temple Madurai, Marina Beach Chennai, Ooty hill station, Rameswaram pilgrimage, Kodaikanal & French charm of Pondicherry.', popular: false },
  { name: 'Goa', slug: 'goa', img: '/states/goa-cover.jpg', places: 16, tag: 'Beach Paradise', tagColor: 'text-pink-400 border-pink-400/30', icon: '🏖️', desc: 'Sun-kissed beaches of Baga & Palolem, Portuguese heritage of Old Goa, Dudhsagar Falls, Fort Aguada & charming Fontainhas.', popular: false },
  { name: 'Andhra Pradesh', slug: 'andhra', img: '/states/andhra-cover.jpg', places: 19, tag: 'Pilgrimage & Nature', tagColor: 'text-orange-400 border-orange-400/30', icon: '⛰️', desc: 'Sacred Tirupati Temple, Araku Valley coffee plantations, Visakhapatnam beaches, Gandikota Fort & historic Amaravati.', popular: false },
];

const VEHICLES = [
  { id: 1, slug: 'toyota-etios', type: 'Sedan', model: 'Toyota Etios', img: '/sedan-etios.jpg', seats: '4 Seaters', badge: null, badgeColor: '', features: ['AC', 'Music System', 'Comfortable Seats', 'Boot Space'], desc: 'Perfect for small family trips and city tours', price: 14 },
  { id: 2, slug: 'maruti-swift-dzire', type: 'Sedan', model: 'Maruti Swift Dzire', img: '/swift-dzire.jpg', seats: '4 Seaters', badge: 'Popular', badgeColor: 'bg-amber-500', features: ['AC', 'Music System', 'Comfortable Seats', 'Fuel Efficient'], desc: 'Compact sedan ideal for city rides and short trips', price: 13 },
  { id: 3, slug: 'toyota-innova', type: 'MUV', model: 'Toyota Innova', img: '/innova-muv.jpg', seats: '7 Seaters', badge: null, badgeColor: '', features: ['Spacious', 'AC', 'Music System', 'Luggage Space'], desc: 'Ideal for family vacations and group travel', price: 18 },
  { id: 4, slug: 'innova-crysta', type: 'Premium MUV', model: 'Innova Crysta', img: '/innova-crysta.jpg', seats: '7 Seaters', badge: 'Premium', badgeColor: 'bg-violet-500', features: ['Premium AC', 'Luxury Seats', 'Entertainment System', 'Captain Seats'], desc: 'Premium comfort for luxury travel experiences', price: 22 },
  { id: 5, slug: 'force-tempo-traveller', type: 'Tempo Traveller', model: 'Force Tempo Traveller', img: '/tempo-traveller.jpg', seats: '12 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Best for medium groups, corporate trips and family outings', price: 24 },
  { id: 6, slug: '21-seater-mini-bus', type: 'Mini Bus', model: '21 Seater Mini Bus', img: '/mini-bus.jpg', seats: '21 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'Best for large groups, weddings and corporate events', price: 26 },
  { id: 7, slug: '25-seater-bus', type: 'Bus', model: '25 Seater Bus', img: '/bus-25seater.jpg', seats: '25 Seaters', badge: null, badgeColor: '', features: ['Pushback Seats', 'AC', 'Music System', 'PA System'], desc: 'Ideal for large groups, school trips and corporate outings', price: 28 },
  { id: 8, slug: '33-seater-bus', type: 'Bus', model: '33 Seater Bus', img: '/bus-33seater.jpg', seats: '33 Seaters', badge: null, badgeColor: '', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System'], desc: 'Spacious bus for pilgrimage tours and large group travel', price: 32 },
  { id: 9, slug: '50-seater-luxury-coach', type: 'Luxury Bus', model: '50 Seater Luxury Coach', img: '/bus-50seater.jpg', seats: '50 Seaters', badge: 'Luxury', badgeColor: 'bg-cyan-500', features: ['Recliner Seats', 'AC', 'Entertainment', 'PA System', 'WiFi'], desc: 'Luxury Volvo coach for very large groups, pilgrimages & tours', price: 45 },
  { id: 10, slug: 'force-urbania-10', type: 'Tempo Traveller', model: 'Force Urbania 10 Seater', img: '/urbania-10.jpg', seats: '10 Seaters', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Ample Luggage'], desc: 'Compact yet spacious 10-seater Force Urbania for medium groups', price: 26 },
  { id: 11, slug: 'force-urbania-13', type: 'Tempo Traveller', model: 'Force Urbania 13 Seater', img: '/urbania-13.jpg', seats: '13 Seaters', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Large Luggage'], desc: 'Versatile 13-seater Force Urbania for family trips & temple tours', price: 28 },
  { id: 12, slug: 'force-urbania-16', type: 'Tempo Traveller', model: 'Force Urbania 16 Seater', img: '/urbania-16.jpg', seats: '16 Seaters', badge: 'New', badgeColor: 'bg-emerald-500', features: ['Pushback Seats', 'AC', 'Music System', 'Extra Luggage'], desc: 'Largest Force Urbania 16 seater for large group tours', price: 30 },
];

const VEHICLE_VIEWS: Record<number, string[]> = {
  1: ['/sedan-etios.jpg'], 2: ['/swift-dzire.jpg'], 3: ['/innova-muv.jpg'], 4: ['/innova-crysta.jpg'],
  5: ['/tempo-traveller.jpg'], 6: ['/mini-bus.jpg'], 7: ['/bus-25seater.jpg'], 8: ['/bus-33seater.jpg'],
  9: ['/bus-50seater.jpg'], 10: ['/urbania-10.jpg'], 11: ['/urbania-13.jpg'], 12: ['/urbania-16.jpg'],
};

const TESTIMONIALS = [
  { name: 'Priya Sharma', trip: 'Kerala Complete Tour', rating: 5, quote: 'RRM Holidays made our Kerala trip absolutely magical! The backwater houseboat experience was beyond words.', avatar: '/avatar-priya.jpg', tripImg: '/testimonial-kerala.jpg' },
  { name: 'Rajesh Kumar', trip: 'Mysuru-Coorg Explorer', rating: 5, quote: "Being from North India, we were worried about language barriers. But RRM's local team in Mysuru made us feel at home.", avatar: '/avatar-rajesh.jpg', tripImg: '/testimonial-coorg.jpg' },
  { name: 'Anita Desai', trip: 'Ooty-Coonoor Getaway', rating: 5, quote: "The toy train ride through the Nilgiris was breathtaking! RRM's driver knew every secret viewpoint.", avatar: '/avatar-anita.jpg', tripImg: '/testimonial-ooty.jpg' },
  { name: 'Vikram Patel', trip: 'Goa Beach Holiday', rating: 5, quote: 'Goa with RRM was incredible! They took us to hidden beaches tourists never see. Sunset at Palolem was unforgettable.', avatar: '/avatar-placeholder.jpg', tripImg: '/testimonial-ooty.jpg' },
  { name: 'Deepa Nair', trip: 'Wayanad Adventure', rating: 5, quote: 'Wayanad was always on my bucket list and RRM made it happen perfectly. The treehouse stay and bamboo rafting were amazing.', avatar: '/avatar-placeholder.jpg', tripImg: '/testimonial-coorg.jpg' },
  { name: 'Arun Krishnan', trip: 'Hampi Heritage Tour', rating: 5, quote: 'As a history buff, Hampi was a dream. Our guide from RRM knew every stone and story. Sunset from Hemakuta Hill was magical!', avatar: '/avatar-placeholder.jpg', tripImg: '/testimonial-kerala.jpg' },
  { name: 'Sneha Reddy', trip: 'Coorg Coffee Trail', rating: 5, quote: "The Coorg coffee estate tour was a highlight! RRM arranged a private coffee tasting session that was truly special.", avatar: '/avatar-placeholder.jpg', tripImg: '/testimonial-coorg.jpg' },
  { name: 'Rahul Menon', trip: 'Kanyakumari & Rameswaram', rating: 5, quote: 'The sunrise at Kanyakumari and the Pamban Bridge were surreal. RRM handled everything from Kochi to the tip of India.', avatar: '/avatar-placeholder.jpg', tripImg: '/testimonial-kerala.jpg' },
];

const SEARCH_DATA = [
  { name: 'Mysuru Palace', type: 'Place', state: 'Karnataka', icon: '🏛️', img: '/gallery-1-mysuru-palace.jpg' },
  { name: 'Coorg', type: 'Place', state: 'Karnataka', icon: '🏔️', img: '/gallery-4-coorg-hills.jpg' },
  { name: 'Hampi', type: 'Place', state: 'Karnataka', icon: '🏛️', img: '/gallery-3-hampi-ruins.jpg' },
  { name: 'Chikmagalur', type: 'Place', state: 'Karnataka', icon: '☕', img: '/gallery-4-coorg-hills.jpg' },
  { name: 'Kerala Backwaters', type: 'Experience', state: 'Kerala', icon: '🛶', img: '/gallery-2-kerala-backwater.jpg' },
  { name: 'Munnar', type: 'Place', state: 'Kerala', icon: '🍵', img: '/gallery-7-munnar-tea.jpg' },
  { name: 'Ooty', type: 'Place', state: 'Tamil Nadu', icon: '🏔️', img: '/gallery-6-ooty-train.jpg' },
  { name: 'Goa Beaches', type: 'Experience', state: 'Goa', icon: '🏖️', img: '/gallery-5-goa-beach.jpg' },
  { name: 'Tirupati Temple', type: 'Place', state: 'Andhra', icon: '🛕', img: '/gallery-8-temple.jpg' },
  { name: 'Innova Crysta', type: 'Vehicle', state: '', icon: '🚗', img: '/innova-crysta.jpg' },
  { name: 'Force Urbania', type: 'Vehicle', state: '', icon: '🚐', img: '/urbania-10.jpg' },
  { name: 'Bandipur Safari', type: 'Experience', state: 'Karnataka', icon: '🐘', img: '/gallery-4-coorg-hills.jpg' },
  { name: 'Kovalam Beach', type: 'Place', state: 'Kerala', icon: '🏖️', img: '/gallery-5-goa-beach.jpg' },
  { name: 'Madurai Temple', type: 'Place', state: 'Tamil Nadu', icon: '🛕', img: '/gallery-8-temple.jpg' },
  { name: 'Old Goa Churches', type: 'Place', state: 'Goa', icon: '⛪', img: '/gallery-8-temple.jpg' },
  { name: 'Luxury Coach 50 Seater', type: 'Vehicle', state: '', icon: '🚌', img: '/bus-50seater.jpg' },
  { name: 'Dandeli Rafting', type: 'Experience', state: 'Karnataka', icon: '🌊', img: '/gallery-5-goa-beach.jpg' },
  { name: 'Kodaikanal', type: 'Place', state: 'Tamil Nadu', icon: '🏔️', img: '/gallery-4-coorg-hills.jpg' },
  { name: 'Wayanad', type: 'Place', state: 'Kerala', icon: '🌿', img: '/gallery-4-coorg-hills.jpg' },
  { name: 'Alleppey Houseboat', type: 'Experience', state: 'Kerala', icon: '🛶', img: '/gallery-9-wood-houseboat.jpg' },
  { name: 'Dudhsagar Falls', type: 'Place', state: 'Goa', icon: '💧', img: '/gallery-5-goa-beach.jpg' },
  { name: 'Tempo Traveller', type: 'Vehicle', state: '', icon: '🚐', img: '/tempo-traveller.jpg' },
];

const PHRASES = ['Explore South India Like Never Before', 'Discover Karnataka', 'Experience Kerala', 'Visit Tamil Nadu', 'Go Beach in Goa', 'Plan Your Dream Vacation'];

const LIVE_MESSAGES = [
  'Someone from Bengaluru just enquired about a Mysuru trip',
  'A family from Chennai booked a 3-day Kerala tour',
  'Someone from Mumbai is exploring Coorg packages',
  'A group from Hyderabad enquired about Hampi heritage tour',
  'Someone from Delhi is planning a Goa beach vacation',
  'A couple from Pune booked an Ooty-Coonoor getaway',
];

const GALLERY_PHOTOS = [
  { src: '/gallery-1-mysuru-palace.jpg', alt: 'Mysuru Palace', category: 'Heritage', tall: true },
  { src: '/gallery-2-kerala-backwater.jpg', alt: 'Kerala Backwaters', category: 'Beaches' },
  { src: '/gallery-3-hampi-ruins.jpg', alt: 'Hampi Ruins', category: 'Heritage', tall: false },
  { src: '/gallery-4-coorg-hills.jpg', alt: 'Coorg Hills', category: 'Hills', tall: true },
  { src: '/gallery-5-goa-beach.jpg', alt: 'Goa Beach', category: 'Beaches' },
  { src: '/gallery-6-ooty-train.jpg', alt: 'Ooty Toy Train', category: 'Hills' },
  { src: '/gallery-7-munnar-tea.jpg', alt: 'Munnar Tea Gardens', category: 'Hills', tall: true },
  { src: '/gallery-8-temple.jpg', alt: 'South Indian Temple', category: 'Temples' },
  { src: '/gallery-9-wood-houseboat.jpg', alt: 'Kerala Houseboat', category: 'Beaches' },
  { src: '/gallery-10-indian-food.jpg', alt: 'South Indian Cuisine', category: 'Heritage' },
  { src: '/gallery-11-sunset-beach.jpg', alt: 'Beach Sunset', category: 'Beaches', tall: true },
  { src: '/gallery-12-mountain-road.jpg', alt: 'Mountain Road Trip', category: 'Hills' },
];

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'kn', label: 'ಕನ್ನ್ಡ (Kannada)', native: 'KN' },
  { code: 'hi', label: 'हिंदी (Hindi)', native: 'HI' },
  { code: 'ta', label: 'தமிழ் (Tamil)', native: 'TA' },
  { code: 'ml', label: 'മലയാളം (Malayalam)', native: 'ML' },
];

const GALLERY_FILTERS = ['All', 'Temples', 'Beaches', 'Hills', 'Heritage'];
const WHATSAPP_NUMBER = '919108597154';

const DESTINATIONS = [
  'Mysuru', 'Bengaluru', 'Coorg', 'Hampi', 'Chikmagalur', 'Mangalore', 'Ooty', 'Kodaikanal',
  'Kerala', 'Munnar', 'Kochi', 'Alleppey', 'Kovalam', 'Thekkady', 'Wayanad',
  'Goa', 'Panaji', 'Baga Beach', 'Old Goa', 'Dudhsagar Falls',
  'Tamil Nadu', 'Chennai', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Pondicherry',
  'Andhra Pradesh', 'Tirupati', 'Visakhapatnam', 'Araku Valley', 'Vijayawada',
  'Hyderabad', 'Telangana',
];

const AI_TOOLS = [
  { title: 'AI Chatbot', desc: 'Ask anything about South India travel in 5 languages. Get instant answers about destinations, vehicles, and routes.', icon: Bot, link: '#', badge: 'Live', badgeColor: 'bg-emerald-500' },
  { title: 'Trip Planner', desc: 'Plan your perfect South India itinerary with AI-powered day-by-day suggestions and local tips.', icon: MapPinned, link: '/trip-planner', badge: 'Popular', badgeColor: 'bg-amber-500' },
  { title: 'Popular Routes', desc: 'Explore the most scenic and popular travel routes across South India with distance and time details.', icon: Navigation, link: '/smart-deals', badge: 'New', badgeColor: 'bg-blue-500' },
  { title: 'AI Recommendations', desc: 'Get personalized destination suggestions based on your interests, budget, and travel style.', icon: Sparkles, link: '/ai-recommendations', badge: 'Popular', badgeColor: 'bg-amber-500' },
  { title: 'Route Planner', desc: 'Plan multi-stop routes with optimized directions, attractions, and travel time estimates.', icon: Route, link: '/route-planner', badge: '', badgeColor: '' },
  { title: 'Review Analyzer', desc: 'See what other travellers say about any destination — sentiment, pros, cons, and tips.', icon: BarChart3, link: '/review-analyzer', badge: 'New', badgeColor: 'bg-blue-500' },
];

const ALL_MARKERS_COUNT = 130;

const FLOATING_ICONS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/rrmholidays', bg: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400', shadow: 'shadow-pink-500/30' },
  { icon: Phone, label: 'Call Us', href: 'tel:+919108597154', bg: 'bg-orange-500 hover:bg-orange-400', shadow: 'shadow-orange-500/30' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@rrmholidays', bg: 'bg-red-600 hover:bg-red-500', shadow: 'shadow-red-500/30' },
  { icon: Car, label: 'Our Fleet', href: '/vehicles', bg: 'bg-violet-600 hover:bg-violet-500', shadow: 'shadow-violet-500/30' },
];

/* ═════════════════════════════ MAIN COMPONENT ═══════════════════════════ */

export default function Home() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [backToTop, setBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const toastIdRef = useRef(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = PHRASES[phraseIdx];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
        if (typedText === currentPhrase) setTimeout(() => setIsDeleting(true), 2000);
      } else {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
        if (typedText === '') { setIsDeleting(false); setPhraseIdx((p) => (p + 1) % PHRASES.length); }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIdx]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const searchRef = useRef<HTMLDivElement>(null);

   /* ✅ CHANGE 1 (Step 4): filteredSearch now shows all items when searchQuery is empty */
  const FILTER_TYPE_MAP: Record<string, string> = { 'Places': 'Place', 'Vehicles': 'Vehicle', 'Experiences': 'Experience' };
  const resolvedFilter = FILTER_TYPE_MAP[activeFilter] || activeFilter;

  const filteredSearch = SEARCH_DATA.filter((item) => {
    const mq = searchQuery.length > 0 ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const mf = activeFilter === 'All' || item.type === resolvedFilter || item.state === activeFilter;
    return mq && mf;
  }).slice(0, 8);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const showToast = useCallback((msg: string) => {
    const id = ++toastIdRef.current;
    setToasts((p) => [...p, { id, msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bDest, setBDest] = useState('');
  const [bDate, setBDate] = useState('');
  const [bMembers, setBMembers] = useState('');
  const [bName, setBName] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bVehicle, setBVehicle] = useState('');
  const [bNotes, setBNotes] = useState('');

  const handleBookingSubmit = () => {
    if (!bDest || !bDate || !bMembers) { showToast('⚠️ Please select destination, date & members'); return; }
    const msg = `🎉 *New Booking — RRM Holidays*\n\n📍 *Destination:* ${bDest}\n📅 *Date:* ${bDate}\n👥 *Travellers:* ${bMembers}\n${bName ? `👤 *Name:* ${bName}\n` : ''}${bPhone ? `📱 *Phone:* ${bPhone}\n` : ''}${bVehicle ? `🚗 *Vehicle:* ${bVehicle}\n` : ''}${bNotes ? `📝 *Notes:* ${bNotes}\n` : ''}\nPlease share a custom quotation.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('✅ Opening WhatsApp!');
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setBackToTop(window.scrollY > 600);
      setScrollProgress(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100);
      if (heroContentRef.current) heroContentRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }), { threshold: 0.12 });
    document.querySelectorAll('.reveal, .slide-in-left, .slide-in-right, .scale-in').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });

  useEffect(() => {
    const secs = NAV_LINKS.filter((l) => l.href.startsWith('#')).map((l) => l.href.replace('#', ''));
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }), { threshold: 0.25 });
    secs.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setEmail] = useState('');
  const [cDest, setCDest] = useState('');
  const [cDate, setCDate] = useState('');
  const [cTravellers, setCTravellers] = useState('');
  const [cMsg, setCMsg] = useState('');

  const handleContactSubmit = () => {
    if (!cName || !cPhone) { showToast('⚠️ Please enter name and phone'); return; }
    const msg = `📋 *Enquiry — RRM Holidays*\n\n👤 *Name:* ${cName}\n📱 *Phone:* ${cPhone}\n${cEmail ? `📧 *Email:* ${cEmail}\n` : ''}${cDest ? `📍 *Destination:* ${cDest}\n` : ''}${cDate ? `📅 *Date:* ${cDate}\n` : ''}${cTravellers ? `👥 *Travellers:* ${cTravellers}\n` : ''}${cMsg ? `💬 *Message:* ${cMsg}\n` : ''}Please get back to me.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('✅ Opening WhatsApp!');
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [emblaSelected, setEmblaSelected] = useState(0);
  const [emblaPaused, setEmblaPaused] = useState(false);

  useEffect(() => { if (!emblaApi) return; const s = () => setEmblaSelected(emblaApi.selectedScrollSnap()); emblaApi.on('select', s); s(); }, [emblaApi]);
  useEffect(() => { if (!emblaApi || emblaPaused) return; const i = setInterval(() => emblaApi.scrollNext(), 5000); return () => clearInterval(i); }, [emblaApi, emblaPaused]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [liveMsg, setLiveMsg] = useState(0);
  useEffect(() => { const i = setInterval(() => setLiveMsg((p) => (p + 1) % LIVE_MESSAGES.length), 5000); return () => clearInterval(i); }, []);

  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  useEffect(() => { setMounted(true); }, []);

  const [showInactivity, setShowInactivity] = useState(false);
  const inactivityRef = useRef(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const reset = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (inactivityRef.current) return;
      inactivityTimer.current = setTimeout(() => { inactivityRef.current = true; setShowInactivity(true); }, window.innerWidth < 640 ? 25000 : 15000);
    };
    ['mousemove', 'scroll', 'keydown', 'click', 'touchstart'].forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { ['mousemove', 'scroll', 'keydown', 'click', 'touchstart'].forEach((e) => window.removeEventListener(e, reset)); if (inactivityTimer.current) clearTimeout(inactivityTimer.current); };
  }, []);

  const handleTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget; const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const cx = rect.width / 2; const cy = rect.height / 2;
    const rx = (y - cy) / cy * -5; const ry = (x - cx) / cx * 5;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`;
    el.style.boxShadow = `${-ry * 5}px ${rx * 5}px 30px rgba(0,0,0,0.3), 0 0 40px -4px rgba(245,158,11,0.12)`;
  }, []);
  const handleTiltReset = useCallback((e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }, []);

  useEffect(() => {
    const el = cursorGlowRef.current; if (!el) return;
    let raf: number; let mx = -500; let my = -500;
    const mm = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const anim = () => { el.style.left = `${mx}px`; el.style.top = `${my}px`; raf = requestAnimationFrame(anim); };
    window.addEventListener('mousemove', mm, { passive: true }); raf = requestAnimationFrame(anim);
    return () => { window.removeEventListener('mousemove', mm); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const createRipple = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement; const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect'; ripple.style.width = `${size}px`; ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`; ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple); setTimeout(() => ripple.remove(), 700);
    };
    const attach = () => { document.querySelectorAll('.ripple-btn').forEach((btn) => { if (!(btn as HTMLElement)._ra) { btn.addEventListener('click', createRipple); (btn as HTMLElement)._ra = true; } }); };
    attach();
    const obs = new MutationObserver(attach); obs.observe(document.body, { childList: true, subtree: true });
    return () => { document.querySelectorAll('.ripple-btn').forEach((btn) => btn.removeEventListener('click', createRipple)); obs.disconnect(); };
  }, []);

  useEffect(() => { const h = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('[data-lang]')) setLangOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);

  const handleLangChange = (code: string) => { setSelectedLang(code); setLangOpen(false); showToast(`🌐 Language: ${LANGUAGES.find((l) => l.code === code)?.label}`); };

  const [tripStep, setTripStep] = useState(0);
  const [tripState, setTripState] = useState('');
  const [tripExp, setTripExp] = useState('');
  const [tripDur, setTripDur] = useState('');
  const [tripGrp, setTripGrp] = useState('');

  const [selVehicle, setSelVehicle] = useState<(typeof VEHICLES)[0] | null>(null);
  const [vSheetOpen, setVSheetOpen] = useState(false);
  const [vImgIdx, setVImgIdx] = useState(0);

  const [gFilter, setGFilter] = useState('All');
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const fGallery = gFilter === 'All' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((p) => p.category === gFilter);

  const [floatingVisible, setFloatingVisible] = useState(false);
  useEffect(() => { const onScroll = () => { setFloatingVisible(window.scrollY > 400); }; window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);

  useEffect(() => {
    const c = particleCanvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const pts = Array.from({ length: 30 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, sz: Math.random() * 2 + 0.5, sy: -(Math.random() * 0.3 + 0.1), sx: (Math.random() - 0.5) * 0.2, op: Math.random() * 0.5 + 0.1 }));
    let aid: number;
    const anim = () => { ctx.clearRect(0, 0, c.width, c.height); pts.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fillStyle = `rgba(245,158,11,${p.op})`; ctx.fill(); p.y += p.sy; p.x += p.sx; if (p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; } }); aid = requestAnimationFrame(anim); };
    anim();
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(aid); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    const btn = ctaRef.current; if (!btn) return;
    const mm = (e: MouseEvent) => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.15}px)`; };
    const ml = () => { btn.style.transform = 'translate(0,0)'; };
    btn.addEventListener('mousemove', mm); btn.addEventListener('mouseleave', ml);
    return () => { btn.removeEventListener('mousemove', mm); btn.removeEventListener('mouseleave', ml); };
  }, []);

  /* ═════════════════════════════ RENDER ═══════════════════════════ */
  return (
    <div className="pb-mobile-bar">
      <div ref={cursorGlowRef} className="cursor-glow" />
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

            {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-2' : 'py-4 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group">
            <Image src="/logo1.png" alt="RRM Holidays" width={40} height={40} className="h-10 w-auto rounded-lg object-contain" priority />
            <span className="text-lg font-bold tracking-tight text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
          </a>
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={`nav-link text-sm font-medium transition-colors ${activeSection === link.href.replace('#', '') ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'}`}>{link.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full text-stone-400 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 transition-all" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
            <div className="hidden lg:block relative" data-lang>
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-400 hover:text-white border border-white/10 hover:border-white/20 transition-all">
                <Globe size={13} /><span>{LANGUAGES.find((l) => l.code === selectedLang)?.native}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-1.5 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-xl z-50">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => handleLangChange(lang.code)} className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedLang === lang.code ? 'text-amber-400 bg-amber-500/10' : 'text-stone-300 hover:text-white hover:bg-white/5'}`}>{lang.label}</button>
                  ))}
                </div>
              )}
            </div>
            {!mounted || !session ? (
              <>
                <Link href="/login" className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-all">Login</Link>
                <Link href="/signup" className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">Sign Up</Link>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href={(session.user as { role?: string })?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-all">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">{session.user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="px-3 py-2 rounded-full text-sm text-stone-500 hover:text-red-400 hover:bg-red-500/5 transition-all">Logout</button>
              </div>
            )}
            <a href="#contact" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all ripple-btn">Get Quote</a>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-stone-300 hover:text-white p-2" aria-label="Open menu"><Menu size={22} /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu fixed inset-0 z-[60] ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-neutral-900/95 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-bold text-stone-100">RRM <span className="text-amber-400">Holidays</span></span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-stone-400 hover:text-white"><X size={22} /></button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">{link.label}</a>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 mb-4 mt-4">
            {FLOATING_ICONS.map((item) => (
              <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} onClick={() => { if (!item.href.startsWith('http')) setMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center text-white`}><item.icon size={18} /></div>
                <span className="text-sm font-medium text-stone-300">{item.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-auto space-y-2">
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-stone-400 hover:text-amber-400 hover:bg-white/5 text-sm font-medium">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            )}
            {!mounted || !session ? (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-3 rounded-full text-stone-300 font-medium text-sm hover:bg-white/5">Login</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block text-center py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm">Sign Up</Link>
              </>
            ) : (
              <>
                <Link href={(session.user as { role?: string })?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="block text-center py-3 rounded-full text-stone-300 font-medium text-sm hover:bg-white/5">Dashboard</Link>
                <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="block w-full text-center py-3 rounded-full text-red-400 font-medium text-sm hover:bg-red-500/5">Logout</button>
              </>
            )}
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-center py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm">Get Quote</a>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="hero-video">
          <video ref={videoRef} autoPlay muted loop playsInline onLoadedData={() => { if (videoRef.current) videoRef.current.classList.add('loaded'); if (fallbackRef.current) fallbackRef.current.classList.add('hidden'); }} className="object-cover w-full h-full">
            <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div ref={fallbackRef} className="hero-video-fallback absolute inset-0">
          <Image src="/hero-mysuru.jpg" alt="Mysuru Palace" fill className="object-cover object-center animate-ken-burns" priority sizes="100vw" />
        </div>
        <div className="hero-overlay absolute inset-0" />
        <canvas ref={particleCanvasRef} className="hero-particles" suppressHydrationWarning />
        <div className="absolute top-[20%] left-[10%] float-icon animate-float-icon-1"><Plane size={32} className="text-amber-400/20" /></div>
        <div className="absolute top-[35%] right-[15%] float-icon animate-float-icon-2"><Car size={28} className="text-amber-400/15" /></div>
        <div className="absolute bottom-[40%] left-[20%] float-icon animate-float-icon-3"><MapPin size={26} className="text-amber-400/15" /></div>
        <div className="absolute top-[60%] right-[25%] float-icon animate-float-icon-1"><Compass size={24} className="text-amber-400/10" /></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl animate-morph" />
        <div ref={heroContentRef} className="hero-parallax-content relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24 pb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-stone-300 mb-6">
            <Sparkles size={14} className="text-amber-400" /> Based in Mysuru &bull; Serving South India
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-shimmer">{typedText}</span><span className="animate-blink-cursor text-amber-400">|</span>
            <br /><span className="text-gradient-warm">Your Dream Vacation</span>
          </h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Curated tours across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana &amp; Goa. Your dream vacation starts here.
          </p>
          <a ref={ctaRef} href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi RRM Holidays! I'd like to plan a trip. Please help me with a custom itinerary.")}`} target="_blank" rel="noopener noreferrer" className="magnetic-btn inline-flex items-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-green-600 text-white font-bold text-sm sm:text-base hover:bg-green-500 transition-all animate-glow-pulse-green ripple-btn">
            <MessageCircle size={18} /> Plan Your Trip on WhatsApp
          </a>
          <div className="mt-4">
            <a href="#destinations" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/20 text-stone-300 font-medium text-sm hover:bg-white/5 hover:text-white transition-all ripple-btn">Explore Destinations <ArrowRight size={16} /></a>
          </div>
           <div suppressHydrationWarning className="flex flex-wrap justify-center gap-3 md:gap-6 mt-8 reveal">
            {[
              { icon: <Shield size={18} />, text: 'Verified Partner', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
              { icon: <Star size={18} />, text: '4.9★ Google Rating', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
              { icon: <Users size={18} />, text: '100+ Customers', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
              { icon: <Clock size={18} />, text: '24/7 Support', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
            ].map((badge) => (
              <div key={badge.text} className={`trust-badge inline-flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-full border text-[10px] md:text-xs font-semibold ${badge.color}`}>
                <span className="trust-badge-icon flex items-center justify-center">{badge.icon}</span>{badge.text}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 reveal">
            <span className="pulse-dot w-2 h-2 rounded-full bg-green-500" />
            <p className="text-xs text-stone-500">{LIVE_MESSAGES[liveMsg]}</p>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-stone-500 text-xs">Scroll to Explore</span><ChevronDown size={18} className="text-stone-500" />
          </div>
        </div>
      </section>

      <div className="section-separator" />

            {/* SMART SEARCH */}
      <section id="search" className="relative py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">Smart Search</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">Discover Your <span className="text-gradient-warm">Perfect Journey</span></h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">Search destinations, vehicles, and experiences across South India</p>
          </div>
          <div className="reveal stagger-2 max-w-2xl mx-auto" ref={searchRef}>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
              <input suppressHydrationWarning type="text" placeholder="Search destinations, vehicles, experiences..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 text-stone-200 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500/40 transition-all" />
              {searchOpen && filteredSearch.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
                  {filteredSearch.map((item, idx) => (
                    <button key={idx} onClick={() => { setSearchQuery(''); setSearchOpen(false); window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in ${item.name} (${item.type}${item.state ? ', ' + item.state : ''}). Please share details.`)}`, '_blank'); }} className="search-result-item w-full text-left">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative"><Image src={item.img} alt={item.name} fill className="object-cover" sizes="48px" loading="lazy" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-200">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.type}{item.state ? ` · ${item.state}` : ''}</p>
                      </div>
                      <ArrowRight size={14} className="text-stone-600 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {['All', 'Places', 'Vehicles', 'Experiences'].map((f) => (
                <button key={f} onClick={() => { setActiveFilter(f); setSearchOpen(true); }} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeFilter === f ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300' : 'bg-white/5 border border-white/10 text-stone-400 hover:text-stone-200'}`}>{f}</button>
              ))}
            </div>
          </div>
          {searchQuery.length === 0 && activeFilter === 'All' && (
            <div className="reveal stagger-3 grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-4xl mx-auto">
              {SEARCH_DATA.slice(0, 8).map((item, idx) => (
                <button key={idx} onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in ${item.name}. Please share details.`)}`, '_blank')} className="group rounded-xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-3d text-left">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 20vw" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/80 backdrop-blur-sm">{item.type}</span>
                    <span className="absolute bottom-2 left-2 text-lg">{item.icon}</span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    {item.state && <p className="text-xs text-stone-500 mt-0.5">{item.state}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {activeFilter !== 'All' && searchQuery.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-4xl mx-auto">
              {filteredSearch.map((item, idx) => (
                <button key={idx} onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in ${item.name}. Please share details.`)}`, '_blank')} className="group rounded-xl overflow-hidden bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-3d text-left">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 20vw" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/80 backdrop-blur-sm">{item.type}</span>
                    <span className="absolute bottom-2 left-2 text-lg">{item.icon}</span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    {item.state && <p className="text-xs text-stone-500 mt-0.5">{item.state}</p>}
                  </div>
                </button>
              ))}
              {filteredSearch.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-stone-500 text-sm">No results found for &quot;{activeFilter}&quot;</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-20 md:py-32">
        <div className="grid-pattern absolute inset-0 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="reveal stagger-1 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image src="/mysuru-palace.jpg" alt="Mysuru Palace" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6"><span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold text-amber-400"><MapPin size={14} />Our Home Base — Mysuru</span></div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-amber-500/10 rounded-2xl animate-rotate-slow" />
            </div>
            <div>
              <div className="reveal stagger-2">
                <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">About Us</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-6 leading-tight">Born In Mysuru, <span className="text-gradient-warm">Serving</span> South India</h2>
              </div>
              <div className="reveal stagger-3 space-y-4 text-stone-400 leading-relaxed mb-8">
                <p>RRM Holidays was founded with a simple vision — to share the beauty, culture and warmth of South India with travellers from across the world. Based in the royal city of Mysuru, we bring deep local knowledge and genuine hospitality to every tour.</p>
                <p>With  experience and operations across 6 South Indian states, we&apos;ve helped over 5000 travellers create unforgettable memories. From misty hills to golden beaches, we craft each journey with passion and precision.</p>
              </div>
              <div className="reveal stagger-4 grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: UserCheck, title: 'Expert Drivers', desc: 'Professional, bilingual drivers' },
                  { icon: Headphones, title: '24/7 Support', desc: 'Always available for you' },
                  { icon: Route, title: 'Custom Itineraries', desc: 'Tailored to your preferences' },
                  { icon: Award, title: 'Best Value', desc: 'Transparent, custom quotations' },
                ].map((feat) => (
                  <div key={feat.title} className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-3d">
                    <feat.icon size={20} className="text-amber-400 mb-2" />
                    <div className="text-sm font-semibold text-stone-200 mb-0.5">{feat.title}</div>
                    <div className="text-xs text-stone-500">{feat.desc}</div>
                  </div>
                ))}
              </div>
              <a href="#destinations" className="reveal stagger-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all ripple-btn">Explore Destinations <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* DESTINATIONS */}
      <section id="destinations" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">Destinations</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">Explore <span className="text-gradient-warm">South India</span></h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">Click on any state to discover its top destinations, plan your trip, and book with us instantly.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {STATE_CARDS.map((state, idx) => (
              <Link key={state.slug} href={`/destinations/${state.slug}`} onMouseMove={handleTilt} onMouseLeave={handleTiltReset} className={`reveal stagger-${Math.min(idx + 2, 7)} group dest-card-premium rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/5 block cursor-pointer`}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={state.img} alt={state.name} fill className="pkg-img object-cover" sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <span className={`absolute top-2 left-2 category-tag ${state.tagColor}`}>{state.icon} {state.tag}</span>
                  {state.popular && <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider bg-amber-500">Popular</span>}
                  <div className="absolute bottom-2 left-3 right-3 z-[2]">
                    <h3 className="text-base md:text-lg font-bold text-white">{state.name}</h3>
                    <p className="text-xs text-stone-300 flex items-center gap-1 mt-1"><MapPin size={10} />{state.places} Top Places</p>
                  </div>
                  <div className="dest-explore-overlay">
                    <span className="text-sm font-semibold text-amber-300 flex items-center gap-1">Explore More <ArrowRight size={14} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 ripple-btn">View All Destinations <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* MAP EXPLORER */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2"><Compass size={16} /> Interactive Explorer</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">Explore South India <span className="text-gradient-warm">on the Map</span></h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">{ALL_MARKERS_COUNT} destinations across 5 states — click any marker to discover and explore.</p>
          </div>
          <div className="reveal stagger-2"><IndiaMap /></div>
        </div>
      </section>

      <div className="section-separator" />

      {/* TRIP PLANNER */}
      <section id="trip-planner" className="relative py-20 md:py-32 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">Trip Planner</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">Build Your <span className="text-gradient-warm">Dream Trip</span></h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">Choose your preferences and we&apos;ll create a custom itinerary via WhatsApp.</p>
          </div>
          <div className="reveal stagger-2 flex items-center justify-center gap-2 mb-10">
            {[0, 1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${tripStep > step ? 'bg-green-600 text-white' : tripStep === step ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-stone-500'}`}>
                  {tripStep > step ? <CheckCircle2 size={16} /> : step + 1}
                </div>
                {step < 3 && <div className={`w-12 h-0.5 rounded transition-all ${tripStep > step ? 'bg-green-600' : 'bg-neutral-800'}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="reveal stagger-3 glass rounded-2xl p-6 md:p-8">
            {tripStep === 0 && (
              <div className="animate-scale-in">
                <h3 className="text-lg font-bold text-stone-200 mb-4">1. Select Your Destination State</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Karnataka', 'Kerala', 'Tamil Nadu', 'Goa', 'Andhra Pradesh'].map((s) => (
                    <button key={s} onClick={() => { setTripState(s); setTripStep(1); }} className={`p-3 rounded-xl border text-sm font-medium transition-all ripple-btn ${tripState === s ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-neutral-900/60 border-white/10 text-stone-300 hover:border-amber-500/30'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {tripStep === 1 && (
              <div className="animate-scale-in">
                <h3 className="text-lg font-bold text-stone-200 mb-4">2. What Experience Are You Looking For?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Wildlife', 'Beaches', 'Heritage', 'Hill Stations', 'Temples', 'Adventure'].map((e) => (
                    <button key={e} onClick={() => { setTripExp(e); setTripStep(2); }} className={`p-3 rounded-xl border text-sm font-medium transition-all ripple-btn ${tripExp === e ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-neutral-900/60 border-white/10 text-stone-300 hover:border-amber-500/30'}`}>{e}</button>
                  ))}
                </div>
                <button onClick={() => setTripStep(0)} className="mt-4 text-sm text-stone-500 hover:text-stone-300 transition-colors">&larr; Back</button>
              </div>
            )}
            {tripStep === 2 && (
              <div className="animate-scale-in">
                <h3 className="text-lg font-bold text-stone-200 mb-4">3. How Long Is Your Trip?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['1-2 Days', '3-5 Days', '5-7 Days', '7+ Days'].map((d) => (
                    <button key={d} onClick={() => { setTripDur(d); setTripStep(3); }} className={`p-3 rounded-xl border text-sm font-medium transition-all ripple-btn ${tripDur === d ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-neutral-900/60 border-white/10 text-stone-300 hover:border-amber-500/30'}`}>{d}</button>
                  ))}
                </div>
                <button onClick={() => setTripStep(1)} className="mt-4 text-sm text-stone-500 hover:text-stone-300 transition-colors">&larr; Back</button>
              </div>
            )}
            {tripStep === 3 && (
              <div className="animate-scale-in">
                <h3 className="text-lg font-bold text-stone-200 mb-4">4. What&apos;s Your Group Type?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Solo', 'Couple', 'Family (3-5)', 'Group (6-15)', 'Large (15+)'].map((g) => (
                    <button key={g} onClick={() => { setTripGrp(g); }} className={`p-3 rounded-xl border text-sm font-medium transition-all ripple-btn ${tripGrp === g ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-neutral-900/60 border-white/10 text-stone-300 hover:border-amber-500/30'}`}>{g}</button>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-neutral-900/60 border border-white/5">
                  <p className="text-xs text-stone-500 mb-2 font-semibold uppercase tracking-wider">Your Trip Summary</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div><span className="text-stone-500">State:</span> <span className="text-amber-400">{tripState}</span></div>
                    <div><span className="text-stone-500">Experience:</span> <span className="text-amber-400">{tripExp}</span></div>
                    <div><span className="text-stone-500">Duration:</span> <span className="text-amber-400">{tripDur}</span></div>
                    <div><span className="text-stone-500">Group:</span> <span className="text-amber-400">{tripGrp}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button onClick={() => setTripStep(2)} className="text-sm text-stone-500 hover:text-stone-300 transition-colors">&larr; Back</button>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`🗺️ *Custom Trip — RRM Holidays*\n\n📍 *State:* ${tripState}\n🎯 *Experience:* ${tripExp}\n📅 *Duration:* ${tripDur}\n👥 *Group:* ${tripGrp}\n\nPlease create a custom itinerary.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-500 transition-all ripple-btn animate-glow-pulse-green">
                    <MessageCircle size={16} /> Plan on WhatsApp
                  </a>
                </div>
                <button onClick={() => { setTripStep(0); setTripState(''); setTripExp(''); setTripDur(''); setTripGrp(''); }} className="mt-3 text-xs text-stone-600 hover:text-stone-400 transition-colors">Reset Planner</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="section-separator" />

        {/* VEHICLE SHOWCASE */}
<section id="vehicles" className="relative py-20 md:py-32">
  <div className="grid-pattern absolute inset-0 opacity-30" />
  <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
    <div className="text-center mb-12">
      <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400 mb-6">
        <Car size={14} /> Complete Fleet — 12 Vehicles
      </div>
      <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">
        Choose Your Perfect <span className="text-gradient-warm">Ride</span>
      </h2>
      <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">
        Browse our fleet and book instantly. No hidden fees.
      </p>
    </div>
    

    {/* BIG VIEW COMPLETE VEHICLE LINK */}
    <div className="reveal stagger-5 text-center mt-20">
       <Link 
         href="/vehicles" 
         className="inline-flex items-center gap-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:via-white hover:to-amber-300 transition-all duration-300 group pb-2 border-b-4 border-transparent hover:border-amber-500/30"
       >
         View Complete Vehicle Fleet
         <ArrowRight size={36} className="text-amber-500 group-hover:translate-x-2 group-hover:text-amber-400 transition-all duration-300" />
       </Link>
       <p className="mt-4 text-sm text-stone-500 font-medium">Explore all 12 vehicles including Luxury Coaches & Urbania</p>
    </div>

  </div>
</section>

      <Sheet open={vSheetOpen} onOpenChange={setVSheetOpen}>
        <SheetContent side="right" className="bg-neutral-950 border-white/10 w-full sm:max-w-lg overflow-y-auto">
          {selVehicle && (
            <>
              <SheetHeader><SheetTitle className="text-stone-100">{selVehicle.model}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-6">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900">
                  <Image src={(VEHICLE_VIEWS[selVehicle.id] || [selVehicle.img])[vImgIdx % (VEHICLE_VIEWS[selVehicle.id] || [selVehicle.img]).length]} alt={selVehicle.model} fill className="object-cover transition-transform duration-500" sizes="(max-width:640px) 100vw, 512px" loading="lazy" />
                  {(VEHICLE_VIEWS[selVehicle.id] || [selVehicle.img]).length > 1 && (
                    <>
                      <button onClick={() => setVImgIdx(p => p - 1 < 0 ? (VEHICLE_VIEWS[selVehicle.id] || [selVehicle.img]).length - 1 : p - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-all"><ChevronLeft size={16} /></button>
                      <button onClick={() => setVImgIdx(p => (p + 1) % (VEHICLE_VIEWS[selVehicle.id] || [selVehicle.img]).length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-all"><ChevronRight size={16} /></button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">{(VEHICLE_VIEWS[selVehicle.id] || [selVehicle.img]).map((_, i) => (<span key={i} onClick={() => setVImgIdx(i)} className={`vehicle-slider-dot ${vImgIdx % (VEHICLE_VIEWS[selVehicle.id] || [selVehicle.img]).length === i ? 'active' : ''}`}></span>))}</div>
                    </>
                  )}
                  {selVehicle.badge && <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${selVehicle.badgeColor}`}>{selVehicle.badge}</span>}
                </div>
                <div><div className="flex items-center gap-3 mb-3"><span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">{selVehicle.type}</span><span className="text-sm text-stone-400">{selVehicle.seats}</span></div><p className="text-sm text-stone-400 leading-relaxed">{selVehicle.desc}</p></div>
                <div><h4 className="text-sm font-semibold text-stone-200 mb-3">Features</h4><div className="grid grid-cols-2 gap-2">{selVehicle.features.map((f) => (<div key={f} className="flex items-center gap-2 text-sm text-stone-300"><CheckCircle2 size={14} className="text-green-500" />{f}</div>))}</div></div>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in ${selVehicle.model} (${selVehicle.type}, ${selVehicle.seats}). Please share a custom quote.`)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-500 transition-all ripple-btn animate-glow-pulse-green"><MessageCircle size={16} /> Book This Vehicle</a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <div className="section-separator" />

      {/* AI TOOLS */}
      <section id="ai-tools" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-wider uppercase"><Sparkles size={14} /> AI-Powered Travel Tools</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">Smart <span className="text-gradient-warm">Travel Planning</span></h2>
            <p className="reveal stagger-2 text-stone-400 max-w-2xl mx-auto">Our AI tools help you explore, plan, and book — all for free.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_TOOLS.map((tool, idx) => (
              <a key={tool.title} href={tool.link} className={`reveal stagger-${Math.min(idx + 2, 7)} group card-premium rounded-2xl p-6 block`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors"><tool.icon size={22} /></div>
                  {tool.badge && <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider ${tool.badgeColor}`}>{tool.badge}</span>}
                </div>
                <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors mb-2">{tool.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">{tool.desc}</p>
                <span className="text-sm font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">Try Now <ArrowRight size={14} /></span>
              </a>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to explore your AI tools. Please help me plan my trip.')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 ripple-btn">Explore All AI Tools <Sparkles size={16} /></a>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* TESTIMONIALS */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">Testimonials</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">What Our <span className="text-gradient-warm">Travellers</span> Say</h2>
            <div className="reveal stagger-2 flex items-center justify-center gap-2 mt-2 mb-4">
              <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={16} className="text-amber-400 fill-amber-400" />))}</div>
              <span className="text-sm font-bold text-stone-200">4.9/5</span>
              <span className="text-xs text-stone-500">from 500+ reviews</span>
            </div>
          </div>
          <div className="reveal stagger-2 max-w-3xl mx-auto relative">
            <div className="embla" ref={emblaRef} onMouseEnter={() => setEmblaPaused(true)} onMouseLeave={() => setEmblaPaused(false)}>
              <div className="embla__container">
                {TESTIMONIALS.map((t, idx) => (
                  <div key={idx} className="embla__slide">
                    <div className="testimonial-card bg-neutral-900/80 backdrop-blur border border-white/5 rounded-2xl overflow-hidden">
                      <div className="relative h-48 overflow-hidden"><Image src={t.tripImg} alt={t.trip} fill className="object-cover" sizes="80vw" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" /></div>
                      <div className="p-6 pt-2">
                        <div className="flex items-center gap-1 mb-3">{Array.from({ length: t.rating }).map((_, i) => (<Star key={i} size={14} className="text-amber-400 fill-amber-400" />))}</div>
                        <p className="text-sm text-stone-400 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-sm font-bold">{t.name.charAt(0)}</div><div><p className="text-sm font-semibold text-stone-200">{t.name}</p><p className="text-xs text-stone-500">{t.trip}</p></div></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-stone-400 hover:text-white transition-all active:scale-90"><ChevronLeft size={16} /></button>
            <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-stone-400 hover:text-white transition-all active:scale-90"><ChevronRight size={16} /></button>
            <div className="flex items-center justify-center gap-2 mt-6">{TESTIMONIALS.map((_, idx) => (<span key={idx} onClick={() => emblaApi?.scrollTo(idx)} className={emblaSelected === idx ? "embla__dot embla__dot--selected" : "embla__dot"}></span>))}</div>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* TRUST BADGES */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">Trusted by Thousands</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl font-extrabold mt-3 mb-4">Why Travellers <span className="text-gradient-warm">Choose RRM</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Shield size={24} />, title: 'Verified Travel Partner', desc: 'Government registered & fully insured travel company', stat: '2+ Years', color: 'text-emerald-400' },
              { icon: <Star size={24} />, title: 'Google Rating', desc: 'Rated excellent by 100+ travellers on Google', stat: '100+ Reviews', color: 'text-amber-400' },
              { icon: <ThumbsUp size={24} />, title: '100% Satisfaction', desc: 'All travellers recommend us to friends & family', stat: '100%', color: 'text-blue-400' },
              { icon: <TrendingUp size={24} />, title: 'Growing Every Month', desc: 'Serving 5000+ happy travellers every month', stat: '5000+', color: 'text-violet-400' },
            ].map((item, idx) => (
              <div key={idx} className={`reveal stagger-${Math.min(idx + 2, 7)} google-trust-badge p-5 flex flex-col items-center text-center gap-3`}>
                <div className={`${item.color}`}>{item.icon}</div>
                <div><p className="text-xl font-extrabold text-stone-100">{item.stat}</p><p className="text-sm font-semibold text-stone-300 mt-1">{item.title}</p><p className="text-xs text-stone-500 mt-2 leading-relaxed">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* GALLERY */}
      <section id="gallery" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">Gallery</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">Captured <span className="text-gradient-warm">Moments</span></h2>
          </div>
          <div className="reveal stagger-2 flex flex-wrap justify-center gap-2 mb-8">{GALLERY_FILTERS.map((f) => (<button key={f} onClick={() => setGFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${gFilter === f ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300' : 'bg-white/5 border border-white/10 text-stone-400 hover:text-stone-200'}`}>{f}</button>))}</div>
          <div className="masonry-grid">
            {fGallery.map((photo, idx) => (
              <div key={idx} className="reveal group relative rounded-xl overflow-hidden cursor-pointer hover-lift" onClick={() => setLightbox(photo)} style={{ aspectRatio: photo.tall ? '3/4' : '4/3' }}>
                <Image src={photo.src} alt={photo.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div className="flex items-center gap-1"><Camera size={12} className="text-white" /><p className="text-xs font-semibold text-white">{photo.alt}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="bg-black/95 border-white/10 max-w-4xl p-0 overflow-hidden">
          {lightbox && (
            <div className="relative aspect-[16/10]">
              <Image src={lightbox.src} alt={lightbox.alt} fill className="object-cover" sizes="80vw" />
              <div className="absolute bottom-4 left-4"><p className="text-sm font-semibold text-white">{lightbox.alt}</p></div>
              <button onClick={() => { const idx = fGallery.findIndex((p) => p.src === lightbox?.src); if (idx < fGallery.length - 1) setLightbox(fGallery[idx + 1]); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-amber-400"><ChevronRight size={20} /></button>
              <button onClick={() => { const idx = fGallery.findIndex((p) => p.src === lightbox?.src); if (idx > 0) setLightbox(fGallery[idx - 1]); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-amber-400"><ChevronLeft size={20} /></button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="section-separator" />

      {/* TRUST & ENGAGEMENT */}
      <section className="relative py-20 md:py-28">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="reveal"><h2 className="text-3xl md:text-4xl font-extrabold mb-4">Trusted by <span className="text-gradient-warm">Thousands</span></h2><p className="text-stone-400 max-w-xl mx-auto mb-10">Join the growing family of happy travellers who trust RRM Holidays for their South India adventures.</p></div>
          <div className="reveal stagger-2 flex items-center justify-center gap-2 mb-4"><div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={18} className="text-amber-400 fill-amber-400" />))}</div><span className="text-lg font-bold text-stone-200 ml-1">4.9</span><span className="text-sm text-stone-500">/ 5.0</span></div>
          <div className="reveal stagger-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"><CheckCircle2 size={14} /> Verified by Google</div>
          <div className="reveal stagger-4 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 max-w-2xl mx-auto">
            {[
              { icon: Shield, text: '100% Safe & Secure' },
              { icon: ThumbsUp, text: 'No Hidden Charges' },
              { icon: Headphones, text: '24/7 Travel Support' },
            ].map((f) => (<div key={f.text} className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900/60 border border-white/5"><f.icon size={18} className="text-amber-400 shrink-0" /><span className="text-sm text-stone-300">{f.text}</span></div>))}
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* CONTACT */}
      <section id="contact" className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal text-amber-400 text-sm font-semibold tracking-wider uppercase">Contact</span>
            <h2 className="reveal stagger-1 text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-4">Let&apos;s Plan Your <span className="text-gradient-warm">Journey</span></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 reveal stagger-2">
              <div className="glass rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="relative"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" /><select suppressHydrationWarning value={cDest} onChange={(e) => setCDest(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer"><option value="">Select Destination</option>{DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div className="relative"><Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" /><input suppressHydrationWarning type="date" value={cDate} onChange={(e) => setCDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" /></div>
                  <input suppressHydrationWarning type="text" placeholder="Your Name *" value={cName} onChange={(e) => setCName(e.target.value)} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200" />
                  <input suppressHydrationWarning type="tel" placeholder="Phone Number *" value={cPhone} onChange={(e) => setCPhone(e.target.value)} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200" />
                  <input suppressHydrationWarning type="email" placeholder="Email Address" value={cEmail} onChange={(e) => setEmail(e.target.value)} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200" />
                  <div className="relative"><Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" /><input suppressHydrationWarning type="number" placeholder="No. of Travellers" min="1" value={cTravellers} onChange={(e) => setCTravellers(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" /></div>
                </div>
                <textarea suppressHydrationWarning placeholder="Tell us about your trip..." value={cMsg} onChange={(e) => setCMsg(e.target.value)} rows={3} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 mb-4 resize-none" />
                <button onClick={handleContactSubmit} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3.5 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all ripple-btn"><Send size={16} /> Send Enquiry via WhatsApp</button>
              </div>
            </div>
            <div className="lg:col-span-2 reveal stagger-3 space-y-4">
              {[
                { icon: Phone, label: 'Call Us', value: '+91 91085 97154', href: 'tel:+919108597154', color: 'text-amber-400' },
                { icon: MessageCircle, label: 'WhatsApp', value: '+91 91085 97154', href: `https://wa.me/${WHATSAPP_NUMBER}`, color: 'text-green-400' },
                { icon: Mail, label: 'Email', value: 'rrmholidays06@yahoo.com', href: 'mailto:rrmholidays06@yahoo.com', color: 'text-blue-400' },
                { icon: MapPin, label: 'Location', value: 'Mysuru, Karnataka, India', href: '#', color: 'text-rose-400' },
              ].map((c) => (
                <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/20 transition-all hover-3d group">
                  <div className={`w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center ${c.color} group-hover:scale-110 transition-transform`}><c.icon size={18} /></div>
                  <div><p className="text-xs text-stone-500">{c.label}</p><p className="text-sm font-semibold text-stone-200">{c.value}</p></div>
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <a href="https://instagram.com/rrmholidays" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-stone-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"><Instagram size={18} /></a>
                <a href="https://youtube.com/@rrmholidays" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Youtube size={18} /></a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-stone-400 hover:text-green-400 hover:bg-green-500/10 transition-all"><MessageCircle size={18} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

         {/* FOOTER */}
      <footer className="relative border-t border-white/5 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4"><Image src="/logo.png" alt="RRM Holidays" width={32} height={32} className="h-8 w-auto rounded-lg object-contain" loading="lazy" /><span className="text-lg font-bold text-stone-100">RRM <span className="text-amber-400">Holidays</span></span></div>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">Premium South India travel experiences. Based in Mysuru, serving 6 states with passion and expertise.</p>
              <div className="flex items-center gap-3">
                <a 
  href="https://www.instagram.com/rrmholidays?igsh=MXg0YmNmc3Z4YTAzZA==" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="text-stone-500 hover:text-pink-400 transition-colors"
>
  <Instagram size={18} />
</a>
                <a href="https://youtube.com/@rrmholidays" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-red-400 transition-colors"><Youtube size={18} /></a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-green-400 transition-colors"><MessageCircle size={18} /></a>
              </div>
            </div>
            <div><h4 className="text-sm font-bold text-stone-200 mb-4">Quick Links</h4><div className="flex flex-col gap-2">{NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} className="text-sm text-stone-500 hover:text-amber-400 transition-colors">{link.label}</Link>))}</div></div>
            <div><h4 className="text-sm font-bold text-stone-200 mb-4">Top Destinations</h4><div className="flex flex-col gap-2">{STATE_CARDS.map((s) => (<Link key={s.slug} href={`/destinations/${s.slug}`} className="text-sm text-stone-500 hover:text-amber-400 transition-colors">{s.icon} {s.name}</Link>))}</div></div>
            <div><h4 className="text-sm font-bold text-stone-200 mb-4">Contact Info</h4><div className="flex flex-col gap-3 text-sm text-stone-500"><div className="flex items-center gap-2"><Phone size={14} className="text-amber-400" /> +91 91085 97154</div><div className="flex items-center gap-2"><Mail size={14} className="text-amber-400" /> rrmholidays06@yahoo.com</div><div className="flex items-center gap-2"><MapPin size={14} className="text-amber-400" /> Mysuru, Karnataka, India</div><div className="flex items-center gap-2"><Clock size={14} className="text-amber-400" /> 24/7 Available</div></div></div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center"><p className="text-xs text-stone-600">&copy; {new Date().getFullYear()} RRM Holidays. All rights reserved. Made with ❤️ in Mysuru, India.</p></div>
        </div>
      </footer>

      

      {/* BACK TO TOP */}
      {backToTop && (<button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full glass flex items-center justify-center text-stone-400 hover:text-amber-400 transition-all active:scale-90" aria-label="Back to top"><ChevronUp size={18} /></button>)}

      
      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-xs z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (<div key={t.id} className="toast glass rounded-xl px-4 py-3 text-sm text-stone-200 border border-white/10 shadow-xl">{t.msg}</div>))}
      </div>

                {/* BOOKING DIALOG */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="bg-neutral-950 border-white/10 max-w-lg">
          <DialogHeader><DialogTitle className="text-stone-100">Quick Booking</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="relative"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" /><select suppressHydrationWarning value={bDest} onChange={(e) => setBDest(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer"><option value="">Destination *</option>{DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="relative"><Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" /><input suppressHydrationWarning type="date" value={bDate} onChange={(e) => setBDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200" /></div>
            <div className="relative"><Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" /><select suppressHydrationWarning value={bMembers} onChange={(e) => setBMembers(e.target.value)} className="search-input w-full pl-9 pr-3 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer"><option value="">Travellers *</option><option>1 Person</option><option>2 Persons</option><option>3-5 Persons</option><option>6-10 Persons</option><option>11-20 Persons</option><option>21-35 Persons</option><option>35+ Persons</option></select></div>
            <input suppressHydrationWarning type="text" placeholder="Your Name" value={bName} onChange={(e) => setBName(e.target.value)} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200" />
            <input suppressHydrationWarning type="tel" placeholder="Phone Number" value={bPhone} onChange={(e) => setBPhone(e.target.value)} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200" />
            <select suppressHydrationWarning value={bVehicle} onChange={(e) => setBVehicle(e.target.value)} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 appearance-none cursor-pointer"><option value="">Vehicle (Optional)</option><option>Sedan (Etios/Dzire)</option><option>Innova</option><option>Innova Crysta</option><option>Tempo Traveller</option><option>Force Urbania</option><option>Mini Bus</option><option>Bus</option><option>Luxury Coach</option><option>Need Suggestion</option></select>
            <textarea suppressHydrationWarning placeholder="Special Requests" value={bNotes} onChange={(e) => setBNotes(e.target.value)} rows={2} className="search-input w-full px-4 py-3 rounded-xl text-sm text-stone-200 resize-none" />
            <button onClick={() => { handleBookingSubmit(); setBookingOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-500 transition-all ripple-btn"><MessageCircle size={16} /> Enquire on WhatsApp</button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}