import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Tamil Nadu - 22+ Tourist Places | RRM Holidays',
  description: 'Discover 22+ best tourist places in Tamil Nadu. Plan your Tamil Nadu trip with RRM Holidays — trusted South India travel partner. WhatsApp us for custom itineraries.',
  openGraph: {
    title: 'Explore Tamil Nadu - 22+ Tourist Places | RRM Holidays',
    description: 'Discover 22+ best tourist places in Tamil Nadu. Plan your Tamil Nadu trip with RRM Holidays.',
    images: ['/states/tamilnadu-cover.jpg'],
    type: 'website',
  },
  keywords: 'Tamil Nadu tourism, Ooty, Madurai, Chennai, Pondicherry, tourist places, South India travel, car rental',
  alternates: {
    canonical: 'https://rrmholidays.com/destinations/tamilnadu',
  },
};

export default function TamilNaduLayout({ children }: { children: React.ReactNode }) {
  return children;
}
