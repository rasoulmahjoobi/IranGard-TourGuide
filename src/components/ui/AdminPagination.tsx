import { ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** فقط صفحه‌ی اول، صفحه‌ی جاری و صفحه‌ی آخر رو نشون می‌ده، با ... بین شکاف‌ها */
function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, current, total]);
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

export function AdminPagination({ page, totalPages, onChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null;
  const items = getPageItems(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="صفحه قبل"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`e-${i}`} className="flex h-9 w-9 items-center justify-center text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition",
              item === page
                ? "bg-gradient-to-l from-primary to-coral text-primary-foreground shadow"
                : "text-foreground hover:bg-muted"
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="صفحه بعد"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}