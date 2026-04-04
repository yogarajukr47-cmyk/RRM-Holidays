import { notFound } from 'next/navigation';
import { KARNATAKA, slugifyPlace } from '@/lib/places-data';
import PlaceDetailPage from '@/components/PlaceDetailPage';

export function generateStaticParams() {
  return KARNATAKA.places.map(p => ({ slug: p.slug }));
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const place = KARNATAKA.places.find(p => p.slug === slug);
    if (!place) notFound();
    const idx = KARNATAKA.places.findIndex(p => p.slug === slug);
    const prevPlace = idx > 0 ? KARNATAKA.places[idx - 1] : null;
    const nextPlace = idx < KARNATAKA.places.length - 1 ? KARNATAKA.places[idx + 1] : null;
    return <PlaceDetailPage state={KARNATAKA} place={place} prevPlace={prevPlace} nextPlace={nextPlace} />;
  });
}
