export function TourCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="aspect-[4/3] bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded-full bg-muted" />
        <div className="h-3 w-1/2 rounded-full bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
      </div>
    </div>
  );
}