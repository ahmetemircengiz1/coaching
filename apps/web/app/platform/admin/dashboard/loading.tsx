export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-64 bg-white/5 rounded-xl animate-pulse lg:col-span-2" />
      </div>
    </div>
  );
}
