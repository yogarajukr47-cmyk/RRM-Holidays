import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Compatibility Quiz | RRM Holidays',
  description:
    'Discover your travel personality! Take our fun 5-step quiz and get matched with perfect South India destinations. Find out if you are The Adventurous Family, The Romantic Wanderers, or The Spiritual Seeker! Free quiz by RRM Holidays.',
  openGraph: {
    title: 'Travel Compatibility Quiz | RRM Holidays',
    description:
      'Take our fun quiz to discover your travel personality and get matched with perfect South India destinations!',
    type: 'website',
  },
  keywords:
    'travel quiz, travel personality, South India destinations, travel compatibility, trip planner, RRM Holidays, fun quiz',
  alternates: {
    canonical: 'https://rrmholidays.com/travel-quiz',
  },
};

export default function TravelQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
