import Link from "next/link";
import { Mountain, Landmark, Waves, Plane, Compass, type LucideIcon } from "lucide-react";
import type { Category } from "@/src/types/tour";
import { ROUTES } from "@/src/lib/constants";
import { cn } from "@/src/lib/utils";

const iconMap: Record<number, { icon: LucideIcon; color: string }> = {
  1: { icon: Mountain, color: "text-turquoise" },
  2: { icon: Landmark, color: "text-accent" },
  3: { icon: Waves, color: "text-primary" },
  4: { icon: Plane, color: "text-coral" },
};
const fallbackIcon = { icon: Compass, color: "text-secondary" };

export function CategoryChips({ categories }: { categories: Category[] }) {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      {categories.map((cat, i) => {
        const { icon: Icon, color } = iconMap[cat.id] ?? fallbackIcon;
        return (
          <Link
            key={cat.id}
            href={ROUTES.category(String(cat.id))}
            style={{ animationDelay: `${i * 80}ms` }}
            className="animate-fade-up flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
          >
            <Icon className={cn("h-4 w-4", color)} />
            <span className="text-sm font-semibold text-foreground">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}