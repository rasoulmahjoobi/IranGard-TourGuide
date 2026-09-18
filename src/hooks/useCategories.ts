import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/src/lib/api/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // دسته‌بندی‌ها به‌ندرت عوض می‌شن، ۵ دقیقه کش کافیه
  });
}