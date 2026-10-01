import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signupRequest } from "@/src/lib/api/auth";
import { applyAuthTokens } from "@/src/hooks/useLogin";
import { toEnDigits } from "@/src/lib/personValidation";
import type { SignupValues } from "@/src/lib/schemas/auth.schema";
import { ROUTES } from "@/src/lib/constants";

export function useSignup() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: SignupValues) =>
      signupRequest({
        name: values.name.trim(),
        phone: toEnDigits(values.phone.trim()),
        password: values.password,
      }),
    onSuccess: (data) => {
      applyAuthTokens(data.accessToken, data.refreshToken, dispatch);
      toast.success("حساب کاربری شما ساخته شد");
      const next =
        typeof window === "undefined"
          ? null
          : new URLSearchParams(window.location.search).get("next");
      router.push(next || ROUTES.home);
    },
  });
}
