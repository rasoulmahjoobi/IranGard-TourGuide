import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "@/src/lib/api/orders";
import type { Order } from "@/src/types/order";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<Order> }) => updateOrder(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}