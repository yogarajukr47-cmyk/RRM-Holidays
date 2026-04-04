import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Route Planner - Multi-Stop Trip Optimizer | RRM Holidays',
  description: 'Optimize your multi-stop South India route with AI. Get best stop order, distances, attractions & tips. Free tool by RRM Holidays. WhatsApp us for a quote!',
  openGraph: {
    title: 'Smart Route Planner - Multi-Stop Trip Optimizer | RRM Holidays',
    description: 'Optimize your multi-stop South India route with AI. Get best stop order, distances, attractions & tips. Free tool by RRM Holidays.',
    type: 'website',
  },
  keywords: 'route planner, multi-stop trip, South India route optimizer, travel planner, RRM Holidays',
  alternates: {
    canonical: 'https://rrmholidays.com/route-planner',
  },
};

export default function RoutePlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
