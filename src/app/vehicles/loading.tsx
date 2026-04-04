export default function VehiclesLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-20">
      {/* Header Skeleton */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="h-3 w-32 bg-amber-500/15 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-8 md:h-10 w-64 bg-white/10 rounded-xl animate-pulse mx-auto mb-3" />
        <div className="h-4 w-80 max-w-full bg-white/5 rounded-lg animate-pulse mx-auto" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 bg-white/5 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Vehicle Cards Grid Skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Image skeleton */}
            <div className="h-52 bg-white/5 animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              {/* Badge */}
              <div className="absolute top-3 left-3 h-6 w-16 bg-amber-500/15 rounded-full animate-pulse" />
            </div>

            {/* Details skeleton */}
            <div className="p-5 space-y-4">
              {/* Vehicle name + type */}
              <div>
                <div className="h-5 w-3/5 bg-white/10 rounded-lg animate-pulse mb-2" />
                <div className="h-3 w-1/2 bg-white/5 rounded-lg animate-pulse" />
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="bg-white/5 rounded-lg p-2.5 text-center space-y-1.5"
                  >
                    <div className="h-4 w-4 bg-white/10 rounded mx-auto animate-pulse" />
                    <div className="h-2.5 w-10 bg-white/5 rounded mx-auto animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Features tags */}
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-6 w-14 bg-white/5 rounded-full animate-pulse"
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="pt-1 flex gap-2">
                <div className="h-10 flex-1 bg-amber-500/15 rounded-xl animate-pulse" />
                <div className="h-10 flex-1 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
