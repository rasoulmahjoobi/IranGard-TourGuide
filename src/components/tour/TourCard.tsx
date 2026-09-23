import Link from "next/link";
import type { Tour } from "@/src/types/tour";
import { getCategoryGradient } from "@/src/lib/tourVisuals";
import { TourImage } from "./TourImage";
import { ROUTES } from "@/src/lib/constants";
import { MapPin, Star, Clock, CalendarDays } from "lucide-react";
import { toPersianDate } from "@/src/lib/dateUtils";

interface TourCardProps {
  tour: Tour;
  categoryName?: string;
  delay?: number;
}

export function TourCard({ tour, categoryName, delay = 0 }: TourCardProps) {
  const soldOut = tour.quantity <= 0;

  return (
    <Link
      href={ROUTES.product(String(tour.id))}
      style={{ animationDelay: `${delay}ms` }}
      className="group animate-fade-up block overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
          <TourImage src={tour.thumbnail} alt={tour.name} gradient={getCategoryGradient(tour.category)} />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {soldOut && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-linear-to-l from-red-600 to-orange-500 px-3 py-1 text-[11px] font-bold text-white shadow-md">
            پایان ظرفیت
          </span>
        )}

        {categoryName && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-secondary">
            {categoryName}
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{tour.location}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-bold text-foreground">{tour.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-accent-foreground">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {tour.rating}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {tour.duration}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          حرکت: {toPersianDate(tour.departureDate)}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">شروع قیمت از</span>
          <span className="text-lg font-extrabold text-primary">
            {tour.price.toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">تومان</span>
          </span>
        </div>
      </div>
    </Link>
  );
}