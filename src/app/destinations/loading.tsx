export default function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-20">
      {/* Header Skeleton */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="h-3 w-28 bg-amber-500/15 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-8 md:h-10 w-72 bg-white/10 rounded-xl animate-pulse mx-auto mb-3" />
        <div className="h-4 w-96 max-w-full bg-white/5 rounded-lg animate-pulse mx-auto" />
      </div>

      {/* Filter Skeleton */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 bg-white/5 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Image skeleton */}
            <div className="h-48 bg-white/5 animate-pulse relative">
              {/* Gradient overlay skeleton */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
              {/* State badge skeleton */}
              <div className="absolute top-3 left-3 h-6 w-20 bg-amber-500/15 rounded-full animate-pulse" />
              {/* Rating skeleton */}
              <div className="absolute top-3 right-3 h-6 w-14 bg-white/10 rounded-full animate-pulse" />
            </div>

            {/* Content skeleton */}
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-white/10 rounded-lg animate-pulse" />
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-white/5 rounded-full animate-pulse" />
                <div className="h-4 w-12 bg-white/5 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-white/5 rounded-full animate-pulse" />
              </div>
              <div className="h-3 w-full bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-5/6 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-4/6 bg-white/5 rounded-lg animate-pulse" />
              <div className="pt-2 flex gap-2">
                <div className="h-9 w-24 bg-amber-500/15 rounded-lg animate-pulse" />
                <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
