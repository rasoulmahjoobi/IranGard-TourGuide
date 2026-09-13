import { apiClient } from "@/src/lib/apiClient";
import type { Tour } from "@/src/types/tour";

export interface GetToursParams {
  category?: number;
  subcategory?: number;
  q?: string;
  departureFrom?: string; // ISO date — فقط تورهایی که از این تاریخ به بعد برگزار می‌شن
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface ToursResult {
  tours: Tour[];
  totalCount: number;
}

export async function getTours(params: GetToursParams = {}): Promise<ToursResult> {
  const { departureFrom, ...rest } = params;
  const queryParams: Record<string, unknown> = { ...rest };
  if (departureFrom) {
    queryParams.departureDate_gte = departureFrom;
  }

  const { data, headers } = await apiClient.get<Tour[]>("/products", { params: queryParams });
  const totalCount = Number(headers["x-total-count"] ?? data.length);
  return { tours: data, totalCount };
}

export async function getTourById(id: number): Promise<Tour> {
  const { data } = await apiClient.get<Tour>(`/products/${id}`);
  return data;
}