import Link from 'next/link';

const WHATSAPP_URL = `https://wa.me/919108597154?text=${encodeURIComponent("Hi! I'm looking for destinations in Goa with RRM Holidays.")}`;

export default function GoaNotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-10">
          <div className="text-5xl mb-4">🏖️</div>

          <h1 className="text-7xl font-black bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent mb-2">
            404
          </h1>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
            Goa
          </span>

          <h2 className="text-xl font-bold text-white mb-3">
            Destination Not Found
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-8">
            This Goa destination doesn&apos;t exist or may have been moved. Explore our popular Goa destinations!
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Panaji', 'Calangute', 'Baga', 'Old Goa', 'Palolem'].map((place) => (
              <Link
                key={place}
                href={`/destinations/goa/${place.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 text-neutral-300 rounded-full hover:bg-white/10 hover:text-white transition-all"
              >
                {place}
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/destinations/goa"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
            >
              View All Goa
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium rounded-xl hover:bg-emerald-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
