export default function MessagesLoading() {
  return (
    <div className="space-y-4 py-6 animate-pulse">
      <div className="h-6 w-28 bg-white/5 rounded-lg" />
      <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div className={`${i % 2 === 0 ? "w-2/3" : "w-1/2"} h-12 bg-white/5 rounded-xl`} />
          </div>
        ))}
      </div>
      <div className="h-12 w-full bg-white/10 rounded-xl" />
    </div>
  );
}
