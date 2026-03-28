export default function AdminSubscriptionsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-white/5 rounded-lg animate-pulse" />
      <div className="grid lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-80 bg-white/5 rounded-xl animate-pulse" />
    </div>
  );
}
