export default function TestimonialsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-white/10 rounded-lg" />
          <div className="h-3 w-28 bg-white/5 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-white/10 rounded-lg" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full" />
              <div>
                <div className="h-4 w-28 bg-white/10 rounded mb-1" />
                <div className="h-3 w-20 bg-white/5 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-5/6 bg-white/5 rounded" />
              <div className="h-3 w-2/3 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
