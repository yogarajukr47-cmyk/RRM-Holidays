import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vehicle Fleet & Car Rental | RRM Holidays - South India',
  description: 'Browse 12+ vehicles from Sedan to Bus. Transparent per-km pricing. Book your South India road trip with RRM Holidays. WhatsApp us now!',
  openGraph: {
    title: 'Vehicle Fleet & Car Rental | RRM Holidays - South India',
    description: 'Browse 12+ vehicles from Sedan to Bus. Transparent per-km pricing. Book your South India road trip with RRM Holidays.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  keywords: 'vehicle rental, car rental South India, tempo traveller, Innova, bus hire, per-km pricing, RRM Holidays',
  alternates: {
    canonical: 'https://rrmholidays.com/vehicles',
  },
};

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
