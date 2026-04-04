'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { MessageCircle, Phone, ArrowUp, Bot } from 'lucide-react';

const WHATSAPP_NUMBER = '919108597154';
const PHONE_NUMBER = '+919108597154';
const SCROLL_THRESHOLD = 600;

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi RRM Holidays! I'd like to enquire about your travel services."
)}`;

export default function FloatingButtons() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const rippleRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAIChat = () => {
    const chatBtn = document.querySelector('[data-chatbot-toggle]') as HTMLElement;
    if (chatBtn) {
      chatBtn.click();
    } else {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.querySelector('.lucide-bot') || btn.textContent?.includes('AI')) {
          btn.click();
          return;
        }
      }
    }
  };

  const handleRipple = useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    // Remove existing ripple
    const existing = target.querySelector('.ripple-effect');
    if (existing) existing.remove();

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    target.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);
  }, []);

  return (
    <>
      {/* ═══ Desktop Floating Buttons ═══ */}
      <div className="hidden sm:flex fixed bottom-6 left-6 z-40 flex-col gap-3">
        {/* Call Button */}
        <div className="relative group">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            title="Call Us"
            aria-label="Call RRM Holidays"
            onMouseEnter={() => setHoveredBtn('call')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <Phone size={22} className="text-black transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#f59e0b' }} />
          </a>
          {hoveredBtn === 'call' && (
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900/95 backdrop-blur-lg border border-white/10 text-stone-200 shadow-xl animate-slide-in-left pointer-events-none">
              Call Us
            </span>
          )}
        </div>

        {/* WhatsApp Button */}
        <div className="relative group">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-green-600/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-green-600/35 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
            onMouseEnter={() => setHoveredBtn('whatsapp')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#22c55e' }} />
            <span className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ background: '#22c55e', animationDelay: '500ms' }} />
            <MessageCircle size={22} className="relative z-10 text-white transition-transform duration-300 group-hover:scale-110" />
          </a>
          {hoveredBtn === 'whatsapp' && (
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900/95 backdrop-blur-lg border border-green-500/20 text-green-400 shadow-xl animate-slide-in-left pointer-events-none">
              WhatsApp
            </span>
          )}
        </div>

        {/* Back to Top Button */}
        <div className="relative group">
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-xl border transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 ${
              scrolled
                ? 'opacity-100 translate-y-0 pointer-events-auto bg-white/10 border-white/20 shadow-lg'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            title="Back to Top"
            onMouseEnter={() => setHoveredBtn('top')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <ArrowUp size={20} className="text-stone-300" />
          </button>
          {hoveredBtn === 'top' && scrolled && (
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900/95 backdrop-blur-lg border border-white/10 text-stone-200 shadow-xl animate-slide-in-left pointer-events-none">
              Back to Top
            </span>
          )}
        </div>
      </div>

      {/* ═══ Mobile Sticky Bottom Bar — Premium Design ═══ */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[9999] mobile-bar-wrapper">
        {/* Top gradient accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <nav className="mobile-bottom-bar" aria-label="Quick actions">
          {/* ── Call Button ── */}
          <button
            onClick={() => {
              setActiveTab('call');
              window.location.href = `tel:${PHONE_NUMBER}`;
            }}
            className={`mobile-bar-btn mobile-bar-call ${activeTab === 'call' ? 'mobile-bar-btn-active' : ''}`}
            aria-label="Call Us"
            onTouchStart={(e) => handleRipple(e as unknown as React.MouseEvent<HTMLButtonElement>)}
            onMouseDown={handleRipple}
          >
            <div className="mobile-bar-icon-ring mobile-bar-icon-ring-call">
              <Phone size={20} strokeWidth={2} />
            </div>
            <span className="mobile-bar-label">Call</span>
          </button>

          {/* ── Divider ── */}
          <div className="mobile-bar-divider" />

          {/* ── WhatsApp Button (Primary CTA — highlighted) ── */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mobile-bar-btn mobile-bar-whatsapp ${activeTab === 'whatsapp' ? 'mobile-bar-btn-active' : ''}`}
            aria-label="Chat on WhatsApp"
            onTouchStart={(e) => handleRipple(e as unknown as React.MouseEvent<HTMLAnchorElement>)}
            onMouseDown={handleRipple}
          >
            <div className="mobile-bar-icon-ring mobile-bar-icon-ring-whatsapp">
              <MessageCircle size={20} strokeWidth={2} />
            </div>
            <span className="mobile-bar-label">WhatsApp</span>
          </a>

          {/* ── Divider ── */}
          <div className="mobile-bar-divider" />

          {/* ── AI Chat Button ── */}
          <button
            onClick={() => {
              setActiveTab('chat');
              openAIChat();
            }}
            className={`mobile-bar-btn mobile-bar-chat ${activeTab === 'chat' ? 'mobile-bar-btn-active' : ''}`}
            aria-label="AI Chat"
            onTouchStart={(e) => handleRipple(e as unknown as React.MouseEvent<HTMLButtonElement>)}
            onMouseDown={handleRipple}
          >
            <div className="mobile-bar-icon-ring mobile-bar-icon-ring-chat">
              <Bot size={20} strokeWidth={2} />
            </div>
            <span className="mobile-bar-label">AI Chat</span>
          </button>
        </nav>
      </div>
    </>
  );
}
