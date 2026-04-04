'use client';

import { useCallback, type ReactNode } from 'react';
import { MessageCircle, Share2, Phone } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WhatsAppSmartButtonProps {
  context: 'homepage' | 'destination' | 'vehicle' | 'mood' | 'quiz' | 'story' | 'generic';
  placeName?: string;
  state?: string;
  mood?: string;
  tripDetails?: {
    days: number;
    people: number;
    vehicle: string;
  };
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '919108597154';
const PHONE_NUMBER = '+919108597154';

const CONTEXT_MESSAGES: Record<string, string> = {
  homepage:
    "Hi RRM Holidays! I'm planning a South India trip. Please help me!",
  destination: '', // built dynamically
  vehicle: 'Hi! I need vehicle info for my upcoming trip.',
  mood: '', // built dynamically
  quiz: 'Hi! I took the travel quiz. Here are my preferences...',
  story: '', // built dynamically
  generic:
    "Hi RRM Holidays! I'm interested in your travel services. Please share more details.",
};

// ─── Size Configs ─────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    button: 'px-4 py-2 text-xs gap-2 rounded-lg',
    icon: 14,
    pulse: 'w-6 h-6',
  },
  md: {
    button: 'px-6 py-3 text-sm gap-2.5 rounded-xl',
    icon: 18,
    pulse: 'w-8 h-8',
  },
  lg: {
    button: 'px-8 py-4 text-base gap-3 rounded-xl',
    icon: 22,
    pulse: 'w-10 h-10',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMessage(props: WhatsAppSmartButtonProps): string {
  const { context, placeName, state, mood, tripDetails } = props;

  // Dynamic messages
  if (context === 'destination') {
    const place = placeName || 'this destination';
    const loc = state ? ` in ${state}` : '';
    return `Hi! I was exploring ${place}${loc}. Can you help plan a visit?`;
  }

  if (context === 'mood') {
    const m = mood || 'adventure';
    return `Hi! I want a ${m}-vibes trip. Suggest places!`;
  }

  if (context === 'story') {
    const s = placeName || 'these';
    return `Hi! The ${s} stories look amazing. Help me plan this trip!`;
  }

  // Append trip details if present
  let base = CONTEXT_MESSAGES[context] || CONTEXT_MESSAGES.generic;

  if (tripDetails) {
    base += `\n\nTrip Details:\n- Duration: ${tripDetails.days} days\n- Travellers: ${tripDetails.people}\n- Vehicle: ${tripDetails.vehicle}`;
  }

  if (placeName && context !== 'destination' && context !== 'story') {
    base += `\n\nI'm interested in: ${placeName}`;
  }

  return base;
}

function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

async function nativeShare(message: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false;

  try {
    await navigator.share({
      title: 'RRM Holidays — Plan My Trip',
      text: message,
      url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    });
    return true;
  } catch {
    // User cancelled or share failed — fall back to direct link
    return false;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WhatsAppSmartButton({
  context,
  placeName,
  state,
  mood,
  tripDetails,
  className = '',
  children,
  size = 'md',
}: WhatsAppSmartButtonProps) {
  const config = SIZE_CONFIG[size];

  const message = buildMessage({ context, placeName, state, mood, tripDetails });
  const whatsappUrl = getWhatsAppUrl(message);

  const handleClick = useCallback(async () => {
    // Try native share on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      const shared = await nativeShare(message);
      if (shared) return;
    }
    // Fallback: open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [message, whatsappUrl]);

  // Phone-only variant for phone CTAs
  const handlePhoneClick = useCallback(() => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  }, []);

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Primary WhatsApp Button */}
      <button
        onClick={handleClick}
        className={`
          group relative inline-flex items-center justify-center font-semibold
          transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
          shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30
          ${config.button}
        `}
        style={{
          background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #16a34a 100%)',
          backgroundSize: '200% 200%',
        }}
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span
          className={`absolute rounded-full animate-ping opacity-20 bg-green-400 ${config.pulse}`}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        />
        <span
          className={`absolute rounded-full animate-ping opacity-10 bg-green-400 ${config.pulse}`}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: '600ms',
          }}
        />

        {/* Icon */}
        <MessageCircle
          size={config.icon}
          className="relative z-10 text-white transition-transform duration-300 group-hover:scale-110"
          strokeWidth={2.5}
        />

        {/* Label */}
        <span className="relative z-10 text-white font-semibold drop-shadow-sm">
          {children || 'Chat on WhatsApp'}
        </span>
      </button>

      {/* Optional Phone Fallback (shown on md+ screens) */}
      {context === 'homepage' && (
        <button
          onClick={handlePhoneClick}
          className={`
            hidden md:inline-flex items-center justify-center font-medium
            backdrop-blur-xl border border-white/15 bg-white/5
            text-stone-300 hover:text-white hover:bg-white/10
            transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
            ${config.button}
          `}
          aria-label="Call RRM Holidays"
        >
          <Phone size={config.icon} className="text-amber-400" strokeWidth={2.5} />
          <span>Call Us</span>
        </button>
      )}
    </div>
  );
}

// ─── Exported Helpers (for use in other components) ───────────────────────────

export { buildMessage, getWhatsAppUrl, WHATSAPP_NUMBER, PHONE_NUMBER };
