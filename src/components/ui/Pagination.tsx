import Link from "next/link";
import { ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** برای هر شماره صفحه، آدرس کامل (href) رو می‌سازه — تا لینک واقعی باشه و بشه با کلیک راست تو تب جدید بازش کرد */
  buildHref: (page: number) => string;
}

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, current - 1, current, current + 1, total]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items: (number | "ellipsis")[] = [];
  let prev: number | null = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = getPageItems(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-label="صفحه قبل"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary",
          page === 1 && "pointer-events-none cursor-not-allowed opacity-40"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`e-${i}`} className="flex h-9 w-9 items-center justify-center text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(item)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition",
              item === page
                ? "bg-linear-to-l from-primary to-coral text-primary-foreground shadow"
                : "text-foreground hover:bg-muted"
            )}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-label="صفحه بعد"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary",
          page === totalPages && "pointer-events-none cursor-not-allowed opacity-40"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}