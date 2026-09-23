"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useCategories } from "@/src/hooks/useCategories";
import { useTours } from "@/src/hooks/useTours";
import { useDebounce } from "@/src/hooks/useDebounce";
import { toPersianDate } from "@/src/lib/dateUtils";
import { TourGrid } from "@/src/components/tour/TourGrid";
import { SearchInput, Pagination, PageLoader } from "@/src/components/ui";

const PAGE_SIZE = 8;

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const selectedDate = searchParams.get("date"); // ISO میلادی، از هیرو میاد

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const prevSearchRef = useRef(debouncedSearch);

  const { data: categories } = useCategories();

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

  const buildPageHref = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(p));
      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname],
  );

  useEffect(() => {
    if (prevSearchRef.current === debouncedSearch) return;
    prevSearchRef.current = debouncedSearch;
    updateParams({ q: debouncedSearch || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isLoading } = useTours({
    q: debouncedSearch || undefined,
    departureFrom: selectedDate || undefined,
    _page: page,
    _limit: PAGE_SIZE,
    _sort: "createdAt",
    _order: "desc",
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-primary" />
          <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
            {searchInput ? `نتایج جستجو برای «${searchInput}»` : "جستجوی تور"}
          </h1>
        </div>
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            placeholder="مقصد، نام تور..."
          />
        </div>
      </div>
      {selectedDate && (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full bg-turquoise/10 px-4 py-1.5 text-sm font-semibold text-turquoise">
            تورهای از تاریخ {toPersianDate(selectedDate)} به بعد
            <button
              onClick={() => updateParams({ date: null, page: null })}
              aria-label="حذف فیلتر تاریخ"
              className="rounded-full hover:bg-turquoise/20"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      )}
      {isLoading ? (
        <PageLoader compact />
      ) : (
        <TourGrid tours={data?.tours ?? []} categories={categories} />
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={buildPageHref}
      />
    </div>
  );
}
