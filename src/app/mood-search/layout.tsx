import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mood-Based Travel Search | RRM Holidays',
  description:
    'How are you feeling today? Choose your mood — Relax, Adventure, Spiritual, Romantic, or Beach — and discover the perfect South India destination. Free tool by RRM Holidays. WhatsApp us for a custom quote!',
  openGraph: {
    title: 'Mood-Based Travel Search | RRM Holidays',
    description:
      'Pick your mood, find your dream destination in South India. Relax, Adventure, Spiritual, Romantic, or Beach — we have the perfect trip for you.',
    type: 'website',
  },
  keywords:
    'mood travel, South India destinations, relax trip, adventure travel, spiritual tour, romantic getaway, beach holiday, RRM Holidays',
  alternates: {
    canonical: 'https://rrmholidays.com/mood-search',
  },
};

export default function MoodSearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
