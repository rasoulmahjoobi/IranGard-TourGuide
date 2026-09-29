"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PackageOpen, Users, XCircle, CheckCircle2, Clock } from "lucide-react";
import { useMyOrders } from "@/src/hooks/useOrders";
import { useCancelOrder } from "@/src/hooks/useOrderMutations";
import { CancelOrderModal } from "@/src/components/orders/CancelOrderModal";
import { Button, PageLoader } from "@/src/components/ui";
import type { RootState } from "@/src/store/store";
import type { Order } from "@/src/types/order";
import { formatPrice } from "@/src/lib/format";
import { toPersianDate } from "@/src/lib/dateUtils";
import { computeRefund } from "@/src/lib/cardValidation";
import { ROUTES } from "@/src/lib/constants";
import { cn } from "@/src/lib/utils";

type Tab = "confirmed" | "pending" | "cancelled";

function OrderCard({
  order,
  onCancelClick,
}: {
  order: Order;
  onCancelClick?: (order: Order) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-foreground">
          سفارش #{order.id}
        </span>
        <span className="text-xs text-muted-foreground">
          {toPersianDate(String(order.startDate))}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {order.products.map((p, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-foreground">
              {p.name}{" "}
              <span className="text-xs text-muted-foreground">
                ({p.count} نفر)
              </span>
            </span>
            <span className="font-semibold text-primary">
              {formatPrice(Number(p.price) * Number(p.count))}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">جمع کل</span>
        <span className="text-base font-extrabold text-foreground">
          {formatPrice(order.prices)}
        </span>
      </div>

      {order.cancelled ? (
        <div className="flex flex-col gap-1 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-semibold text-red-600">
            <XCircle className="h-3.5 w-3.5" />
            {order.cancelledBy === "admin"
              ? "لغوشده توسط ادمین"
              : "لغوشده توسط کاربر"}
          </span>{" "}
          {(() => {
            const { fee, refund } = computeRefund(order.prices);
            return (
              <>
                <span>کارمزد لغو: {formatPrice(fee)}</span>
                <span>
                  مبلغ بازگشتی به کارت {order.refundCard ?? "—"}:{" "}
                  <span className="font-bold text-foreground">
                    {formatPrice(refund)}
                  </span>
                </span>
              </>
            );
          })()}
        </div>
      ) : (
        onCancelClick && (
          <button
            onClick={() => onCancelClick(order)}
            className="mt-1 w-fit self-end text-xs font-semibold text-red-600 hover:underline"
          >
            لغو سفارش
          </button>
        )
      )}
    </div>
  );
}

export default function OrdersPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const authHydrated = useSelector((s: RootState) => s.auth.hydrated);
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const hydrated = useSelector((s: RootState) => s.cart.hydrated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [tab, setTab] = useState<Tab>("confirmed");
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const cancelMutation = useCancelOrder();

  const isCustomer = user?.role === "customer";
  const { data, isLoading } = useMyOrders({ enabled: isCustomer });

  if (!mounted || !hydrated || !authHydrated) return <PageLoader />;

  const allOrders = data?.orders ?? [];
  const confirmedOrders = allOrders.filter((o) => o.paid && !o.cancelled);
  const pendingOrders = allOrders.filter((o) => !o.paid && !o.cancelled);
  const cancelledOrders = allOrders.filter((o) => o.cancelled);

  const tabs: {
    key: Tab;
    label: string;
    icon: typeof CheckCircle2;
    count: number;
  }[] = [
    {
      key: "confirmed",
      label: "پرداخت‌شده و تأییدشده",
      icon: CheckCircle2,
      count: confirmedOrders.length,
    },
    {
      key: "pending",
      label: "در انتظار پرداخت",
      icon: Clock,
      count: pendingOrders.length + cartItems.length,
    },
    {
      key: "cancelled",
      label: "لغوشده",
      icon: XCircle,
      count: cancelledOrders.length,
    },
  ];

  const handleConfirmCancel = (maskedCard: string) => {
    if (!cancelTarget) return;
    cancelMutation.mutate(
      {
        id: cancelTarget.id,
        patch: {
          cancelled: true,
          cancelledBy: "customer",
          refundCard: maskedCard,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            "سفارش با موفقیت لغو شد و مبلغ (پس از کسر ۱۰٪ کارمزد) بازگردانده می‌شود",
          );
          setCancelTarget(null);
        },
        onError: () =>
          toast.error("لغو سفارش با خطا مواجه شد، دوباره تلاش کنید"),
      },
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-extrabold text-foreground">سفارش‌های من</h1>

      <div className="flex flex-wrap gap-2 rounded-full bg-muted p-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition",
              tab === t.key
                ? "bg-linear-to-l from-primary to-coral text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            <span className="rounded-full bg-black/10 px-1.5 text-[10px]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {!isCustomer && tab !== "pending" && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          <PackageOpen className="h-8 w-8" />
          برای دیدن سفارش‌ها ابتدا وارد حساب کاربری شوید.
        </div>
      )}

      {isCustomer && isLoading && <PageLoader compact />}

      {tab === "confirmed" && isCustomer && !isLoading && (
        <div className="flex flex-col gap-4">
          {confirmedOrders.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              سفارش تأییدشده‌ای وجود ندارد.
            </p>
          ) : (
            confirmedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancelClick={setCancelTarget}
              />
            ))
          )}
        </div>
      )}

      {tab === "pending" && (
        <div className="flex flex-col gap-4">
          {pendingOrders.map((order) => (
            <div key={order.id} className="flex flex-col gap-3">
              <OrderCard order={order} />
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/payment/gateway/${order.id}`}
                className="w-full rounded-full bg-linear-to-l from-primary to-coral py-3 text-center text-sm font-bold text-primary-foreground"
              >
                ادامه پرداخت سفارش #{order.id}
              </a>
            </div>
          ))}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-foreground">{item.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {item.peopleCount} نفر • {toPersianDate(item.departureDate)}
                </span>
              </div>
              <span className="text-sm font-extrabold text-primary">
                {formatPrice(item.unitPrice * item.peopleCount)}
              </span>
            </div>
          ))}
          {cartItems.length > 0 && (
            <Link href={ROUTES.cart}>
              <Button className="w-full">مشاهده و تکمیل سبد رزرو</Button>
            </Link>
          )}
          {cartItems.length === 0 && pendingOrders.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              سفارش در انتظار پرداختی وجود ندارد.
            </p>
          )}
        </div>
      )}

      {tab === "cancelled" && isCustomer && !isLoading && (
        <div className="flex flex-col gap-4">
          {cancelledOrders.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              سفارش لغوشده‌ای وجود ندارد.
            </p>
          ) : (
            cancelledOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      )}

      <CancelOrderModal
        open={cancelTarget !== null}
        totalPaid={cancelTarget?.prices ?? 0}
        isSubmitting={cancelMutation.isPending}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
