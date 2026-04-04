import { notFound } from 'next/navigation';
import { TAMIL_NADU } from '@/lib/places-data';
import PlaceDetailPage from '@/components/PlaceDetailPage';

export function generateStaticParams() {
  return TAMIL_NADU.places.map(p => ({ slug: p.slug }));
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const place = TAMIL_NADU.places.find(p => p.slug === slug);
    if (!place) notFound();
    const idx = TAMIL_NADU.places.findIndex(p => p.slug === slug);
    const prevPlace = idx > 0 ? TAMIL_NADU.places[idx - 1] : null;
    const nextPlace = idx < TAMIL_NADU.places.length - 1 ? TAMIL_NADU.places[idx + 1] : null;
    return <PlaceDetailPage state={TAMIL_NADU} place={place} prevPlace={prevPlace} nextPlace={nextPlace} />;
  });
}
