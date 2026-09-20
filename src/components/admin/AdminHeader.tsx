"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { Package, DollarSign, ClipboardList, ArrowLeft, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { ROUTES } from "@/src/lib/constants";
import { cn } from "@/src/lib/utils";
import { logout } from "@/src/store/authSlice";
import { clearAuthCookies } from "@/src/lib/cookies";

const tabs = [
  { href: ROUTES.adminProducts, label: "کالاها", icon: Package },
  { href: ROUTES.adminInventory, label: "موجودی و قیمت‌ها", icon: DollarSign },
  { href: ROUTES.adminOrders, label: "سفارش‌ها", icon: ClipboardList },
];

export function AdminHeader() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    clearAuthCookies();
    toast.success("با موفقیت خارج شدید");
    // به‌جای router.push، یه ری‌دایرکت کامل انجام می‌دیم تا middleware
    // با کوکیِ واقعاً پاک‌شده دوباره ارزیابی کنه و صفحه بدون نیاز به رفرش دستی عوض بشه
    window.location.href = ROUTES.adminLogin;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <h1 className="text-lg font-extrabold text-primary">پنل مدیریت</h1>

        <nav className="flex flex-wrap gap-1.5 rounded-full bg-muted p-1.5">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-gradient-to-l from-primary to-coral text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            بازگشت به سایت
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}