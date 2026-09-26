import { apiClient } from "@/src/lib/apiClient";
import type { Order } from "@/src/types/order";

export interface GetOrdersParams {
  delivered?: string;
  phone?: string;
  paid?: string;
  _sort?: string;
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
}

export interface OrdersResult {
  orders: Order[];
  totalCount: number;
}

export async function getOrders(
  params: GetOrdersParams = {},
): Promise<OrdersResult> {
  const { data, headers } = await apiClient.get<Order[]>("/orders", { params });
  const totalCount = Number(headers["x-total-count"] ?? data.length);
  return { orders: data, totalCount };
}

export interface CreateOrderPayload {
  username: string;
  lastname: string;
  address: string;
  phone: string;
  startDate: string;
  endDate: string;
  products: { id: number; name: string; count: string; price: string }[];
  prices: number;
  delivered: string;
}

export interface CreatedOrder {
  id: number;
  [key: string]: unknown;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreatedOrder> {
  const { data } = await apiClient.post<CreatedOrder>("/orders", payload);
  return data;
}
