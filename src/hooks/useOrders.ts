import { useQuery } from "@tanstack/react-query";
import { getOrders, type GetOrdersParams } from "@/src/lib/api/orders";

export function useOrders(params?: GetOrdersParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    enabled: options?.enabled ?? true,
  });
}