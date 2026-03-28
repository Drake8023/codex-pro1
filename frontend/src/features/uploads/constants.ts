export const IMAGE_UPLOAD_ACCEPT = ".png,.jpg,.jpeg,.gif,.webp,.avif,.jfif,.heic,.heif";

const SUPPORTED_IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp", "avif", "jfif", "heic", "heif"]);

function getFileExtension(file: File) {
  const parts = file.name.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1) ?? "" : "";
}

export function validateUploadFiles(files: File[]) {
  for (const file of files) {
    const extension = getFileExtension(file);

    if (extension && !SUPPORTED_IMAGE_EXTENSIONS.has(extension)) {
      throw new Error("Only PNG, JPG, JPEG, GIF, WebP, AVIF, JFIF, HEIC, and HEIF images are supported.");
    }
  }
}
