import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  Calendar,
  MapPin,
  Tag,
  User,
  ChevronRight,
  Home,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';

import ShareButtons from '@/components/ShareButtons';

import {
  blogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
  getAllBlogSlugs,
} from '@/data/blog-data';

const SITE_URL = 'https://rrmholidays.com';

/* ── Generate Static Params ── */
export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

/* ── Generate Metadata ── */
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getBlogPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
      title: `${post.title} - RRM Holidays Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/blog/${post.slug}`,
        siteName: 'RRM Holidays',
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        images: [
          {
            url: `${SITE_URL}${post.image}`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [`${SITE_URL}${post.image}`],
      },
    };
  });
}

/* ── TOC Heading Extractor ── */
function extractHeadings(html: string) {
  const regex = /<h2[^>]*>(.*?)<\/h2>/g;
  const headings: { id: string; text: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '');
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    headings.push({ id, text });
  }
  return headings;
}

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

/* ── ShareButtons is now a separate client component ── */

/* ── Process Content (add IDs to h2) ── */
function processContent(html: string) {
  return html.replace(
    /<h2[^>]*>(.*?)<\/h2>/g,
    (_, content) => {
      const text = content.replace(/<[^>]*>/g, '');
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return `<h2 id="${id}" class="scroll-mt-24">${content}</h2>`;
    }
  );
}

/* ── Main Page Component ── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const relatedPosts = getRelatedPosts(post.slug, post.category, post.state, 3);
  const processedContent = processContent(post.content);
  const catColor =
    CATEGORY_COLORS[post.category] ||
    'bg-stone-500/15 text-stone-400 border-stone-500/20';

  const whatsappCTAUrl = `https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%20read%20your%20blog%20about%20"${encodeURIComponent(post.title)}"%20and%20I%27d%20like%20to%20plan%20a%20trip%20related%20to%20this.%20Please%20share%20a%20custom%20quote.`;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* ── Hero Section ── */}
      <section className="relative">
        {/* Hero Image */}
        <div className="relative h-[50vh] sm:h-[60vh] w-full">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/30" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 -mt-32 sm:-mt-40">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
              <Link
                href="/"
                className="hover:text-stone-300 transition-colors"
              >
                <Home size={12} />
              </Link>
              <ChevronRight size={12} />
              <Link
                href="/blog"
                className="hover:text-stone-300 transition-colors"
              >
                Blog
              </Link>
              <ChevronRight size={12} />
              <span className="text-stone-400 line-clamp-1">{post.title}</span>
            </nav>

            {/* Category Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${catColor}`}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-amber-400" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {post.state}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="mt-6">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content + Sidebar Layout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="flex-1 max-w-3xl">
            {/* Prose Content */}
            <div
              className="prose prose-invert max-w-none
                prose-headings:text-stone-100 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-stone-100
                prose-h2:first-of-type:mt-0
                prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-base
                prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-stone-200
                prose-li:text-stone-300
                prose-ul:my-4 prose-ol:my-4
                prose-blockquote:border-l-amber-500/50 prose-blockquote:text-stone-400
              "
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-stone-500" />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-neutral-900/50 text-stone-400 text-xs border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                Back to all articles
              </Link>
            </div>
          </article>

          {/* Sidebar — Desktop Only */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="rounded-2xl bg-neutral-950/50 border border-white/5 backdrop-blur-xl p-5">
                  <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
                    <ChevronRight
                      size={14}
                      className="text-amber-400"
                    />
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((heading, idx) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className="block py-1.5 px-3 text-sm text-stone-400 hover:text-amber-400 rounded-lg hover:bg-amber-500/5 transition-all duration-200 border-l-2 border-transparent hover:border-amber-500/30"
                        style={{ paddingLeft: `${16 + idx * 8}px` }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* WhatsApp CTA */}
              <div className="rounded-2xl bg-gradient-to-br from-green-600/10 to-green-500/5 border border-green-500/20 backdrop-blur-xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={24} className="text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-stone-100 mb-2">
                  Plan This Trip on WhatsApp
                </h3>
                <p className="text-sm text-stone-400 mb-5 leading-relaxed">
                  Share this article and get a custom travel quote from our
                  experts.
                </p>
                <a
                  href={whatsappCTAUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-sm hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 w-full justify-center"
                >
                  <MessageCircle size={16} />
                  Chat Now
                </a>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl bg-neutral-950/50 border border-white/5 backdrop-blur-xl p-5">
                <h3 className="text-sm font-semibold text-stone-200 mb-4">
                  Article Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Published</span>
                    <span className="text-stone-300">
                      {new Date(post.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Category</span>
                    <span className="text-amber-400">{post.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Region</span>
                    <span className="text-stone-300">{post.state}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Read Time</span>
                    <span className="text-stone-300">{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Mobile WhatsApp CTA Banner ── */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-green-600/10 to-green-500/5 border border-green-500/20 backdrop-blur-xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={24} className="text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-stone-100 mb-2">
            Plan This Trip on WhatsApp
          </h3>
          <p className="text-sm text-stone-400 mb-5 leading-relaxed">
            Loved this article? Get a custom travel plan from our South India
            experts.
          </p>
          <a
            href={whatsappCTAUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-500/20"
          >
            <MessageCircle size={18} />
            Get Custom Quote
            <ChevronRight size={18} />
          </a>
        </div>
      </section>

      {/* ── Related Posts ── */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 rounded-full bg-amber-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100">
              Related Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relPost) => (
              <Link
                key={relPost.id}
                href={`/blog/${relPost.slug}`}
                className="group block"
              >
                <article className="rounded-2xl overflow-hidden bg-neutral-950/50 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-white/10">
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                    <Image
                      src={relPost.image}
                      alt={relPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${CATEGORY_COLORS[relPost.category] || 'bg-stone-500/15 text-stone-400 border-stone-500/20'}`}
                      >
                        {relPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-stone-100 mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                      {relPost.title}
                    </h3>
                    <p className="text-stone-400 text-sm line-clamp-2 mb-3">
                      {relPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(relPost.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {relPost.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-3">
            Explore More with RRM Holidays
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto mb-8">
            From heritage tours to beach holidays, hill stations to backwaters —
            let us craft your perfect South India itinerary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/919108597154?text=Hi%20RRM%20Holidays!%20I%27d%20like%20to%20plan%20a%20trip%20to%20South%20India."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
            >
              <MessageCircle size={18} />
              Plan on WhatsApp
            </a>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900/50 text-stone-300 font-medium border border-white/5 hover:border-white/15 hover:text-white transition-all"
            >
              <ArrowLeft size={16} />
              All Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
