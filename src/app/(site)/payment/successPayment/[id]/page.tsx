import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { getOrderById } from "@/src/lib/api/orders";
import { formatPrice } from "@/src/lib/format";
import { ROUTES } from "@/src/lib/constants";

interface SuccessPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function SuccessPaymentPage({ params }: SuccessPaymentPageProps) {
  const { id } = await params;

  let order = null;
  try {
    order = await getOrderById(Number(id));
  } catch {
    order = null;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4 py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
        <CheckCircle2 className="h-10 w-10 text-secondary" />
      </span>

      <h1 className="text-lg font-extrabold text-foreground">پرداخت با موفقیت انجام شد</h1>

      <p className="text-sm text-muted-foreground">
        سفارش شما ثبت و تأیید شد. جهت هماهنگی سفر با شما تماس گرفته خواهد شد.
      </p>

      {order && (
        <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">شماره سفارش</span>
            <span className="font-bold text-foreground">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">مبلغ</span>
            <span className="font-bold text-primary">{formatPrice(order.prices)}</span>
          </div>
        </div>
      )}

      <Link
        href={ROUTES.orders}
        className="flex w-full items-center justify-center gap-1.5 rounded-full border border-border py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        مشاهده‌ی سفارش‌های من
      </Link>
    </div>
  );
}
