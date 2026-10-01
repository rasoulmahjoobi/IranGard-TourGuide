"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { User, Users, MapPin, Phone, CreditCard, Droplet, Stethoscope } from "lucide-react";
import { Modal, Button, ConfirmDialog } from "@/src/components/ui";
import { useCancelOrder } from "@/src/hooks/useOrderMutations";
import { formatPrice } from "@/src/lib/format";
import { toPersianDate } from "@/src/lib/dateUtils";
import { computeRefund } from "@/src/lib/cardValidation";
import type { Order, PersonInfo } from "@/src/types/order";
import { cn } from "@/src/lib/utils";

function PersonMiniCard({ person, title }: { person: PersonInfo; title: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-muted/60 p-3 text-xs text-foreground">
      <span className="font-bold text-muted-foreground">{title}</span>
      <span className="flex items-center gap-1.5">
        <User className="h-3 w-3" /> {person.fullName}
      </span>
      <span className="flex items-center gap-1.5" dir="ltr">
        <Phone className="h-3 w-3" /> {person.phone}
      </span>
      <span className="flex items-center gap-1.5" dir="ltr">
        <CreditCard className="h-3 w-3" /> {person.nationalId}
      </span>
      <span className="flex items-center gap-1.5">
        <Droplet className="h-3 w-3" /> {person.bloodType}
      </span>
      <span className="flex items-center gap-1.5">
        <Stethoscope className="h-3 w-3" /> {person.disease}
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="h-3 w-3" /> {person.address}
      </span>
    </div>
  );
}

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const updateMutation = useCancelOrder();
  const [confirmAction, setConfirmAction] = useState<"deliver" | "cancel" | null>(null);

  if (!order) return null;

  const isCancelled = !!order.cancelled;
  const isDelivered = order.delivered === "true";

  const runAction = () => {
    if (confirmAction === "deliver") {
      updateMutation.mutate(
        { id: order.id, patch: { delivered: "true" } },
        {
          onSuccess: () => {
            toast.success("سفارش تأیید شده علامت‌گذاری شد");
            setConfirmAction(null);
            onClose();
          },
          onError: () => toast.error("خطا در تغییر وضعیت سفارش"),
        }
      );
    } else if (confirmAction === "cancel") {
      updateMutation.mutate(
        { id: order.id, patch: { cancelled: true, cancelledBy: "admin" } },
        {
          onSuccess: () => {
            toast.success("سفارش لغو شد");
            setConfirmAction(null);
            onClose();
          },
          onError: () => toast.error("خطا در لغو سفارش"),
        }
      );
    }
  };

  return (
    <>
      <Modal open={!!order} onClose={onClose} title={`جزئیات سفارش #${order.id}`}>
        <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto pl-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>زمان ثبت: {toPersianDate(String(order.startDate))}</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-bold",
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : isDelivered
                    ? "bg-secondary/10 text-secondary"
                    : "bg-accent/15 text-accent-foreground"
              )}
            >
              {isCancelled
                ? order.cancelledBy === "admin"
                  ? "لغوشده توسط ادمین"
                  : "لغوشده توسط کاربر"
                : isDelivered
                  ? "تایید شده"
                  : "در انتظار تایید"}
            </span>
          </div>

          {order.leader ? (
            <PersonMiniCard person={order.leader} title="سرگروه" />
          ) : (
            <div className="rounded-xl bg-muted/60 p-3 text-xs text-foreground">
              <div className="mb-1 font-bold text-muted-foreground">اطلاعات مشتری</div>
              <div>نام: {order.username} {order.lastname}</div>
              <div dir="ltr">تلفن: {order.phone}</div>
              <div>آدرس: {order.address}</div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {order.products.map((product, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-2xl border border-border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-foreground">{product.name}</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(Number(product.price) * Number(product.count))}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{product.count} نفر</span>
                  {product.originLabel && <span>مبدا: {product.originLabel}</span>}
                  {product.travelTypeLabel && <span>{product.travelTypeLabel}</span>}
                </div>

                {product.companions && product.companions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-turquoise">
                      <Users className="h-3 w-3" />
                      همراهان ({product.companions.length} نفر)
                    </span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {product.companions.map((c, j) => (
                        <PersonMiniCard key={j} person={c} title={`همراه ${j + 1}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">جمع کل</span>
            <span className="text-base font-extrabold text-foreground">{formatPrice(order.prices)}</span>
          </div>

          {isCancelled && order.refundCard && (
            <div className="flex flex-col gap-1 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              {(() => {
                const { fee, refund } = computeRefund(order.prices);
                return (
                  <>
                    <span>کارمزد لغو: {formatPrice(fee)}</span>
                    <span>
                      بازگشت به کارت {order.refundCard}: <span className="font-bold text-foreground">{formatPrice(refund)}</span>
                    </span>
                  </>
                );
              })()}
            </div>
          )}

          {!isCancelled && (
            <div className="flex gap-3 border-t border-border pt-4">
              {!isDelivered && (
                <Button onClick={() => setConfirmAction("deliver")} className="flex-1">
                  تایید (بزن بریم)
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setConfirmAction("cancel")}
                className="flex-1 bg-red-50! text-red-700! hover:bg-red-100!"
              >
                لغو سفارش
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction === "deliver" ? "تایید سفارش" : "لغو سفارش"}
        description={
          confirmAction === "deliver"
            ? "آیا از و علامت‌گذاری این سفارش به‌عنوان تایید شده مطمئن هستید؟"
            : "آیا از لغو این سفارش مطمئن هستید؟"
        }
        confirmLabel={confirmAction === "deliver" ? "تایید شود" : "لغو شود"}
        danger={confirmAction === "cancel"}
        onConfirm={runAction}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}