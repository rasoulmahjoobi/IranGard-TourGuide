import type { Category, Tour } from "@/src/types/tour";
import { TourCard } from "./TourCard";

interface TourGridProps {
  tours: Tour[];
  categories?: Category[];
}

export function TourGrid({ tours, categories = [] }: TourGridProps) {
  const categoryName = (id: number) => categories.find((c) => c.id === id)?.name;

  if (tours.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
        فعلاً توری در این دسته‌بندی ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tours.map((tour, i) => (
        <TourCard key={tour.id} tour={tour} categoryName={categoryName(tour.category)} delay={i * 100} />
      ))}
    </div>
  );
}