import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/src/lib/constants";

function getRoleFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return (JSON.parse(json) as { role?: string }).role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const role = token ? getRoleFromToken(token) : null;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin") && !isLoginPage;
  const isCustomerAuthPage = pathname === ROUTES.login || pathname === ROUTES.register;

  if (isAdminArea && role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && role === "admin") {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  if ((pathname === ROUTES.orders || pathname === ROUTES.checkout) && role !== "customer") {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isCustomerAuthPage && role === "customer") {
    return NextResponse.redirect(new URL(ROUTES.home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/orders", "/checkout", "/login", "/register"],
};
