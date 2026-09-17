import { apiClient } from "@/src/lib/apiClient";
import type { Order } from "@/src/types/order";

export interface GetOrdersParams {
  delivered?: string;
  _sort?: string;
  _order?: "asc" | "desc";
}

export async function getOrders(params: GetOrdersParams = {}): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>("/orders", { params });
  return data;
}