import { notFound } from 'next/navigation';
import { ANDHRA } from '@/lib/places-data';
import PlaceDetailPage from '@/components/PlaceDetailPage';

export function generateStaticParams() {
  return ANDHRA.places.map(p => ({ slug: p.slug }));
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const place = ANDHRA.places.find(p => p.slug === slug);
    if (!place) notFound();
    const idx = ANDHRA.places.findIndex(p => p.slug === slug);
    const prevPlace = idx > 0 ? ANDHRA.places[idx - 1] : null;
    const nextPlace = idx < ANDHRA.places.length - 1 ? ANDHRA.places[idx + 1] : null;
    return <PlaceDetailPage state={ANDHRA} place={place} prevPlace={prevPlace} nextPlace={nextPlace} />;
  });
}
