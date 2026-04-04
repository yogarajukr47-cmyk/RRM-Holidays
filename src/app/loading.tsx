export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start pt-16 pb-20">
      {/* Logo Pulse */}
      <div className="flex items-center gap-3 mb-12 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m0 0V5.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v12.75m-9 0H5.625"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-28 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-3 w-20 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="w-full max-w-5xl mx-auto px-4 mb-16">
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-neutral-900/50 border border-white/5">
          {/* Gradient orbs */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
          {/* Content skeleton */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-6">
            <div className="h-4 w-32 bg-amber-500/20 rounded-full animate-pulse" />
            <div className="h-8 md:h-10 w-72 md:w-96 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-4 w-56 md:w-80 bg-white/5 rounded-lg animate-pulse" />
            <div className="flex gap-3 mt-2">
              <div className="h-11 w-36 bg-amber-500/20 rounded-xl animate-pulse" />
              <div className="h-11 w-28 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Title Skeleton */}
      <div className="w-full max-w-5xl mx-auto px-4 mb-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-3 w-24 bg-amber-500/15 rounded-full animate-pulse" />
          <div className="h-6 w-48 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-3 w-64 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Cards Skeleton Grid */}
      <div className="w-full max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Image skeleton */}
            <div className="h-44 bg-white/5 animate-pulse" />
            {/* Content skeleton */}
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-white/10 rounded-lg animate-pulse" />
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-amber-500/15 rounded-full animate-pulse" />
                <div className="h-4 w-12 bg-white/5 rounded-full animate-pulse" />
              </div>
              <div className="h-3 w-full bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-5/6 bg-white/5 rounded-lg animate-pulse" />
              <div className="pt-2 flex gap-2">
                <div className="h-9 w-20 bg-amber-500/15 rounded-lg animate-pulse" />
                <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom loading bar */}
      <div className="w-full max-w-48 mt-12">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse" />
        </div>
        <p className="text-center text-xs text-neutral-500 mt-3">Loading...</p>
      </div>
    </div>
  );
}
