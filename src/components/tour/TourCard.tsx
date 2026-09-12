import { MapPin, Star, Clock, Heart } from "lucide-react";

interface TourCardProps {
  title: string;
  location: string;
  duration: string;
  price: string;
  rating: number;
  category: string;
  gradient: string;
  discount?: string;
  delay?: number;
}

export function TourCard({
  title,
  location,
  duration,
  price,
  rating,
  category,
  gradient,
  discount,
  delay = 0,
}: TourCardProps) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="group animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 scale-100 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-transform duration-700 group-hover:scale-110" />

        {discount && (
          <span className="absolute top-3 right-3 rounded-full bg-coral px-3 py-1 text-[11px] font-bold text-coral-foreground shadow">
            {discount}
          </span>
        )}
        <button
          aria-label="افزودن به علاقه‌مندی"
          className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-coral shadow transition hover:scale-110"
        >
          <Heart className="h-4 w-4" />
        </button>

        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-secondary">
          {category}
        </span>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{location}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-bold text-foreground">{title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-accent-foreground">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {rating}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {duration}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">شروع قیمت از</span>
          <span className="text-lg font-extrabold text-primary">
            {price} <span className="text-xs font-normal text-muted-foreground">تومان</span>
          </span>
        </div>
      </div>
    </div>
  );
}