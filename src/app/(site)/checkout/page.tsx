"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";
import { Input, Textarea, Button } from "@/src/components/ui";
import { checkoutSchema, type CheckoutValues } from "@/src/lib/schemas/checkout.schema";
import { createOrder } from "@/src/lib/api/orders";
import { clearCart, setCustomerPhone } from "@/src/store/cartSlice";
import type { RootState } from "@/src/store/store";
import { formatPrice } from "@/src/lib/format";
import { ROUTES } from "@/src/lib/constants";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector((s: RootState) => s.cart.items);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ id: number; total: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema) });

  if (items.length === 0 && !createdOrder) {
    router.replace(ROUTES.cart);
    return null;
  }

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.peopleCount, 0);
  const startDate = items.reduce((min, i) => (i.departureDate < min ? i.departureDate : min), items[0]?.departureDate ?? "");
  const endDate = items.reduce((max, i) => (i.endDate > max ? i.endDate : max), items[0]?.endDate ?? "");

  const onSubmit = async (values: CheckoutValues) => {
    setIsSubmitting(true);
    try {
      // شماره تلفن رو همین‌جا ذخیره می‌کنیم — تا دفعه‌ی بعد که کاربر خواست رزرو جدید بزنه،
      // ReserveButton بتونه سفارش‌های تأییدشده‌ی همین شماره رو چک کنه
      dispatch(setCustomerPhone(values.phone));

      const order = await createOrder({
        username: values.firstName,
        lastname: values.lastName,
        address: values.address,
        phone: values.phone,
        startDate,
        endDate,
        products: items.map((item) => ({
          id: item.tourId,
          name: item.name,
          count: String(item.peopleCount),
          price: String(item.unitPrice),
        })),
        prices: total,
        delivered: "false",
      });

      dispatch(clearCart());
      setCreatedOrder({ id: order.id, total });
    } catch (err: unknown) {
      const backendMsg =
        (err as { response?: { data?: { errors?: { msg?: string }[] } } })?.response?.data?.errors?.[0]?.msg;
      toast.error(backendMsg ?? "ثبت سفارش با خطا مواجه شد، دوباره تلاش کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrder) {
    const gatewayUrl = `${process.env.NEXT_PUBLIC_API_URL}/payment/gateway/${createdOrder.id}`;
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <CheckCircle2 className="h-8 w-8 text-secondary" />
        </span>
        <h1 className="text-lg font-extrabold text-foreground">سفارش شما ثبت شد</h1>
        <p className="text-sm text-muted-foreground">
          شماره سفارش: <span className="font-bold text-foreground">{createdOrder.id}</span> — مبلغ قابل پرداخت:{" "}
          <span className="font-bold text-primary">{formatPrice(createdOrder.total)}</span>
        </p>
       < a
          href={gatewayUrl}
          className="w-full rounded-full bg-linear-to-l from-primary to-coral py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.02]"
        >
          پرداخت و تکمیل رزرو
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-extrabold text-foreground">نهایی کردن خرید</h1>

      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        {items.length} تور در سبد شما — جمع کل:{" "}
        <span className="font-bold text-primary">{formatPrice(total)}</span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2"
      >
        <Input label="نام:" {...register("firstName")} error={errors.firstName?.message} />
        <Input label="نام خانوادگی:" {...register("lastName")} error={errors.lastName?.message} />
        <div className="sm:col-span-2">
          <Textarea label="آدرس کامل:" rows={3} {...register("address")} error={errors.address?.message} />
        </div>
        <Input
          label="تلفن همراه: جهت هماهنگی سفر"
          dir="ltr"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "در حال ثبت سفارش..." : "ثبت سفارش و ادامه به پرداخت"}
          </Button>
        </div>
      </form>
    </div>
  );
}