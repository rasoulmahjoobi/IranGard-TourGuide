"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTours } from "@/src/hooks/useTours";
import { Button, Pagination } from "@/src/components/ui";

const PAGE_SIZE = 5;

export default function AdminInventoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading } = useTours({ _page: page, _limit: PAGE_SIZE });

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

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-foreground">مدیریت موجودی و قیمت‌ها</h1>
        <Button className="w-fit">ذخیره</Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-right">کالا</th>
              <th className="px-4 py-3 text-right">قیمت</th>
              <th className="px-4 py-3 text-right">موجودی</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {data?.tours.map((tour) => (
              <tr key={tour.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{tour.name}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={tour.price}
                    className="w-32 rounded-lg border border-border bg-background px-2 py-1.5 text-foreground outline-none focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={tour.quantity}
                    className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-foreground outline-none focus:border-primary"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: String(p) })} />

      <p className="text-xs text-muted-foreground">
        * این جدول فعلاً نمایشی است؛ ذخیره‌سازی واقعی در فاز بعدی اضافه می‌شود.
      </p>
    </div>
  );
}