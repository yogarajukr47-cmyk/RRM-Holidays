import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Popular Routes & Route Deals | RRM Holidays - South India',
  description: 'Explore popular travel routes across South India. AI-powered route info, en-route attractions & travel tips. No hidden fees — WhatsApp us for a custom quote!',
  openGraph: {
    title: 'Popular Routes & Route Deals | RRM Holidays - South India',
    description: 'Explore popular travel routes across South India. AI-powered route info, en-route attractions & travel tips. No hidden fees.',
    type: 'website',
  },
  keywords: 'popular routes, South India travel, route deals, travel planner, RRM Holidays',
  alternates: {
    canonical: 'https://rrmholidays.com/smart-deals',
  },
};

export default function SmartDealsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
