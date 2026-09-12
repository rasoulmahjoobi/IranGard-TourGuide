interface ProductCardProps {
  title: string;
  price: number;
}

export function ProductCard({ title, price }: ProductCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
          {price.toLocaleString("fa-IR")} تومان
        </span>
      </div>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">
        تصویر
      </div>
    </div>
  );
}