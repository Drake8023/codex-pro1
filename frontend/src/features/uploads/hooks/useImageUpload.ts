import { useMutation } from "@tanstack/react-query";
import { uploadImages } from "../api";

export function useImageUpload() {
  return useMutation({ mutationFn: uploadImages });
}
