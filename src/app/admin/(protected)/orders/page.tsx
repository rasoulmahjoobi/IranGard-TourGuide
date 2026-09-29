"use client";
import { OrderDetailModal } from "@/src/components/admin/OrderDetailModal";
import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowDownUp, CheckCircle2, XCircle, Ban } from "lucide-react";
import { useOrders } from "@/src/hooks/useOrders";
import { useCancelOrder } from "@/src/hooks/useOrderMutations";
import { useAutoCorrectPage } from "@/src/hooks/useAutoCorrectPage";
import { Pagination, ConfirmDialog } from "@/src/components/ui";
import { formatPrice } from "@/src/lib/format";
import type { Order } from "@/src/types/order";
import { cn } from "@/src/lib/utils";

const PAGE_SIZE = 5;

type Tab = "pending" | "delivered" | "cancelled";

function StatusBadge({ order }: { order: Order }) {
  if (order.cancelled && order.cancelledBy === "admin") {
    return (
      <span className="flex w-fit items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
        <XCircle className="h-3 w-3" />
        لغوشده توسط ادمین
      </span>
    );
  }
  if (order.cancelled) {
    return (
      <span className="flex w-fit items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700">
        <Ban className="h-3 w-3" />
        لغوشده توسط کاربر
      </span>
    );
  }
  return (
    <span className="flex w-fit items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-bold text-secondary">
      <CheckCircle2 className="h-3 w-3" />
      تایید شده توسط ادمین
    </span>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = (searchParams.get("tab") as Tab) ?? "pending";
  const sortOrder = (searchParams.get("sort") as "asc" | "desc") ?? "desc";
  const page = Number(searchParams.get("page") ?? "1");

  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const cancelMutation = useCancelOrder();

  const queryParams =
    tab === "cancelled"
      ? { cancelled: "true" }
      : {
          delivered: tab === "delivered" ? "true" : "false",
          cancelledNe: "true",
        };

  const { data, isLoading } = useOrders({
    ...queryParams,
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
  useAutoCorrectPage(page, totalPages, isLoading, (p) =>
    updateParams({ page: String(p) }),
  );

  const toPersianDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fa-IR");

  const handleCancelConfirm = () => {
    if (!cancelTarget) return;
    cancelMutation.mutate(
      { id: cancelTarget.id, patch: { cancelled: true, cancelledBy: "admin" } },
      {
        onSuccess: () => {
          toast.success("سفارش با موفقیت لغو شد");
          setCancelTarget(null);
        },
        onError: () => toast.error("لغو سفارش با خطا مواجه شد"),
      },
    );
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "pending", label: "در انتظار تایید" },
    { key: "delivered", label: "تایید شده" },
    { key: "cancelled", label: "لغو شده" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-extrabold text-foreground">
        مدیریت سفارش‌ها
      </h1>

      <div className="flex flex-wrap gap-2 rounded-full bg-muted p-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => updateParams({ tab: t.key, page: null })}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              tab === t.key
                ? "bg-linear-to-l from-primary to-coral text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-right">نام کاربر</th>
              <th className="px-4 py-3 text-right">مجموع مبلغ</th>
              <th className="px-4 py-3 text-right">وضعیت</th>
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
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {!isLoading && data?.orders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
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
                <td className="px-4 py-3">
                  <StatusBadge order={order} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {toPersianDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDetailOrder(order)}
                      className="font-medium text-primary hover:underline"
                    >
                      بررسی سفارش
                    </button>
                    {!order.cancelled && (
                      <button
                        onClick={() => setCancelTarget(order)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        لغو سفارش
                      </button>
                    )}
                  </div>
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

      <ConfirmDialog
        open={cancelTarget !== null}
        title="لغو سفارش"
        description={`آیا از لغو سفارش «${cancelTarget?.username ?? ""} ${cancelTarget?.lastname ?? ""}» مطمئن هستید؟`}
        confirmLabel="لغو شود"
        danger
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelTarget(null)}
      />
      <OrderDetailModal
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
      />
    </div>
  );
}
