import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Trip Planner | Plan Your South India Itinerary | RRM Holidays',
  description: 'Plan your perfect South India itinerary with AI. Day-by-day activities, vehicle suggestions & travel tips. Free trip planning tool by RRM Holidays. WhatsApp us for a custom quote!',
  openGraph: {
    title: 'AI Trip Planner | Plan Your South India Itinerary | RRM Holidays',
    description: 'Plan your perfect South India itinerary with AI. Day-by-day activities, vehicle suggestions & travel tips. Free tool by RRM Holidays.',
    type: 'website',
  },
  keywords: 'AI trip planner, South India itinerary, day-wise plan, travel planner, RRM Holidays',
  alternates: {
    canonical: 'https://rrmholidays.com/trip-planner',
  },
};

export default function TripPlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
