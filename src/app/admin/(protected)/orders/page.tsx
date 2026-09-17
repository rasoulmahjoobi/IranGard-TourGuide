"use client";

import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { useOrders } from "@/src/hooks/useOrders";
import { formatPrice } from "@/src/lib/format";
import { cn } from "@/src/lib/utils";

export default function AdminOrdersPage() {
  const [delivered, setDelivered] = useState<"false" | "true">("false");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: orders, isLoading } = useOrders({
    delivered,
    _sort: "createdAt",
    _order: sortOrder,
  });

  const toPersianDate = (ts: number) => new Date(ts).toLocaleDateString("fa-IR");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-extrabold text-foreground">مدیریت سفارش‌ها</h1>

      <div className="flex gap-6 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            checked={delivered === "false"}
            onChange={() => setDelivered("false")}
            className="accent-primary"
          />
          سفارش‌های در انتظار ارسال
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            checked={delivered === "true"}
            onChange={() => setDelivered("true")}
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
                  onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  زمان ثبت سفارش
                  <ArrowDownUp className={cn("h-3 w-3 transition-transform", sortOrder === "asc" && "rotate-180")} />
                </button>
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {!isLoading && orders?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  سفارشی یافت نشد
                </td>
              </tr>
            )}
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">
                  {order.username} {order.lastname}
                </td>
                <td className="px-4 py-3 text-accent-foreground">{formatPrice(order.prices)}</td>
                <td className="px-4 py-3 text-muted-foreground">{toPersianDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <button className="font-medium text-primary hover:underline">بررسی سفارش</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}