import Link from 'next/link';

const POPULAR_DESTINATIONS = [
  {
    name: 'Karnataka',
    slug: '/destinations/karnataka',
    description: 'Mysuru, Coorg, Hampi & more',
    gradient: 'from-purple-500/20 to-purple-900/20',
    border: 'border-purple-500/10',
    emoji: '🏔️',
  },
  {
    name: 'Kerala',
    slug: '/destinations/kerala',
    description: 'Munnar, Alleppey, Kochi & more',
    gradient: 'from-emerald-500/20 to-emerald-900/20',
    border: 'border-emerald-500/10',
    emoji: '🌴',
  },
  {
    name: 'Tamil Nadu',
    slug: '/destinations/tamilnadu',
    description: 'Ooty, Chennai, Madurai & more',
    gradient: 'from-blue-500/20 to-blue-900/20',
    border: 'border-blue-500/10',
    emoji: '🏛️',
  },
  {
    name: 'Goa',
    slug: '/destinations/goa',
    description: 'Beaches, Forts & Nightlife',
    gradient: 'from-amber-500/20 to-amber-900/20',
    border: 'border-amber-500/10',
    emoji: '🏖️',
  },
  {
    name: 'Andhra Pradesh',
    slug: '/destinations/andhra',
    description: 'Tirupati, Vizag & Araku',
    gradient: 'from-rose-500/20 to-rose-900/20',
    border: 'border-rose-500/10',
    emoji: '🛕',
  },
];

const WHATSAPP_URL = `https://wa.me/919108597154?text=${encodeURIComponent("Hi! I need help with RRM Holidays.")}`;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center px-4 py-20">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-[8rem] md:text-[12rem] font-black leading-none bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent select-none">
            404
          </h1>
        </div>

        {/* Tagline */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            Page Not Found
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          This page seems to be on a trip of its own
        </h2>
        <p className="text-neutral-400 text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed">
          The page you&apos;re looking for has wandered off. While it finds its way back, explore our popular destinations instead!
        </p>

        {/* Popular Destinations Grid */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">Popular Destinations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {POPULAR_DESTINATIONS.map((dest) => (
              <Link
                key={dest.slug}
                href={dest.slug}
                className={`group bg-gradient-to-br ${dest.gradient} backdrop-blur-xl border ${dest.border} rounded-2xl p-5 hover:scale-105 transition-all duration-300 hover:shadow-lg`}
              >
                <div className="text-3xl mb-3">{dest.emoji}</div>
                <h4 className="text-white font-semibold text-sm mb-1">{dest.name}</h4>
                <p className="text-neutral-400 text-xs">{dest.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Plan Your Trip
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
