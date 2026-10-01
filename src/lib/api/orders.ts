import { apiClient } from "@/src/lib/apiClient";
import type { Order, PersonInfo } from "@/src/types/order";

export interface GetOrdersParams {
  delivered?: string;
  phone?: string;
  paid?: string;
  cancelled?: string;
  cancelledNe?: string;
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
  const { cancelledNe, ...rest } = params;
  const queryParams: Record<string, unknown> = { ...rest };
  if (cancelledNe !== undefined) queryParams.cancelled_ne = cancelledNe;

  const { data, headers } = await apiClient.get<Order[]>("/orders", { params: queryParams });
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
  leader: PersonInfo;
  products: {
    id: number;
    name: string;
    count: string;
    price: string;
    origin: "tehran" | "destination";
    originLabel: string;
    travelTypeLabel?: string;
    companions: PersonInfo[];
  }[];
  prices: number;
  delivered: string;
}

export interface CreatedOrder {
  id: number;
  [key: string]: unknown;
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
  const { data } = await apiClient.post<CreatedOrder>("/orders", payload);
  return data;
}

export async function getMyOrders(): Promise<OrdersResult> {
  const { data } = await apiClient.get<Order[]>("/orders/me");
  return { orders: data, totalCount: data.length };
}

export async function updateOrder(id: number, patch: Partial<Order>): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, patch);
  return data;
}

export async function getOrderById(id: number): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${id}`);
  return data;
}