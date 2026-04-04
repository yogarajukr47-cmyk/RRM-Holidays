import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destination Stories | RRM Holidays',
  description: 'Explore South India\'s most beautiful destinations through immersive stories — Karnataka, Kerala, Tamil Nadu, Goa & Andhra Pradesh. Swipe through stunning visuals and plan your dream trip.',
  openGraph: {
    title: 'Destination Stories | RRM Holidays',
    description: 'Explore South India through immersive stories — stunning visuals, curated destinations, and your dream trip awaits.',
    type: 'website',
  },
  keywords: 'RRM Holidays stories, South India destinations, Karnataka travel, Kerala backwaters, Tamil Nadu temples, Goa beaches, Andhra Pradesh tourism, travel stories',
  alternates: {
    canonical: 'https://rrmholidays.com/stories',
  },
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
