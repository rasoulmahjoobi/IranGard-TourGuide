import { Mountain, Landmark, Waves, Plane, Compass } from "lucide-react";

const categories = [
  { label: "طبیعت‌گردی", icon: Mountain, color: "text-turquoise" },
  { label: "تاریخی و فرهنگی", icon: Landmark, color: "text-accent" },
  { label: "ساحلی", icon: Waves, color: "text-primary" },
  { label: "تورهای خارجی", icon: Plane, color: "text-coral" },
  { label: "ماجراجویی", icon: Compass, color: "text-secondary" },
];

export function CategoryChips() {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      {categories.map((cat, i) => (
        <div
          key={cat.label}
          style={{ animationDelay: `${i * 80}ms` }}
          className="animate-fade-up flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
        >
          <cat.icon className={`h-4 w-4 ${cat.color}`} />
          <span className="text-sm font-semibold text-foreground">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}