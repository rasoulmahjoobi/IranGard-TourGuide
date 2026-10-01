"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Trash2, Users, Plane, Bus, ShoppingBag } from "lucide-react";
import { Button, ConfirmDialog, PageLoader } from "@/src/components/ui";
import { removeFromCart, type CartItem } from "@/src/store/cartSlice";
import type { RootState } from "@/src/store/store";
import { formatPrice } from "@/src/lib/format";
import { toPersianDate } from "@/src/lib/dateUtils";
import { ROUTES } from "@/src/lib/constants";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector((s: RootState) => s.cart.items);
  const hydrated = useSelector((s: RootState) => s.cart.hydrated);
  const user = useSelector((s: RootState) => s.auth.user);
  const [pendingRemove, setPendingRemove] = useState<CartItem | null>(null);

  if (!hydrated) return <PageLoader />;

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.peopleCount, 0);

  const confirmRemove = () => {
    if (!pendingRemove) return;
    dispatch(removeFromCart(pendingRemove.id));
    toast.success("تور از سبد رزرو حذف شد");
    setPendingRemove(null);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </span>
        <h1 className="text-lg font-extrabold text-foreground">سبد رزرو شما خالی است</h1>
        <p className="text-sm text-muted-foreground">هنوز توری به سبد رزرو اضافه نکرده‌اید.</p>
        <Link href={ROUTES.home}>
          <Button>مشاهده‌ی تورها</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-extrabold text-foreground">سبد رزرو</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-28">
              {item.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-sm font-bold text-foreground">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.location} • {item.duration}
              </span>
              <span className="text-xs text-muted-foreground">
                {toPersianDate(item.departureDate)} تا {toPersianDate(item.endDate)}
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {item.peopleCount} نفر
                </span>
                {item.travelTypeLabel && (
                  <span className="flex items-center gap-1">
                    {item.travelType === "air" ? <Plane className="h-3.5 w-3.5" /> : <Bus className="h-3.5 w-3.5" />}
                    {item.travelTypeLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
              <span className="text-base font-extrabold text-primary">
                {formatPrice(item.unitPrice * item.peopleCount)}
              </span>
              <button
                onClick={() => setPendingRemove(item)}
                className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Button onClick={() => router.push(user?.role === "customer" ? ROUTES.checkout : `${ROUTES.login}?next=${ROUTES.checkout}`)}>نهایی کردن سبد رزرو</Button>
        <span className="text-base font-bold text-foreground">
          جمع کل: <span className="text-primary">{formatPrice(total)}</span>
        </span>
      </div>

      <ConfirmDialog
        open={pendingRemove !== null}
        title="حذف تور از سبد رزرو"
        description={`آیا از حذف «${pendingRemove?.name ?? ""}» از سبد رزرو مطمئن هستید؟`}
        confirmLabel="حذف شود"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setPendingRemove(null)}
      />
    </div>
  );
}