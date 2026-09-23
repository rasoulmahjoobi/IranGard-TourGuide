import { TourGridSkeleton } from "@/src/components/tour/TourGridSkeleton";

export default function SiteLoading() {
  return (
    <div className="flex flex-col gap-14 pb-10">
      <div className="relative overflow-hidden rounded-b-[2.5rem] bg-secondary px-4 py-20 sm:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
          <div className="h-6 w-56 animate-pulse rounded-full bg-white/20" />
          <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-white/20" />
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/10" />
          <div className="h-14 w-full max-w-2xl animate-pulse rounded-full bg-white/20" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <div className="h-11 w-44 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-11 w-32 animate-pulse rounded-full bg-muted" />
          ))}
        </div>

        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-6">
            <div className="h-7 w-40 animate-pulse rounded-full bg-muted" />
            <TourGridSkeleton count={6} />
          </div>
        ))}
      </div>
    </div>
  );
}