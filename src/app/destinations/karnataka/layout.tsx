import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Karnataka - 53+ Tourist Places | RRM Holidays',
  description: 'Discover 53+ best tourist places in Karnataka. From Mysuru Palace to Hampi ruins. Plan your Karnataka trip with RRM Holidays. WhatsApp us for custom itineraries.',
  openGraph: {
    title: 'Explore Karnataka - 53+ Tourist Places | RRM Holidays',
    description: 'Discover 53+ best tourist places in Karnataka. From Mysuru Palace to Hampi ruins. Plan your Karnataka trip with RRM Holidays.',
    images: ['/states/karnataka-cover.jpg'],
    type: 'website',
  },
  keywords: 'Karnataka tourism, Mysuru, Hampi, Coorg, tourist places, South India travel, car rental',
  alternates: {
    canonical: 'https://rrmholidays.com/destinations/karnataka',
  },
};

export default function KarnatakaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
