export default function AdminCoachesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse" />
      <div className="flex gap-3">
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
