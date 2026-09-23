"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { SITE_NAME, ROUTES } from "@/src/lib/constants";
import { Logo } from "@/src/components/icons/Logo";
import { AboutModalTrigger } from "./AboutModalTrigger";
import { ContactModalTrigger } from "./ContactModalTrigger";

const navLinkClass =
  "relative cursor-pointer transition-colors hover:text-primary after:absolute after:-bottom-1 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.cart}
            className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary sm:flex"
          >
            <ShoppingCart className="h-4 w-4" />
            سبد رزرو
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

      {/* پس‌زمینه‌ی تیره پشت منوی موبایل */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* پنل کشویی — کاملاً مستقل از SiteSidebar اصلی سایت */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-70 max-w-[85vw] flex-col bg-card shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h3 className="text-base font-bold text-foreground">منو</h3>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="بستن"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3 text-sm font-semibold text-foreground">
          <Link
            href={ROUTES.domestic}
            onClick={() => setMobileOpen(false)}
            className="rounded-xl px-3 py-3 transition hover:bg-muted"
          >
            تورهای داخلی
          </Link>
          <Link
            href={ROUTES.category("4")}
            onClick={() => setMobileOpen(false)}
            className="rounded-xl px-3 py-3 transition hover:bg-muted"
          >
            تورهای خارجی
          </Link>
          <div onClick={() => setMobileOpen(false)}>
            <AboutModalTrigger label="درباره ما" className="block w-full rounded-xl px-3 py-3 text-right transition hover:bg-muted" />
          </div>
          <div onClick={() => setMobileOpen(false)}>
            <ContactModalTrigger label="تماس با ما" className="block w-full rounded-xl px-3 py-3 text-right transition hover:bg-muted" />
          </div>
        </nav>
      </aside>
    </header>
  );
}