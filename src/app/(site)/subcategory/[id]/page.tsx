"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCategories } from "@/src/hooks/useCategories";
import { useSubcategories } from "@/src/hooks/useSubcategories";
import { useTours } from "@/src/hooks/useTours";
import { useDebounce } from "@/src/hooks/useDebounce";
import { TourGrid } from "@/src/components/tour/TourGrid";
import { TourGridSkeleton } from "@/src/components/tour/TourGridSkeleton";
import { SearchInput, Pagination } from "@/src/components/ui";
import { ROUTES } from "@/src/lib/constants";

const PAGE_SIZE = 8;

export default function SubcategoryPage() {
  const { id } = useParams<{ id: string }>();
  const subcategoryId = Number(id);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const prevSearchRef = useRef(debouncedSearch);

  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories();
  const subcategory = subcategories?.find((s) => s.id === subcategoryId);
  const parentCategory = categories?.find(
    (c) => c.id === subcategory?.category,
  );

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
    subcategory: subcategoryId,
    q: debouncedSearch || undefined,
    _page: page,
    _limit: PAGE_SIZE,
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={ROUTES.home} className="hover:text-primary">
          خانه
        </Link>
        <span>/</span>
        {parentCategory && (
          <>
            <Link
              href={ROUTES.category(String(parentCategory.id))}
              className="hover:text-primary"
            >
              {parentCategory.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-semibold text-foreground">
          {subcategory?.name ?? "..."}
        </span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-primary" />
          <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
            {subcategory ? `تورهای ${subcategory.name}` : "در حال بارگذاری..."}
          </h1>
        </div>
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            placeholder="جستجو در این زیردسته..."
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
