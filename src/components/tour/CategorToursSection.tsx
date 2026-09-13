import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Category } from "@/src/types/tour";
import { useTours } from "@/src/hooks/useTours";
import { TourGrid } from "./TourGrid";
import { TourGridSkeleton } from "./TourGridSkeleton";
import { ROUTES } from "@/src/lib/constants";

export function CategoryToursSection({ category }: { category: Category }) {
  const { data, isLoading } = useTours({ category: category.id, _limit: 4 });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-primary" />
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">{category.name}</h2>
        </div>
        <Link
          href={ROUTES.category(String(category.id))}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          مشاهده همه
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
      {isLoading ? (
        <TourGridSkeleton count={4} />
      ) : (
        <TourGrid tours={data?.tours ?? []} categories={[category]} />
      )}
    </section>
  );
}