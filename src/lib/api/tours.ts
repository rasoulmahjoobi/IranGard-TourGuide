import { apiClient } from "@/src/lib/apiClient";
import type { Tour } from "@/src/types/tour";

// این پارامترها دقیقاً همون query paramsی هستن که json-server پشتیبانی می‌کنه
// (category, subcategory, q برای سرچ، _page/_limit برای pagination، _sort/_order)
export interface GetToursParams {
  category?: number;
  subcategory?: number;
  q?: string;
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
}

export async function getTours(params?: GetToursParams): Promise<Tour[]> {
  const { data } = await apiClient.get<Tour[]>("/products", { params });
  return data;
}

export async function getTourById(id: number): Promise<Tour> {
  const { data } = await apiClient.get<Tour>(`/products/${id}`);
  return data;
}