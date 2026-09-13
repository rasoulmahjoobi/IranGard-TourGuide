import { useQuery } from "@tanstack/react-query";
import { getSubcategories } from "@/src/lib/api/subcategories";

export function useSubcategories() {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubcategories,
    staleTime: 5 * 60 * 1000,
  });
}