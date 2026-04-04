export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/5" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-white font-medium text-sm">Loading Dashboard...</p>
          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
