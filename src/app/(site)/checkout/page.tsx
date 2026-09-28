"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CheckCircle2, MapPin, User, Users } from "lucide-react";
import { Button, PageLoader } from "@/src/components/ui";
import { PersonFields } from "@/src/components/checkout/PersonFields";
import { checkoutSchema, type CheckoutValues } from "@/src/lib/schemas/checkout.schema";
import { createOrder } from "@/src/lib/api/orders";
import { clearCart, setCustomerPhone, type CartItem } from "@/src/store/cartSlice";
import type { RootState } from "@/src/store/store";
import { formatPrice } from "@/src/lib/format";
import { toPersianDate } from "@/src/lib/dateUtils";
import { INTERNATIONAL_CATEGORY_ID } from "@/src/lib/travelOptions";
import { normalizePerson, splitFullName } from "@/src/lib/personValidation";
import { ROUTES } from "@/src/lib/constants";

const emptyPerson = { fullName: "", phone: "", nationalId: "", address: "", bloodType: "", disease: "" };

interface CreatedOrder {
  id: number;
  total: number;
}

function CheckoutForm({ items, onCreated }: { items: CartItem[]; onCreated: (order: CreatedOrder) => void }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      leader: { ...emptyPerson },
      tours: items.map((item) => ({
        origin: "tehran" as const,
        companions: Array.from({ length: Math.max(0, item.peopleCount - 1) }, () => ({ ...emptyPerson })),
      })),
    },
  });

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.peopleCount, 0);
  const startDate = items.reduce((min, i) => (i.departureDate < min ? i.departureDate : min), items[0].departureDate);
  const endDate = items.reduce((max, i) => (i.endDate > max ? i.endDate : max), items[0].endDate);

  const onSubmit = async (values: CheckoutValues) => {
    setIsSubmitting(true);
    try {
      const leader = normalizePerson(values.leader);
      const { firstName, lastName } = splitFullName(leader.fullName);

      const order = await createOrder({
        username: firstName,
        lastname: lastName,
        address: leader.address,
        phone: leader.phone,
        startDate,
        endDate,
        leader,
        products: items.map((item, i) => {
          const tourValues = values.tours[i];
          const isInternational = item.category === INTERNATIONAL_CATEGORY_ID;
          const origin = isInternational ? "tehran" : tourValues.origin;
          return {
            id: item.tourId,
            name: item.name,
            count: String(item.peopleCount),
            price: String(item.unitPrice),
            origin,
            originLabel: origin === "tehran" ? "تهران" : item.location,
            ...(item.travelTypeLabel && { travelTypeLabel: item.travelTypeLabel }),
            companions: tourValues.companions.map(normalizePerson),
          };
        }),
        prices: total,
        delivered: "false",
      });

      // شماره سرگروه رو برای چک تداخل رزروهای بعدی نگه می‌داریم
      dispatch(setCustomerPhone(leader.phone));
      onCreated({ id: order.id, total });
      dispatch(clearCart());
    } catch (err: unknown) {
      const backendMsg = (err as { response?: { data?: { errors?: { msg?: string }[] } } })?.response?.data
        ?.errors?.[0]?.msg;
      toast.error(backendMsg ?? "ثبت سفارش با خطا مواجه شد، دوباره تلاش کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-extrabold text-foreground">نهایی کردن خرید</h1>

      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        {items.length} تور در سبد شما — جمع کل: <span className="font-bold text-primary">{formatPrice(total)}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <User className="h-4 w-4" />
            اطلاعات سرگروه
          </div>
          <PersonFields prefix="leader" register={register} errors={errors.leader} />
        </section>

        {items.map((item, i) => {
          const isInternational = item.category === INTERNATIONAL_CATEGORY_ID;
          const companionCount = Math.max(0, item.peopleCount - 1);
          const originOptions = isInternational
            ? [{ value: "tehran", label: "تهران" }]
            : [
                { value: "tehran", label: "تهران" },
                { value: "destination", label: `شهر مقصد (${item.location})` },
              ];

          return (
            <section key={item.id} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {toPersianDate(item.departureDate)} تا {toPersianDate(item.endDate)} • {item.peopleCount} نفر
                </span>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-medium text-foreground">مبدا همراهی:</legend>
                <div className={isInternational ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 gap-2 sm:grid-cols-2"}>
                  {originOptions.map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        value={option.value}
                        {...register(`tours.${i}.origin`)}
                        className="peer sr-only"
                      />
                      <span className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-border p-3 text-sm font-semibold text-foreground transition peer-checked:border-primary peer-checked:bg-primary/5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {isInternational && (
                  <span className="text-xs text-muted-foreground">تورهای خارجی فقط از تهران برگزار می‌شوند.</span>
                )}
              </fieldset>

              {companionCount > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-turquoise">
                    <Users className="h-4 w-4" />
                    اطلاعات همراهان ({companionCount} نفر)
                  </div>
                  {Array.from({ length: companionCount }).map((_, j) => (
                    <div key={j} className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4">
                      <span className="text-xs font-bold text-muted-foreground">همراه {j + 1}</span>
                      <PersonFields
                        prefix={`tours.${i}.companions.${j}`}
                        register={register}
                        errors={errors.tours?.[i]?.companions?.[j]}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "در حال ثبت سفارش..." : "ثبت سفارش و ادامه به پرداخت"}
        </Button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useSelector((s: RootState) => s.cart.items);
  const hydrated = useSelector((s: RootState) => s.cart.hydrated);
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

  useEffect(() => {
    if (hydrated && items.length === 0 && !createdOrder) {
      router.replace(ROUTES.cart);
    }
  }, [hydrated, items.length, createdOrder, router]);

  if (!hydrated) return <PageLoader />;

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
        <a>
          href={gatewayUrl}
          className="w-full rounded-full bg-linear-to-l from-primary to-coral py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.02]"
        
        
          پرداخت و تکمیل رزرو
        </a>
      </div>
    );
  }

  if (items.length === 0) return null;

  return <CheckoutForm items={items} onCreated={setCreatedOrder} />;
}