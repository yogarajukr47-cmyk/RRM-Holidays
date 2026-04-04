'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Clock,
  Calendar,
  Tag,
  MapPin,
  BookOpen,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

import { blogPosts, BLOG_CATEGORIES, BLOG_STATES } from '@/data/blog-data';
import type { BlogPost } from '@/data/blog-data';

/* ── Category Color Map ── */
const CATEGORY_COLORS: Record<string, string> = {
  Destinations: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Road Trips': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Heritage: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Nature: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Beaches: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  Planning: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Seasonal: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeState, setActiveState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let results = blogPosts;

    if (activeCategory !== 'All') {
      results = results.filter((post) => post.category === activeCategory);
    }

    if (activeState !== 'All') {
      results = results.filter((post) => post.state === activeState);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return results;
  }, [activeCategory, activeState, searchQuery]);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <BookOpen size={16} />
            Travel Blog
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-gradient-warm">South India</span>
            <br />
            <span className="text-stone-200">Travel Stories & Guides</span>
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Expert travel tips, destination guides, and insider stories from
            the heart of South India by the RRM Holidays team.
          </p>
        </div>
      </section>

      {/* ── Search & Filters ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-white/5 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/30 transition-all backdrop-blur-xl"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-neutral-900/50 text-stone-400 border border-white/5 hover:border-white/15 hover:text-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* State Filters */}
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            State
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOG_STATES.map((state) => (
              <button
                key={state}
                onClick={() => setActiveState(state)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeState === state
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-neutral-900/50 text-stone-400 border border-white/5 hover:border-white/15 hover:text-stone-300'
                }`}
              >
                {state === 'Multi-State' ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    Multi-State
                  </span>
                ) : (
                  state
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results Count ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <p className="text-stone-500 text-sm">
          Showing{' '}
          <span className="text-amber-400 font-semibold">
            {filteredPosts.length}
          </span>{' '}
          {filteredPosts.length === 1 ? 'article' : 'articles'}
          {activeCategory !== 'All' && (
            <span>
              {' '}
              in{' '}
              <span className="text-stone-300">{activeCategory}</span>
            </span>
          )}
          {activeState !== 'All' && (
            <span>
              {' '}
              ·{' '}
              <span className="text-stone-300">{activeState}</span>
            </span>
          )}
        </p>
      </section>

      {/* ── Blog Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Search size={48} className="mx-auto text-stone-600 mb-4" />
            <h3 className="text-xl font-semibold text-stone-300 mb-2">
              No articles found
            </h3>
            <p className="text-stone-500">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setActiveState('All');
              }}
              className="mt-4 px-6 py-2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium hover:bg-amber-500/20 transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-200 mb-3">
            Ready to explore South India?
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto mb-8">
            Our team of local experts can craft the perfect itinerary for your
            dream vacation. Get in touch for a custom quote.
          </p>
          <a
            href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%27d%20like%20to%20plan%20a%20trip%20to%20South%20India."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
          >
            Plan on WhatsApp
            <ChevronRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

/* ── Blog Card Component ── */
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const catColor =
    CATEGORY_COLORS[post.category] || 'bg-stone-500/15 text-stone-400 border-stone-500/20';

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="relative rounded-2xl overflow-hidden bg-neutral-950/50 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-white/10"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${catColor}`}
            >
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-semibold text-stone-100 mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>
            <span className="flex items-center gap-1 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
              Read
              <ArrowRight size={12} />
            </span>
          </div>

          {/* State Tag */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <MapPin size={12} />
              {post.state}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
