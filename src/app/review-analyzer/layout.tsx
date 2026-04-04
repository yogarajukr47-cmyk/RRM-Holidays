import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Review Analyzer - Travel Sentiment Analysis | RRM Holidays',
  description: 'Get real-time sentiment analysis for any South India destination. AI-powered ratings, pros, cons & tips. Free tool by RRM Holidays. WhatsApp us for a custom quote!',
  openGraph: {
    title: 'AI Review Analyzer - Travel Sentiment Analysis | RRM Holidays',
    description: 'Get real-time sentiment analysis for any South India destination. AI-powered ratings, pros, cons & tips. Free tool by RRM Holidays.',
    type: 'website',
  },
  keywords: 'review analyzer, travel sentiment analysis, destination reviews, tourist tips, RRM Holidays',
  alternates: {
    canonical: 'https://rrmholidays.com/review-analyzer',
  },
};

export default function ReviewAnalyzerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
