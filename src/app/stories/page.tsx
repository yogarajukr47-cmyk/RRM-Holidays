'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '919108597154';

const STORIES = [
  { id: 'karnataka', title: 'Karnataka', emoji: '🏛️', coverImg: '/states/karnataka-cover.jpg', slides: [
    { img: '/gallery-1-mysuru-palace.jpg', place: 'Mysuru Palace', desc: 'Walk through the magnificent Amba Vilas Palace — a masterpiece of Indo-Saracenic architecture', location: 'Mysuru' },
    { img: '/gallery-3-hampi-ruins.jpg', place: 'Hampi Ruins', desc: 'Explore the ancient Vijayanagara Empire — boulders, temples, sunset from Hemakuta Hill', location: 'Hampi' },
    { img: '/gallery-4-coorg-hills.jpg', place: 'Coorg Hills', desc: 'Coffee estates, misty mornings, cascading waterfalls', location: 'Coorg' },
    { img: '/gallery-8-temple.jpg', place: 'Chikmagalur', desc: "Trek Mullayanagiri — Karnataka's highest peak, coffee blossoms", location: 'Chikmagalur' },
  ]},
  { id: 'kerala', title: 'Kerala', emoji: '🛶', coverImg: '/states/kerala-cover.jpg', slides: [
    { img: '/gallery-2-kerala-backwater.jpg', place: 'Alleppey Backwaters', desc: 'Drift through serene backwaters on a traditional houseboat', location: 'Alleppey' },
    { img: '/gallery-7-munnar-tea.jpg', place: 'Munnar Tea Gardens', desc: 'Rolling green tea plantations stretching to the horizon', location: 'Munnar' },
    { img: '/gallery-5-goa-beach.jpg', place: 'Kovalam Beach', desc: 'Golden sands and shallow lagoons — perfect for swimming', location: 'Kovalam' },
    { img: '/gallery-4-coorg-hills.jpg', place: 'Thekkady', desc: 'Spice plantations and Periyar Wildlife Sanctuary', location: 'Thekkady' },
  ]},
  { id: 'tamilnadu', title: 'Tamil Nadu', emoji: '🛕', coverImg: '/states/tamilnadu-cover.jpg', slides: [
    { img: '/gallery-8-temple.jpg', place: 'Meenakshi Temple', desc: 'Towering gopurams of this ancient Dravidian masterpiece', location: 'Madurai' },
    { img: '/gallery-6-ooty-train.jpg', place: 'Nilgiri Railway', desc: 'UNESCO toy train through misty tunnels and tea mountains', location: 'Ooty' },
    { img: '/gallery-5-goa-beach.jpg', place: 'Marina Beach', desc: "India's longest urban beach — 13km of golden sand", location: 'Chennai' },
    { img: '/gallery-4-coorg-hills.jpg', place: 'Kodaikanal', desc: "Princess of Hill Stations — star-shaped lake, Coaker's Walk", location: 'Kodaikanal' },
  ]},
  { id: 'goa', title: 'Goa', emoji: '🏖️', coverImg: '/states/goa-cover.jpg', slides: [
    { img: '/gallery-5-goa-beach.jpg', place: 'Baga Beach', desc: 'Golden sand, beach shacks, parasailing, and sunsets', location: 'North Goa' },
    { img: '/gallery-8-temple.jpg', place: 'Old Goa Churches', desc: 'Portuguese history at Basilica of Bom Jesus — UNESCO Heritage', location: 'Old Goa' },
    { img: '/gallery-4-coorg-hills.jpg', place: 'Dudhsagar Falls', desc: 'Milky-white waterfall cascading from 310m height', location: 'Goa border' },
    { img: '/gallery-5-goa-beach.jpg', place: 'Palolem Beach', desc: 'Crescent-shaped paradise — silent disco, dolphin spotting', location: 'South Goa' },
  ]},
  { id: 'andhra', title: 'Andhra', emoji: '⛰️', coverImg: '/states/andhra-cover.jpg', slides: [
    { img: '/gallery-8-temple.jpg', place: 'Tirupati Temple', desc: "Sacred Seven Hills — one of world's most visited temples", location: 'Tirupati' },
    { img: '/gallery-4-coorg-hills.jpg', place: 'Araku Valley', desc: 'Coffee plantations, Borra Caves, tribal culture', location: 'Araku' },
    { img: '/gallery-8-temple.jpg', place: 'Gandikota Gorge', desc: "India's Grand Canyon — emerald Penna River below", location: 'Gandikota' },
  ]},
];

const SLIDE_DURATION = 5000;

export default function StoriesPage() {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const storyIndex = STORIES.findIndex(s => s.id === activeStory);
  const currentStory = storyIndex >= 0 ? STORIES[storyIndex] : null;
  const slide = currentStory?.slides[currentSlide];

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const closeStory = useCallback(() => {
    clearAllTimers();
    setActiveStory(null);
    setCurrentSlide(0);
    setProgress(0);
    setIsPaused(false);
    setIsTransitioning(false);
    document.body.style.overflow = '';
  }, [clearAllTimers]);

  const openStory = useCallback((storyId: string) => {
    setActiveStory(storyId);
    setCurrentSlide(0);
    setProgress(0);
    setIsPaused(false);
    setIsTransitioning(false);
    setViewedStories(prev => new Set([...prev, storyId]));
    document.body.style.overflow = 'hidden';
  }, []);

  const goToSlide = useCallback((idx: number) => {
    if (!currentStory) return;
    if (idx < 0 || idx >= currentStory.slides.length) return;
    setIsTransitioning(true);
    timerRef.current = setTimeout(() => {
      setCurrentSlide(idx);
      setProgress(0);
      setIsTransitioning(false);
    }, 150);
  }, [currentStory]);

  const goNextStory = useCallback(() => {
    if (storyIndex < STORIES.length - 1) {
      const nextStory = STORIES[storyIndex + 1];
      setActiveStory(nextStory.id);
      setCurrentSlide(0);
      setProgress(0);
      setIsTransitioning(false);
      setViewedStories(prev => new Set([...prev, nextStory.id]));
    } else {
      closeStory();
    }
  }, [storyIndex, closeStory]);

  const goNextSlide = useCallback(() => {
    if (!currentStory) return;
    if (currentSlide < currentStory.slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goNextStory();
    }
  }, [currentStory, currentSlide, goToSlide, goNextStory]);

  const goPrevSlide = useCallback(() => {
    if (!currentStory) return;
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else {
      if (storyIndex > 0) {
        const prevStory = STORIES[storyIndex - 1];
        setActiveStory(prevStory.id);
        setCurrentSlide(prevStory.slides.length - 1);
        setProgress(0);
        setIsTransitioning(false);
        setViewedStories(prev => new Set([...prev, prevStory.id]));
      }
    }
  }, [currentStory, currentSlide, storyIndex, goToSlide]);

  const goPrevStory = useCallback(() => {
    if (storyIndex > 0) {
      const prevStory = STORIES[storyIndex - 1];
      setActiveStory(prevStory.id);
      setCurrentSlide(0);
      setProgress(0);
      setIsTransitioning(false);
      setViewedStories(prev => new Set([...prev, prevStory.id]));
    }
  }, [storyIndex]);

  // Progress timer with auto-advance built into the interval callback
  useEffect(() => {
    if (!activeStory || !currentStory || isPaused) {
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
      return;
    }

    const step = 50;
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (step / SLIDE_DURATION) * 100;
        if (next >= 100) {
          // Auto-advance happens via a timeout to avoid calling setState synchronously in effect
          setTimeout(() => {
            if (currentSlide < (currentStory?.slides.length ?? 0) - 1) {
              setCurrentSlide(s => s + 1);
            } else if (storyIndex < STORIES.length - 1) {
              const nextStory = STORIES[storyIndex + 1];
              setActiveStory(nextStory.id);
              setCurrentSlide(0);
              setProgress(0);
              setIsTransitioning(false);
              setViewedStories(prev => new Set([...prev, nextStory.id]));
            } else {
              clearAllTimers();
              setActiveStory(null);
              setCurrentSlide(0);
              setProgress(0);
              setIsPaused(false);
              setIsTransitioning(false);
              document.body.style.overflow = '';
            }
          }, 0);
          return 100;
        }
        return next;
      });
    }, step);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    };
  }, [activeStory, currentSlide, isPaused, currentStory, storyIndex, clearAllTimers]);

  // Keyboard events
  useEffect(() => {
    if (!activeStory) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrevSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeStory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStory, goNextSlide, goPrevSlide, closeStory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      document.body.style.overflow = '';
    };
  }, [clearAllTimers]);

  const getWhatsAppLink = (place: string, location: string) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in visiting ${place}, ${location}. Can you help me plan this trip?`)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Destination Stories
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 mb-4">
            Explore{' '}
            <span className="text-gradient-warm">South India</span>
            {' '}Like Never Before
          </h1>
          <p className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Swipe through stunning destinations across 5 states. Each story reveals hidden gems, iconic landmarks, and unforgettable experiences.
          </p>
        </div>
      </div>

      {/* Story Thumbnails Row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 px-4 sm:px-6 lg:px-8 py-6 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {STORIES.map((story) => {
            const isViewed = viewedStories.has(story.id);
            const isActive = activeStory === story.id;
            return (
              <button
                key={story.id}
                onClick={() => openStory(story.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer outline-none`}
              >
                <div
                  className={`relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] lg:w-[88px] lg:h-[88px] rounded-full p-[3px] transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 scale-110'
                      : isViewed
                        ? 'bg-stone-600/60 group-hover:bg-stone-500'
                        : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 group-hover:scale-105'
                  }`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-800">
                    <Image
                      src={story.coverImg}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="88px"
                    />
                  </div>
                </div>
                <span className={`text-[11px] sm:text-xs font-medium transition-colors ${
                  isActive ? 'text-amber-400' : 'text-stone-400 group-hover:text-stone-200'
                }`}>
                  {story.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {[
            { value: '5', label: 'States' },
            { value: '19', label: 'Destinations' },
            { value: '∞', label: 'Memories' },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-3 px-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-lg sm:text-xl font-bold text-gradient-warm">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-stone-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Cards Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-lg sm:text-xl font-semibold text-stone-200 mb-6 text-center">Browse All Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {STORIES.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => openStory(story.id)}
              className="group relative rounded-2xl overflow-hidden h-48 sm:h-56 cursor-pointer outline-none text-left card-premium"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Image
                src={story.coverImg}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{story.emoji}</span>
                  <h3 className="text-base sm:text-lg font-bold text-white">{story.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-300">
                  {story.slides.length} destinations • Swipe to explore
                </p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[10px] text-white/80 font-medium">
                <MessageCircle size={10} />
                Story
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom WhatsApp CTA */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-lg mx-auto text-center p-6 rounded-2xl glass border border-amber-500/10">
          <p className="text-stone-400 text-sm mb-4">
            Ready to explore South India? Let us craft your perfect itinerary.
          </p>
          <a
            href={getWhatsAppLink('South India', 'Multiple Destinations')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/20"
          >
            <MessageCircle size={18} />
            Plan Your Trip on WhatsApp
          </a>
        </div>
      </div>

      {/* Full-Screen Story Overlay */}
      {activeStory && currentStory && slide && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
            {currentStory.slides.map((_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: i < currentSlide
                      ? '100%'
                      : i === currentSlide
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={closeStory}
            className="absolute top-8 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all duration-200 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Story Info Header */}
          <div className="absolute top-12 left-4 z-20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-800 border-2 border-amber-500/50 flex-shrink-0">
              <Image
                src={currentStory.coverImg}
                alt={currentStory.title}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">{currentStory.title}</p>
              <p className="text-white/50 text-[11px]">{slide.location}</p>
            </div>
          </div>

          {/* Slide Image */}
          <div className={`absolute inset-0 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <Image
              src={slide.img}
              alt={slide.place}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
          </div>

          {/* Tap Zones (Left/Right) */}
          <div
            className="absolute inset-0 z-10 flex"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
          >
            <button
              onClick={goPrevSlide}
              className="w-1/3 h-full cursor-pointer bg-transparent outline-none"
              aria-label="Previous slide"
            />
            <div className="w-1/3 h-full" />
            <button
              onClick={goNextSlide}
              className="w-1/3 h-full cursor-pointer bg-transparent outline-none"
              aria-label="Next slide"
            />
          </div>

          {/* Slide Content */}
          <div className={`absolute bottom-0 left-0 right-0 z-20 px-5 pb-5 sm:pb-8 sm:px-8 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <div className="max-w-lg">
              {/* Place Name */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                {slide.place}
              </h2>

              {/* Location */}
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin size={13} className="text-amber-400" />
                <span className="text-amber-400 text-xs sm:text-sm font-medium">{slide.location}</span>
              </div>

              {/* Description */}
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-5 line-clamp-3">
                {slide.desc}
              </p>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppLink(slide.place, slide.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/30 ripple-btn"
              >
                <MessageCircle size={16} />
                Plan This Trip →
              </a>
            </div>
          </div>

          {/* Desktop Nav Arrows */}
          <button
            onClick={goPrevSlide}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goNextSlide}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slide Counter (bottom right) */}
          <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 text-white/40 text-xs font-medium">
            {currentSlide + 1} / {currentStory.slides.length}
          </div>

          {/* Story dots at bottom for quick navigation */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 sm:hidden flex gap-1.5">
            {currentStory.slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer outline-none ${
                  i === currentSlide
                    ? 'bg-white w-4'
                    : i < currentSlide
                      ? 'bg-white/60'
                      : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
