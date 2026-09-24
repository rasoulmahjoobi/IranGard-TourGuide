import { apiClient } from "@/src/lib/apiClient";

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

export async function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
  const { data } = await apiClient.post<CreatedOrder>("/orders", payload);
  return data;
}