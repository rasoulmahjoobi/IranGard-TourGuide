"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { SITE_NAME, ROUTES } from "@/src/lib/constants";
import { Logo } from "@/src/components/icons/Logo";
import { AboutModalTrigger } from "./AboutModalTrigger";
import { ContactModalTrigger } from "./ContactModalTrigger";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
const navLinkClass =
  "relative cursor-pointer transition-colors hover:text-primary after:absolute after:-bottom-1 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-70 max-w-[85vw] flex-col bg-card shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h3 className="text-base font-bold text-foreground">منو</h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3 text-sm font-semibold text-foreground">
          <Link
            href={ROUTES.domestic}
            onClick={onClose}
            className="rounded-xl px-3 py-3 transition hover:bg-muted"
          >
            تورهای داخلی
          </Link>
          <Link
            href={ROUTES.category("4")}
            onClick={onClose}
            className="rounded-xl px-3 py-3 transition hover:bg-muted"
          >
            تورهای خارجی
          </Link>
          <Link
            href={ROUTES.orders}
            onClick={onClose}
            className="rounded-xl px-3 py-3 transition hover:bg-muted"
          >
            سفارش‌های من
          </Link>
          <div onClick={onClose}>
            <AboutModalTrigger
              label="درباره ما"
              className="block w-full rounded-xl px-3 py-3 text-right transition hover:bg-muted"
            />
          </div>
          <div onClick={onClose}>
            <ContactModalTrigger
              label="تماس با ما"
              className="block w-full rounded-xl px-3 py-3 text-right transition hover:bg-muted"
            />
          </div>
        </nav>
      </aside>
    </>,
    document.body,
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useSelector((s: RootState) => s.cart.items.length);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
        <Link href={ROUTES.home} className="flex items-center gap-2.5">
          <Logo className="h-12 w-12 drop-shadow-sm sm:h-14 sm:w-14" />
          <span className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-foreground md:flex">
          <Link href={ROUTES.domestic} className={navLinkClass}>
            تورهای داخلی
          </Link>

          <Link href={ROUTES.category("4")} className={navLinkClass}>
            تورهای خارجی
          </Link>

          <AboutModalTrigger label="درباره ما" className={navLinkClass} />
          <ContactModalTrigger label="تماس با ما" className={navLinkClass} />
          <Link href={ROUTES.orders} className={navLinkClass}>
            سفارش‌های من
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.cart}
            aria-label="سبد رزرو"
            className="relative flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary sm:px-4"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">سبد رزرو</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white ring-2 ring-background">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href={ROUTES.adminLogin}
            className="rounded-full bg-linear-to-l from-primary to-coral px-5 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:shadow-lg hover:shadow-primary/30"
          >
            مدیریت
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full border border-border p-2 text-foreground md:hidden"
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
