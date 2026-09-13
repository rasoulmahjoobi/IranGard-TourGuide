import type { Category } from "@//src/types/tour";
import { useTours } from "@/src/hooks/useTours";
import { TourGrid } from "./TourGrid";
import { TourGridSkeleton } from "./TourGridSkeleton";

export function CategoryToursSection({ category }: { category: Category }) {
  const { data: tours, isLoading } = useTours({ category: category.id, _limit: 4 });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">{category.name}</h2>
      </div>
      {isLoading ? (
        <TourGridSkeleton count={4} />
      ) : (
        <TourGrid tours={tours ?? []} categories={[category]} />
      )}
    </section>
  );
}