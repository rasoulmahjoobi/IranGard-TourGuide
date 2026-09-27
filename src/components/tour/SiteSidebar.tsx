"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  Mountain,
  Landmark,
  Waves,
  Plane,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/src/lib/constants";
import { cn } from "@/src/lib/utils";
import type { Category, Subcategory } from "@/src/types/tour";

const iconMap: Record<number, { icon: LucideIcon; color: string; bg: string }> = {
  1: { icon: Mountain, color: "text-turquoise", bg: "bg-turquoise/10" },
  2: { icon: Landmark, color: "text-accent", bg: "bg-accent/15" },
  3: { icon: Waves, color: "text-primary", bg: "bg-primary/10" },
  4: { icon: Plane, color: "text-coral", bg: "bg-coral/10" },
};
const fallbackIcon = { icon: Compass, color: "text-secondary", bg: "bg-secondary/10" };

interface SiteSidebarProps {
  categories: Category[];
  subcategories: Subcategory[];
}

export function SiteSidebar({ categories, subcategories }: SiteSidebarProps) {
  const [open, setOpen] = useState(false);
  const [rootOpen, setRootOpen] = useState(false);
  const [openCats, setOpenCats] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const toggleCat = (id: number) =>
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary"
      >
        <Menu className="h-4 w-4" />
        دسته‌بندی تورها
      </button>

      <div
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[320px] max-w-[85vw] flex-col bg-card shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h3 className="text-base font-bold text-foreground">دسته‌بندی تورها</h3>
          <button onClick={close} aria-label="بستن" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <button
            onClick={() => setRootOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Menu className="h-4 w-4 text-primary" />
            </span>
            <span className="flex-1 text-right">کل تورها</span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", rootOpen && "rotate-180")} />
          </button>

          {rootOpen && (
            <div className="animate-fade-in mr-3 flex flex-col gap-0.5 border-r-2 border-border pr-3 pt-1">
              {categories.map((cat) => {
                const { icon: Icon, color, bg } = iconMap[cat.id] ?? fallbackIcon;
                const subs = subcategories.filter((s) => s.category === cat.id);
                const catOpen = openCats.has(cat.id);

                return (
                  <div key={cat.id} className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Link
                        href={ROUTES.category(String(cat.id))}
                        onClick={close}
                        className="flex flex-1 items-center gap-2.5 rounded-xl px-2 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                      >
                        <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", bg)}>
                          <Icon className={cn("h-3.5 w-3.5", color)} />
                        </span>
                        <span className="flex-1 text-right">{cat.name}</span>
                      </Link>
                      {subs.length > 0 && (
                        <button
                          onClick={() => toggleCat(cat.id)}
                          aria-label="نمایش زیردسته‌ها"
                          className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted"
                        >
                          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", catOpen && "rotate-180")} />
                        </button>
                      )}
                    </div>

                    {catOpen && (
                      <div className="animate-fade-in mr-3 flex flex-col gap-0.5 border-r-2 border-border pr-3 pt-1">
                        {subs.map((sub) => (
                          <Link
                            key={sub.id}
                            href={ROUTES.subcategory(String(sub.id))}
                            onClick={close}
                            className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-[13px] font-medium text-foreground transition hover:bg-muted hover:text-primary"
                          >
                            <span>{sub.name}</span>
                            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}