import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Andhra Pradesh - 19+ Tourist Places | RRM Holidays',
  description: 'Discover 19+ best tourist places in Andhra Pradesh — Tirupati, Araku Valley, Vizag & more. Plan your trip with RRM Holidays. WhatsApp us for custom itineraries.',
  openGraph: {
    title: 'Explore Andhra Pradesh - 19+ Tourist Places | RRM Holidays',
    description: 'Discover 19+ best tourist places in Andhra Pradesh — Tirupati, Araku Valley, Vizag & more. Plan your trip with RRM Holidays.',
    images: ['/states/andhra-cover.jpg'],
    type: 'website',
  },
  keywords: 'Andhra Pradesh tourism, Tirupati, Araku Valley, Vizag, tourist places, South India travel, car rental',
  alternates: {
    canonical: 'https://rrmholidays.com/destinations/andhra',
  },
};

export default function AndhraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
