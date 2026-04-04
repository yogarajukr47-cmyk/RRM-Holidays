import { notFound } from 'next/navigation';
import { KERALA } from '@/lib/places-data';
import PlaceDetailPage from '@/components/PlaceDetailPage';

export function generateStaticParams() {
  return KERALA.places.map(p => ({ slug: p.slug }));
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const place = KERALA.places.find(p => p.slug === slug);
    if (!place) notFound();
    const idx = KERALA.places.findIndex(p => p.slug === slug);
    const prevPlace = idx > 0 ? KERALA.places[idx - 1] : null;
    const nextPlace = idx < KERALA.places.length - 1 ? KERALA.places[idx + 1] : null;
    return <PlaceDetailPage state={KERALA} place={place} prevPlace={prevPlace} nextPlace={nextPlace} />;
  });
}
