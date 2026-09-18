import { apiClient } from "@/src/lib/apiClient";
import type { Category } from "@/src/types/tour";

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/category");
  return data;
}