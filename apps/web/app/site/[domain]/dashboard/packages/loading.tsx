export default function PackagesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-white/5 rounded-lg" />
        <div className="h-10 w-32 bg-white/10 rounded-lg" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="h-5 w-32 bg-white/5 rounded mb-3" />
            <div className="h-8 w-24 bg-white/10 rounded mb-4" />
            <div className="space-y-2 mb-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-3 w-full bg-white/5 rounded" />
              ))}
            </div>
            <div className="h-10 w-full bg-white/10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
