export const MAX_MB = 10;
export const ALLOWED_TYPES = ["image/png", "image/jpeg"];
const EXT = /\.(png|jpe?g)$/i;

/** Returns an error message, or null if the file is valid. */
export function validateScreenshot(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type) || !EXT.test(file.name))
    return `"${file.name}" is not supported. Please upload a PNG, JPG or JPEG image.`;
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_MB * 1024 * 1024)
    return `File is ${(file.size / 1048576).toFixed(1)} MB. The maximum size is ${MAX_MB} MB.`;
  return null;
}

export function formatSize(bytes: number): string {
  return bytes < 1048576 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
}
