export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
      <div className="h-11 w-full max-w-md animate-pulse rounded-full bg-muted" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-0">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-1/4 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}