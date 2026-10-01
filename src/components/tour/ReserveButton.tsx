"use client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Users, Plane, Bus } from "lucide-react";
import { Modal, Button } from "@/src/components/ui";
import { addToCart, type CartItem } from "@/src/store/cartSlice";
import type { RootState } from "@/src/store/store";
import type { Tour } from "@/src/types/tour";
import { getMyOrders } from "@/src/lib/api/orders";
import { formatPrice } from "@/src/lib/format";
import { computeTourEndDate, rangesOverlap } from "@/src/lib/tourDates";
import {
  INTERNATIONAL_CATEGORY_ID,
  hasLandOption,
  TRAVEL_TYPE_MULTIPLIER,
  TRAVEL_TYPE_LABEL,
} from "@/src/lib/travelOptions";
import { cn } from "@/src/lib/utils";

export function ReserveButton({ tour }: { tour: Tour }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const user = useSelector((s: RootState) => s.auth.user);
  const isCustomer = user?.role === "customer";

  const { data: myOrdersData } = useQuery({
    queryKey: ["orders", "me"],
    queryFn: getMyOrders,
    enabled: isCustomer,
  });

  const alreadyReserved =
    cartItems.some((item) => item.tourId === tour.id) ||
    (myOrdersData?.orders ?? []).some(
      (order) => !order.cancelled && order.products.some((p) => p.id === tour.id),
    );
  const [open, setOpen] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [isChecking, setIsChecking] = useState(false);

  const isInternational = tour.category === INTERNATIONAL_CATEGORY_ID;
  const landAvailable = isInternational && hasLandOption(tour.location);
  const [travelType, setTravelType] = useState<"land" | "air">(
    landAvailable ? "land" : "air",
  );

  const soldOut = tour.quantity <= 0;

  const unitPrice = useMemo(() => {
    if (!isInternational) return tour.price;
    return Math.round(tour.price * TRAVEL_TYPE_MULTIPLIER[travelType]);
  }, [isInternational, tour.price, travelType]);

  const totalPrice = unitPrice * peopleCount;
  const endDate = computeTourEndDate(tour.departureDate, tour.duration);

  const handleConfirm = async () => {
    if (alreadyReserved) {
      toast.error("شما این تور را قبلا رزرو کرده اید");
      return;
    }

    if (peopleCount < 1) {
      toast.error("تعداد نفرات باید حداقل ۱ باشد");
      return;
    }
    if (peopleCount > tour.quantity) {
      toast.error(`ظرفیت باقی‌مانده‌ی این تور فقط ${tour.quantity} نفر است`);
      return;
    }

    setIsChecking(true);
    try {
      // ۱) تداخل با تورهایی که همین الان تو سبد (سفارش‌های در انتظار پرداخت) هستن
      const cartConflict = cartItems.find((item) =>
        rangesOverlap(
          tour.departureDate,
          endDate,
          item.departureDate,
          item.endDate,
        ),
      );
      if (cartConflict) {
        toast.error(
          `این بازه با تور «${cartConflict.name}» که در سبد رزرو شماست تداخل زمانی دارد`,
        );
        return;
      }

      // ۲) تداخل با سفارش‌های قبلاً تأیید و پرداخت‌شده‌ی همین کاربر (اگه شماره تلفنش رو از قبل داریم)
      if (isCustomer) {
        const { orders: myOrders } = await getMyOrders();
        const paidConflict = myOrders.find(
          (order) =>
            !order.cancelled &&
            rangesOverlap(tour.departureDate, endDate, order.startDate, order.endDate),
        );
        if (paidConflict) {
          toast.error(
            "این بازه با یکی از سفارش‌های تأییدشده‌ی قبلی شما تداخل زمانی دارد",
          );
          return;
        }
      }

      const cartItem: CartItem = {
        id: `${tour.id}-${Date.now()}`,
        tourId: tour.id,
        category: tour.category,
        name: tour.name,
        thumbnail: tour.thumbnail,
        location: tour.location,
        duration: tour.duration,
        departureDate: tour.departureDate,
        endDate,
        peopleCount,
        unitPrice,
        ...(isInternational && {
          travelType,
          travelTypeLabel: TRAVEL_TYPE_LABEL[travelType],
        }),
      };

      dispatch(addToCart(cartItem));
      toast.success("تور به سبد رزرو اضافه شد");
      setOpen(false);
      setPeopleCount(1);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <button
        disabled={soldOut || alreadyReserved}
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-linear-to-l from-primary to-coral py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {alreadyReserved
          ? "شما این تور را قبلا رزرو کرده اید"
          : soldOut
            ? "پایان ظرفیت"
            : `بزن بریم ${tour.location}`}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`رزرو ${tour.name}`}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 rounded-2xl bg-muted p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {tour.thumbnail && (
                <img
                  src={tour.thumbnail}
                  alt={tour.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                {tour.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {tour.duration}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Users className="h-4 w-4" />
              تعداد نفرات:
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:border-primary"
              >
                −
              </button>
              <span className="w-8 text-center text-base font-bold text-foreground">
                {peopleCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPeopleCount((p) => Math.min(tour.quantity, p + 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:border-primary"
              >
                +
              </button>
              <span className="text-xs text-muted-foreground">
                (حداکثر {tour.quantity} نفر)
              </span>
            </div>
          </div>

          {isInternational && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                نوع سفر:
              </label>
              {landAvailable ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTravelType("land")}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition",
                      travelType === "land"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <Bus className="h-5 w-5 text-turquoise" />
                    <span className="text-xs font-semibold text-foreground">
                      زمینی/دریایی
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatPrice(
                        Math.round(tour.price * TRAVEL_TYPE_MULTIPLIER.land),
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelType("air")}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition",
                      travelType === "air"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <Plane className="h-5 w-5 text-coral" />
                    <span className="text-xs font-semibold text-foreground">
                      هوایی
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatPrice(
                        Math.round(tour.price * TRAVEL_TYPE_MULTIPLIER.air),
                      )}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-border p-3 text-sm text-muted-foreground">
                  <Plane className="h-4 w-4 text-coral" />
                  این مقصد فقط به‌صورت هوایی برگزار می‌شود
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl bg-accent/10 p-4">
            <span className="text-sm text-muted-foreground">مبلغ کل</span>
            <span className="text-lg font-extrabold text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <Button onClick={handleConfirm} disabled={isChecking}>
            {isChecking ? "در حال بررسی تداخل زمانی..." : "افزودن به سبد رزرو"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
