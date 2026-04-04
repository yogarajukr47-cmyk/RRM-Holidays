import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Destination Recommendations | RRM Holidays',
  description: 'Find your perfect South India destination with AI. Matched to your interests, budget & travel style. Free tool by RRM Holidays. WhatsApp us for a custom quote!',
  openGraph: {
    title: 'AI Destination Recommendations | RRM Holidays',
    description: 'Find your perfect South India destination with AI. Matched to your interests, budget & travel style. Free tool by RRM Holidays.',
    type: 'website',
  },
  keywords: 'AI recommendations, South India destinations, travel matching, personalized travel, RRM Holidays',
  alternates: {
    canonical: 'https://rrmholidays.com/ai-recommendations',
  },
};

export default function AIRecommendationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
