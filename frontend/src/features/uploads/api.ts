import { apiRequest } from "../../shared/api/client";
import type { UploadedImage } from "../uploads/types";

export function uploadImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return apiRequest<{ images: UploadedImage[] }>("/api/uploads/images", { method: "POST", body: formData });
}
