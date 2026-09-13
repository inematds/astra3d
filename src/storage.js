export function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export async function readImage(file) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    throw new Error("Use uma imagem PNG, JPG ou WebP.");
  if (file.size > 8 * 1024 * 1024)
    throw new Error("A imagem precisa ter até 8 MB. Escolha um arquivo menor.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.85);
}
