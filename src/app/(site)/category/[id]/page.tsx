"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/src/hooks/useCategories";
import { useSubcategories } from "@/src/hooks/useSubcategories";
import { useTours } from "@/src/hooks/useTours";
import { useDebounce } from "@/src/hooks/useDebounce";
import { TourGrid } from "@/src/components/tour/TourGrid";
import { TourGridSkeleton } from "@/src/components/tour/TourGridSkeleton";
import { SiteSidebar } from "@/src/components/tour/SiteSidebar";
import { SearchInput, Pagination } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";

const PAGE_SIZE = 8;

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const subcategoryParam = searchParams.get("subcategory");
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const { data: categories } = useCategories();
  const { data: allSubcategories } = useSubcategories();
  const category = categories?.find((c) => c.id === categoryId);
  const subcategories = allSubcategories?.filter((s) => s.category === categoryId) ?? [];

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    updateParams({ q: debouncedSearch || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isLoading } = useTours({
    category: categoryId,
    subcategory: subcategoryParam ? Number(subcategoryParam) : undefined,
    q: debouncedSearch || undefined,
    _page: page,
    _limit: PAGE_SIZE,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <SiteSidebar />

      <div className="flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
          {category ? `تورهای ${category.name}` : "در حال بارگذاری..."}
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ subcategory: null, page: null })}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              !subcategoryParam
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/70"
            )}
          >
            همه
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => updateParams({ subcategory: String(sub.id), page: null })}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                subcategoryParam === String(sub.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/70"
              )}
            >
              {sub.name}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            placeholder="جستجو در این دسته‌بندی..."
          />
        </div>
      </div>

      {isLoading ? (
        <TourGridSkeleton count={PAGE_SIZE} />
      ) : (
        <TourGrid tours={data?.tours ?? []} categories={categories} />
      )}

      <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: String(p) })} />
    </div>
  );
}