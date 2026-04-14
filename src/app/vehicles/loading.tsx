export default function VehiclesLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-20">
      {/* Header Skeleton */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <div className="h-3 w-32 bg-amber-500/15 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-8 md:h-10 w-72 bg-white/10 rounded-xl animate-pulse mx-auto mb-3" />
        <div className="h-4 w-96 max-w-full bg-white/5 rounded-lg animate-pulse mx-auto" />
      </div>

      {/* Carousel Skeleton */}
      <div className="relative max-w-7xl mx-auto mb-8">
        {/* Arrow buttons skeleton */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-white/5 rounded-full animate-pulse hidden md:block" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-white/5 rounded-full animate-pulse hidden md:block" />

        {/* Horizontal scroll skeleton */}
        <div className="flex gap-5 overflow-hidden px-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[380px] rounded-2xl overflow-hidden bg-neutral-900/50 border border-white/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Image skeleton */}
              <div className="aspect-[4/3] bg-white/5 animate-pulse relative">
                <div className="absolute top-3 left-3 h-6 w-20 bg-amber-500/15 rounded-full animate-pulse" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-5 w-3/5 bg-white/10 rounded-lg animate-pulse mb-2" />
                  <div className="h-3 w-2/5 bg-white/5 rounded-lg animate-pulse" />
                </div>
              </div>
              {/* Info skeleton */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-4 w-20 bg-amber-500/15 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots skeleton */}
      <div className="flex justify-center gap-2 mb-16">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-2 w-6 bg-white/5 rounded-full animate-pulse" />
        ))}
      </div>

      {/* Why RRM skeleton */}
      <div className="max-w-5xl mx-auto">
        <div className="h-6 w-64 bg-white/10 rounded-xl animate-pulse mx-auto mb-3" />
        <div className="h-3 w-80 bg-white/5 rounded-lg animate-pulse mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 text-center">
              <div className="h-10 w-10 bg-amber-500/10 rounded-xl animate-pulse mx-auto mb-3" />
              <div className="h-4 w-24 bg-white/10 rounded-lg animate-pulse mx-auto mb-2" />
              <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}