import { apiClient } from "@/src/lib/apiClient";
import type { Subcategory } from "@/src/types/tour";

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data } = await apiClient.get<Subcategory[]>("/subcategory");
  return data;
}