import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Goa - Beaches, Nightlife & Heritage | RRM Holidays',
  description: 'Discover 16+ best tourist places in Goa — beaches, churches, water sports & more. Plan your Goa trip with RRM Holidays. WhatsApp us for custom itineraries.',
  openGraph: {
    title: 'Explore Goa - Beaches, Nightlife & Heritage | RRM Holidays',
    description: 'Discover 16+ best tourist places in Goa — beaches, churches, water sports & more. Plan your Goa trip with RRM Holidays.',
    images: ['/states/goa-cover.jpg'],
    type: 'website',
  },
  keywords: 'Goa tourism, Goa beaches, Dudhsagar, Old Goa, tourist places, South India travel, car rental',
  alternates: {
    canonical: 'https://rrmholidays.com/destinations/goa',
  },
};

export default function GoaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
