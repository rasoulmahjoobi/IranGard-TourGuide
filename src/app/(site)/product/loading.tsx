export default function ProductLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <div className="h-4 w-64 animate-pulse rounded-full bg-muted" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="aspect-4/3 w-full animate-pulse rounded-3xl bg-muted" />
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="h-7 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-muted" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-28 animate-pulse rounded-full bg-muted" />
              ))}
            </div>
            <div className="h-px bg-border" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>

        <div className="h-fit rounded-3xl border border-border bg-card p-6 shadow-lg">
          <div className="mb-4 h-8 w-32 animate-pulse rounded-full bg-muted" />
          <div className="mb-4 h-28 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}