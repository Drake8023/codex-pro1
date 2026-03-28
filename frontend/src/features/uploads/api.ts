import { apiRequest } from "../../shared/api/client";
import type { UploadedImage } from "../uploads/types";
import { validateUploadFiles } from "./constants";

export function uploadImages(files: File[]) {
  validateUploadFiles(files);
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return apiRequest<{ images: UploadedImage[] }>("/api/uploads/images", { method: "POST", body: formData });
}
