"use client";

import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "@/src/store/store";
import { setAccessToken } from "@/src/store/authSlice";
import { getAccessTokenCookie } from "@/src/lib/cookies";
import { hydrateCart } from "@/src/store/cartSlice";

/** بعد از رفرش صفحه، اگه کوکی توکن داشت، Redux رو دوباره باهاش پر می‌کنه */
function AuthRehydrator() {
  useEffect(() => {
    const token = getAccessTokenCookie();
    if (token) {
      store.dispatch(setAccessToken(token));
    }
  }, []);
  return null;
}

function CartRehydrator() {
  useEffect(() => {
    store.dispatch(hydrateCart());
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthRehydrator />
        <CartRehydrator />
        {children}
        <ToastContainer rtl position="top-left" />
      </QueryClientProvider>
    </ReduxProvider>
  );
}