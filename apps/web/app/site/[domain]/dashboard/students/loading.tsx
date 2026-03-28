export default function StudentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-white/5 rounded-lg" />
          <div className="h-3 w-24 bg-white/5 rounded mt-2" />
        </div>
        <div className="h-10 w-40 bg-white/10 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-28 bg-white/5 rounded mb-1" />
              <div className="h-3 w-40 bg-white/5 rounded" />
            </div>
            <div className="h-6 w-16 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
