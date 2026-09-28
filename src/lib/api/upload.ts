import { apiClient } from "@/src/lib/apiClient";

/** فایل رو به بک‌اند آپلود می‌کنه و فقط filename کوتاهش (مثل hash) رو برمی‌گردونه */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<{ filename: string }>("/upload", formData);
  return data.filename;
}