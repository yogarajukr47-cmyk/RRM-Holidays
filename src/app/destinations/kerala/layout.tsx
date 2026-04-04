import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Kerala - Gods Own Country | RRM Holidays',
  description: 'Discover the best tourist places in Kerala — backwaters, hill stations, beaches & more. Plan your Kerala trip with RRM Holidays. WhatsApp us for custom itineraries.',
  openGraph: {
    title: 'Explore Kerala - Gods Own Country | RRM Holidays',
    description: 'Discover the best tourist places in Kerala — backwaters, hill stations, beaches & more. Plan your Kerala trip with RRM Holidays.',
    images: ['/states/kerala-cover.jpg'],
    type: 'website',
  },
  keywords: 'Kerala tourism, Munnar, Alleppey, backwaters, tourist places, South India travel, car rental',
  alternates: {
    canonical: 'https://rrmholidays.com/destinations/kerala',
  },
};

export default function KeralaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
