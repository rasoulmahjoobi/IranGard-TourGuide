import { apiClient } from "@/src/lib/apiClient";
import type { Order } from "@/src/types/order";

export interface GetOrdersParams {
  delivered?: string;
  _sort?: string;
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
}

export interface OrdersResult {
  orders: Order[];
  totalCount: number;
}

export async function getOrders(params: GetOrdersParams = {}): Promise<OrdersResult> {
  const { data, headers } = await apiClient.get<Order[]>("/orders", { params });
  const totalCount = Number(headers["x-total-count"] ?? data.length);
  return { orders: data, totalCount };
}