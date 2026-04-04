import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Reviews & Testimonials | RRM Holidays',
  description: 'Read 500+ verified reviews from happy travellers. RRM Holidays rated 4.8/5 stars. See why South India travellers trust us for their trips.',
  openGraph: {
    title: 'Customer Reviews & Testimonials | RRM Holidays',
    description: 'Read 500+ verified reviews from happy travellers. RRM Holidays rated 4.8/5 stars. See why South India travellers trust us.',
    type: 'website',
  },
  keywords: 'RRM Holidays reviews, South India travel reviews, customer testimonials, rated 4.8 stars, travel agency reviews',
  alternates: {
    canonical: 'https://rrmholidays.com/reviews',
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
