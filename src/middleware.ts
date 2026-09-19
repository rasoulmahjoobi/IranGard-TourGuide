import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin") && !isLoginPage;

  // توکن نداره ولی می‌خواد بره تو صفحات پنل مدیریت → بفرستش لاگین
  if (isAdminArea && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // توکن داره ولی می‌خواد بره صفحه‌ی لاگین → بفرستش صفحه‌ی اول پنل
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};