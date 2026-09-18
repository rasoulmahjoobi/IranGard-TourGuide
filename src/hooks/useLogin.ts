import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { LoginValues } from "../lib/schemas/auth.schema";
import { apiClient } from "../lib/apiClient";
import { setCredentials } from "../store/authSlice";
import { ROUTES } from "../lib/constants";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// دیکد ساده‌ی JWT برای خوندن username/role/name از payload بدون نیاز به کتابخونه‌ی جدا
function decodeJwt(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export function useLogin() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: LoginValues) => {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", values);
      return data;
    },
    onSuccess: (data) => {
      const decoded = decodeJwt(data.accessToken);
      dispatch(
        setCredentials({
          user: { username: decoded.username, name: decoded.name, role: decoded.role },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      toast.success("با موفقیت وارد شدید");
      router.push(ROUTES.adminProducts);
    },
  });
}