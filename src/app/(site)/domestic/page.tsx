"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/src/hooks/useCategories";
import { useTours } from "@/src/hooks/useTours";
import { useDebounce } from "@/src/hooks/useDebounce";
import { TourGrid } from "@/src/components/tour/TourGrid";
import { TourGridSkeleton } from "@/src/components/tour/TourGridSkeleton";
import { SiteSidebar } from "@/src/components/tour/SiteSidebar";
import { SearchInput, Pagination } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";
import { useSubcategories } from "@/src/hooks/useSubcategories";

const PAGE_SIZE = 8;
const INTERNATIONAL_CATEGORY_ID = 4;

export default function DomesticToursPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const categoryParam = searchParams.get("category");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const prevSearchRef = useRef(debouncedSearch);

  const { data: categories } = useCategories();
  const { data: allSubcategories } = useSubcategories();
  const domesticCategories =
    categories?.filter((c) => c.id !== INTERNATIONAL_CATEGORY_ID) ?? [];

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    if (prevSearchRef.current === debouncedSearch) return;
    prevSearchRef.current = debouncedSearch;
    updateParams({ q: debouncedSearch || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isLoading } = useTours({
    category: categoryParam ? Number(categoryParam) : undefined,
    categoryNe: categoryParam ? undefined : INTERNATIONAL_CATEGORY_ID,
    q: debouncedSearch || undefined,
    _page: page,
    _limit: PAGE_SIZE,
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <SiteSidebar
        categories={categories ?? []}
        subcategories={allSubcategories ?? []}
      />

      <div className="flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
          تورهای داخلی
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ category: null, page: null })}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              !categoryParam
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/70",
            )}
          >
            همه
          </button>
          {domesticCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                updateParams({ category: String(cat.id), page: null })
              }
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                categoryParam === String(cat.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/70",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            placeholder="جستجو در تورهای داخلی..."
          />
        </div>
      </div>

      {isLoading ? (
        <TourGridSkeleton count={PAGE_SIZE} />
      ) : (
        <TourGrid tours={data?.tours ?? []} categories={categories} />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => updateParams({ page: String(p) })}
      />
    </div>
  );
}
