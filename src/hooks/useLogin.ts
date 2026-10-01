import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginRequest } from "@/src/lib/api/auth";
import { setCredentials } from "@/src/store/authSlice";
import { setAuthCookies } from "@/src/lib/cookies";
import { decodeJwt } from "@/src/lib/jwt";
import type { LoginValues } from "@/src/lib/schemas/auth.schema";
import { ROUTES } from "@/src/lib/constants";

function nextPath() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("next");
}

function applySession(
  accessToken: string,
  refreshToken: string,
  dispatch: ReturnType<typeof useDispatch>,
) {
  const decoded = decodeJwt(accessToken);
  dispatch(
    setCredentials({
      user: {
        username: decoded.username,
        name: decoded.name,
        role: decoded.role,
        phone: decoded.phone,
      },
      accessToken,
      refreshToken,
    }),
  );
  setAuthCookies(accessToken, refreshToken);
  return decoded;
}

export function useLogin(options?: { expectedRole?: "admin" | "customer" }) {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginValues) => loginRequest(values.username, values.password),
    onSuccess: (data) => {
      const decoded = decodeJwt(data.accessToken);

      if (options?.expectedRole && decoded.role !== options.expectedRole) {
        toast.error(
          options.expectedRole === "admin"
            ? "این حساب مربوط به پنل مدیریت نیست"
            : "برای ورود به سایت از حساب کاربری مشتری استفاده کنید",
        );
        return;
      }

      applySession(data.accessToken, data.refreshToken, dispatch);
      toast.success("با موفقیت وارد شدید");
      const next = nextPath();
      if (decoded.role === "admin") {
        router.push(ROUTES.adminProducts);
        return;
      }
      router.push(next || ROUTES.home);
    },
  });
}

export function applyAuthTokens(
  accessToken: string,
  refreshToken: string,
  dispatch: ReturnType<typeof useDispatch>,
) {
  return applySession(accessToken, refreshToken, dispatch);
}
