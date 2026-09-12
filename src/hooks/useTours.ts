import { useQuery } from "@tanstack/react-query";
import { getTours, type GetToursParams } from "@/src/lib/api/tours";

export function useTours(params?: GetToursParams) {
  return useQuery({
    // آبجکت params داخل queryKey یعنی اگه category عوض بشه، React Query
    // خودش می‌فهمه این یه query جداست و کش قبلی رو استفاده نمی‌کنه
    queryKey: ["tours", params],
    queryFn: () => getTours(params),
  });
}