import { useQuery } from "@tanstack/react-query";
import { getTours, type GetToursParams } from "@/src/lib/api/tours";

export function useTours(params?: GetToursParams) {
  return useQuery({
    queryKey: ["tours", params],
    queryFn: () => getTours(params),
  });
}