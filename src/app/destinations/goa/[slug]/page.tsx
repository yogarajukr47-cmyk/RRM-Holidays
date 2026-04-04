import { notFound } from 'next/navigation';
import { GOA } from '@/lib/places-data';
import PlaceDetailPage from '@/components/PlaceDetailPage';

export function generateStaticParams() {
  return GOA.places.map(p => ({ slug: p.slug }));
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const place = GOA.places.find(p => p.slug === slug);
    if (!place) notFound();
    const idx = GOA.places.findIndex(p => p.slug === slug);
    const prevPlace = idx > 0 ? GOA.places[idx - 1] : null;
    const nextPlace = idx < GOA.places.length - 1 ? GOA.places[idx + 1] : null;
    return <PlaceDetailPage state={GOA} place={place} prevPlace={prevPlace} nextPlace={nextPlace} />;
  });
}
