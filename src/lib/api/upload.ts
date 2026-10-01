import { apiClient } from "@/src/lib/apiClient";

type UploadResponse = {
  filename?: string;
  path?: string;
};

/** فقط هش فایل را نگه می‌دارد؛ data URL / مسیر /files/ ذخیره نمی‌شود */
export function toStoredImageId(value: string): string {
  if (!value || value.startsWith("data:")) return "";
  const filesPart = value.split("/files/").pop() ?? value;
  return filesPart.split(/[/\\]/).pop()?.trim() ?? "";
}

/** از پاسخ آپلود فقط هش فایل را برمی‌دارد؛ مثل Postman: 958ccf53d62e52c51a5b8b0da4385bd5 */
function toFileHash(data: UploadResponse | string | undefined): string {
  const raw = typeof data === "string" ? data : data?.filename || data?.path || "";
  const hash = toStoredImageId(raw);
  if (!hash) {
    throw new Error("invalid upload filename");
  }
  return hash;
}

/** فایل را به بک‌اند آپلود می‌کند و فقط filename کوتاه (hash) را برمی‌گرداند */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<UploadResponse>("/upload", formData);
  return toFileHash(data);
}
