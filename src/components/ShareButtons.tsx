'use client';

import { MessageCircle, Copy, Share2 } from 'lucide-react';

const SITE_URL = 'https://rrmholidays.com';

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = encodeURIComponent(`${SITE_URL}/blog/${slug}`);
  const text = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${SITE_URL}/blog/${slug}`);
    const btn = document.getElementById('copy-link-btn');
    if (btn) {
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      setTimeout(() => {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
      }, 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${text}%20${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium hover:bg-green-500/20 transition-all"
      >
        <MessageCircle size={14} />
        WhatsApp
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium hover:bg-blue-500/20 transition-all"
      >
        <Share2 size={14} />
        Twitter
      </a>
      <button
        id="copy-link-btn"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-500/10 text-stone-400 border border-stone-500/20 text-xs font-medium hover:bg-stone-500/20 transition-all"
      >
        <Copy size={14} />
        Copy Link
      </button>
    </div>
  );
}
