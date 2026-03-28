export default function StudentLoading() {
  return (
    <div className="space-y-5 py-6 animate-pulse">
      <div>
        <div className="h-6 w-40 bg-white/5 rounded-lg" />
        <div className="h-3 w-24 bg-white/5 rounded mt-2" />
      </div>
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <div className="h-3 w-28 bg-white/5 rounded mb-3" />
        <div className="h-5 w-40 bg-white/10 rounded mb-2" />
        <div className="h-3 w-32 bg-white/5 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
            <div className="h-7 w-16 bg-white/10 rounded mx-auto mb-2" />
            <div className="h-3 w-20 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5 text-center">
            <div className="h-8 w-8 bg-white/10 rounded mx-auto mb-2" />
            <div className="h-3 w-24 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
