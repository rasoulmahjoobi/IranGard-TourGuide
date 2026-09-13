import { apiClient } from "@/src/lib/apiClient";
import type { Tour } from "@/src/types/tour";

export interface GetToursParams {
  category?: number;
  subcategory?: number;
  q?: string;
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface ToursResult {
  tours: Tour[];
  totalCount: number;
}

export async function getTours(params?: GetToursParams): Promise<ToursResult> {
  const { data, headers } = await apiClient.get<Tour[]>("/products", { params });
  const totalCount = Number(headers["x-total-count"] ?? data.length);
  return { tours: data, totalCount };
}

export async function getTourById(id: number): Promise<Tour> {
  const { data } = await apiClient.get<Tour>(`/products/${id}`);
  return data;
}