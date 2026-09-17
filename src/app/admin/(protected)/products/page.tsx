"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useCategories } from "@/src/hooks/useCategories";
import { useTours } from "@/src/hooks/useTours";
import { useDebounce } from "@/src/hooks/useDebounce";
import { TourImage } from "@/src/components/tour/TourImage";
import { getCategoryGradient } from "@/src/lib/tourVisuals";
import { formatPrice } from "@/src/lib/format";
import { SearchInput, Select, Button, AdminPagination } from "@/src/components/ui";

const PAGE_SIZE = 5;

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const { data: categories } = useCategories();
  const { data, isLoading } = useTours({
    q: debouncedSearch || undefined,
    category: categoryId ? Number(categoryId) : undefined,
    _page: page,
    _limit: PAGE_SIZE,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId]);

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;
  const categoryName = (id: number) => categories?.find((c) => c.id === id)?.name ?? "-";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-extrabold text-foreground">مدیریت کالاها</h1>
        <Button className="flex w-fit items-center gap-1.5">
          <Plus className="h-4 w-4" />
          افزودن کالا
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="جستجوی نام تور..." />
        </div>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="sm:w-56">
          <option value="">همه دسته‌بندی‌ها</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-right">تصویر</th>
              <th className="px-4 py-3 text-right">نام کالا</th>
              <th className="px-4 py-3 text-right">دسته بندی</th>
              <th className="px-4 py-3 text-right">قیمت</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {!isLoading && data?.tours.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  موردی یافت نشد
                </td>
              </tr>
            )}
            {data?.tours.map((tour) => (
              <tr key={tour.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl">
                    <TourImage src={tour.thumbnail} alt={tour.name} gradient={getCategoryGradient(tour.category)} />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{tour.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{categoryName(tour.category)}</td>
                <td className="px-4 py-3 text-accent-foreground">{formatPrice(tour.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-4 font-medium">
                    <button className="text-primary hover:underline">ویرایش</button>
                    <button className="text-red-600 hover:underline">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminPagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}