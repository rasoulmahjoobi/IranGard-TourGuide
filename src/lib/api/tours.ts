import { apiClient } from "@/src/lib/apiClient";
import type { Tour } from "@/src/types/tour";

export interface GetToursParams {
  category?: number;
  categoryNe?: number;
  subcategory?: number;
  q?: string;
  departureFrom?: string;
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
  const { departureFrom, categoryNe, ...rest } = params;
  const queryParams: Record<string, unknown> = { ...rest };
  if (departureFrom) queryParams.departureDate_gte = departureFrom;
  if (categoryNe) queryParams.category_ne = categoryNe;

  const { data, headers } = await apiClient.get<Tour[]>("/products", { params: queryParams });
  const totalCount = Number(headers["x-total-count"] ?? data.length);
  return { tours: data, totalCount };
}

export async function getTourById(id: number): Promise<Tour> {
  const { data } = await apiClient.get<Tour>(`/products/${id}`);
  return data;
}

export type NewTourInput = Omit<Tour, "id" | "createdAt">;

export async function createTour(input: NewTourInput): Promise<Tour> {
  const { data } = await apiClient.post<Tour>("/products", input);
  return data;
}

export async function updateTour(id: number, patch: Partial<Tour>): Promise<Tour> {
  const { data } = await apiClient.patch<Tour>(`/products/${id}`, patch);
  return data;
}

export async function deleteTour(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}