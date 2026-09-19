import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiClient } from "@/src/lib/apiClient";
import { setCredentials } from "@/src/store/authSlice";
import { setAuthCookies } from "@/src/lib/cookies";
import type { LoginValues } from "@/src/lib/schemas/auth.schema";
import { ROUTES } from "@/src/lib/constants";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

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
      // ذخیره‌ی توکن تو کوکی — همینی که middleware براش چک می‌کنه
      setAuthCookies(data.accessToken, data.refreshToken);
      toast.success("با موفقیت وارد شدید");
      router.push(ROUTES.adminProducts);
    },
  });
}