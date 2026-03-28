export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-40 bg-white/5 rounded-lg" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 lg:p-6">
            <div className="h-3 w-20 bg-white/5 rounded mb-3" />
            <div className="h-8 w-16 bg-white/10 rounded" />
            <div className="h-2 w-24 bg-white/5 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="h-5 w-40 bg-white/5 rounded mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full" />
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-white/5 rounded mb-1" />
                    <div className="h-2 w-32 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
