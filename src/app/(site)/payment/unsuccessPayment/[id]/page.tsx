import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { getOrderById } from "@/src/lib/api/orders";
import { formatPrice } from "@/src/lib/format";
import { ROUTES } from "@/src/lib/constants";

interface UnsuccessPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function UnsuccessPaymentPage({ params }: UnsuccessPaymentPageProps) {
  const { id } = await params;

  let order = null;
  try {
    order = await getOrderById(Number(id));
  } catch {
    order = null;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4 py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-10 w-10 text-red-600" />
      </span>

      <h1 className="text-lg font-extrabold text-foreground">پرداخت ناموفق بود</h1>

      <p className="text-sm text-muted-foreground">
        پرداخت شما تکمیل نشد. سفارش همچنان در انتظار پرداخت باقی مانده و می‌توانید دوباره تلاش کنید.
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

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/payment/gateway/${id}`}
          className="flex-1 rounded-full bg-linear-to-l from-primary to-coral py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.02]"
        >
          تلاش مجدد برای پرداخت
        </a>
        <Link
          href={ROUTES.home}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
