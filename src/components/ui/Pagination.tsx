import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition",
            p === page
              ? "bg-gradient-to-l from-primary to-coral text-primary-foreground shadow"
              : "text-foreground hover:bg-muted"
          )}
        >
          {p}
        </button>
      ))}

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