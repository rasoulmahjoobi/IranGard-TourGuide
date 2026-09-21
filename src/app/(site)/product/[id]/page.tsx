import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, Clock, CalendarDays, ChevronLeft, Users, Ticket } from "lucide-react";
import { getTourById } from "@/src/lib/api/tours";
import { toPersianDate } from "@/src/lib/dateUtils";
import { formatPrice } from "@/src/lib/format";
import { ProductGallery } from "@/src/components/tour/ProductGallery";
import { ROUTES } from "@/src/lib/constants";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let tour;
  try {
    tour = await getTourById(Number(id));
  } catch {
    notFound();
  }
  if (!tour) notFound();

  const soldOut = tour.quantity <= 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={ROUTES.home} className="hover:text-primary">خانه</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        {tour.categoryName && (
          <>
            <Link href={ROUTES.category(String(tour.category))} className="hover:text-primary">
              {tour.categoryName}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
          </>
        )}
        {tour.subcategoryName && (
          <>
            <Link href={ROUTES.subcategory(String(tour.subcategory))} className="hover:text-primary">
              {tour.subcategoryName}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
          </>
        )}
        <span className="font-semibold text-foreground">{tour.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* ستون اصلی */}
        <div className="flex flex-col gap-6">
          <ProductGallery images={tour.image} name={tour.name} categoryId={tour.category} />

          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-extrabold text-foreground">{tour.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {tour.location}
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-bold text-accent-foreground">{tour.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                <Clock className="h-3.5 w-3.5 text-turquoise" />
                {tour.duration}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                <CalendarDays className="h-3.5 w-3.5 text-turquoise" />
                حرکت: {toPersianDate(tour.departureDate)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                <Users className="h-3.5 w-3.5 text-turquoise" />
                {soldOut ? "ظرفیت تکمیل" : `${tour.quantity} نفر ظرفیت باقی‌مانده`}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div>
              <h2 className="mb-3 text-base font-bold text-foreground">درباره‌ی این تور</h2>
              <div
                className="prose prose-sm max-w-none text-muted-foreground [&_li]:mr-5 [&_ol]:list-decimal [&_p]:leading-8 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </div>
          </div>
        </div>

        {/* سایدبار رزرو */}
        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-lg lg:sticky lg:top-24">
          <div className="mb-4 flex items-end justify-between">
            <span className="text-sm text-muted-foreground">شروع قیمت از</span>
            <span className="text-2xl font-extrabold text-primary">
              {formatPrice(tour.price)}
            </span>
          </div>

          <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-muted p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                تاریخ حرکت
              </span>
              <span className="font-semibold text-foreground">{toPersianDate(tour.departureDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Ticket className="h-4 w-4" />
                مدت سفر
              </span>
              <span className="font-semibold text-foreground">{tour.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4" />
                ظرفیت باقی‌مانده
              </span>
              <span className="font-semibold text-foreground">{soldOut ? "—" : tour.quantity}</span>
            </div>
          </div>

          <button
            disabled={soldOut}
            className="w-full rounded-full bg-linear-to-l from-primary to-coral py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {soldOut ? "ظرفیت این تور تکمیل شده است" : "رزرو این تور"}
          </button>
        </aside>
      </div>
    </div>
  );
}