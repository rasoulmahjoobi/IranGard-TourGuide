"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp } from "lucide-react";
import { useOrders } from "@/src/hooks/useOrders";
import { formatPrice } from "@/src/lib/format";
import { Pagination } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";

const PAGE_SIZE = 5;

export default function AdminOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const delivered =
    (searchParams.get("delivered") as "false" | "true") ?? "false";
  const sortOrder = (searchParams.get("sort") as "asc" | "desc") ?? "desc";
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading } = useOrders({
    delivered,
    _sort: "createdAt",
    _order: sortOrder,
    _page: page,
    _limit: PAGE_SIZE,
  });

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

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;
  const toPersianDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fa-IR");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-extrabold text-foreground">
        مدیریت سفارش‌ها
      </h1>
      <div className="flex gap-6 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            checked={delivered === "false"}
            onChange={() => updateParams({ delivered: null, page: null })}
            className="accent-primary"
          />
          سفارش‌های در انتظار ارسال
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            checked={delivered === "true"}
            onChange={() => updateParams({ delivered: "true", page: null })}
            className="accent-primary"
          />
          سفارش‌های تحویل شده
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-right">نام کاربر</th>
              <th className="px-4 py-3 text-right">مجموع مبلغ</th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() =>
                    updateParams({
                      sort: sortOrder === "asc" ? "desc" : "asc",
                      page: null,
                    })
                  }
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  زمان ثبت سفارش
                  <ArrowDownUp
                    className={cn(
                      "h-3 w-3 transition-transform",
                      sortOrder === "asc" && "rotate-180",
                    )}
                  />
                </button>
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {!isLoading && data?.orders.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  سفارشی یافت نشد
                </td>
              </tr>
            )}
            {data?.orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {order.username} {order.lastname}
                </td>
                <td className="px-4 py-3 text-accent-foreground">
                  {formatPrice(order.prices)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {toPersianDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <button className="font-medium text-primary hover:underline">
                    بررسی سفارش
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={buildPageHref}
      />
    </div>
  );
}
