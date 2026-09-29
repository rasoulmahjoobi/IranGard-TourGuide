import { useQuery } from "@tanstack/react-query";
import { getMyOrders, getOrders, type GetOrdersParams } from "@/src/lib/api/orders";

export function useOrders(params?: GetOrdersParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    enabled: options?.enabled ?? true,
  });
}

export function useMyOrders(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["orders", "me"],
    queryFn: getMyOrders,
    enabled: options?.enabled ?? true,
  });
}