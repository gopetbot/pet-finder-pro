import imageCompression from "browser-image-compression";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/**
 * Comprime e faz upload de um ficheiro de imagem para o Cloudinary.
 *
 * Pré-condições:
 *   - file.type ∈ { "image/jpeg", "image/png", "image/webp" }
 *   - VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET definidos
 *
 * Pós-condições:
 *   - Retorna uma string HTTPS não-vazia (secure_url do Cloudinary)
 *   - O ficheiro enviado tem tamanho ≤ 0.5 MB e dimensão máxima ≤ 1200 px
 *
 * @throws Error se as env vars estiverem ausentes, o tipo de ficheiro for inválido,
 *               a compressão falhar, ou o upload retornar status não-2xx.
 */
export async function uploadPalestraImage(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      "Variável de ambiente VITE_CLOUDINARY_CLOUD_NAME não está definida."
    );
  }
  if (!uploadPreset) {
    throw new Error(
      "Variável de ambiente VITE_CLOUDINARY_UPLOAD_PRESET não está definida."
    );
  }

  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error(
      `Tipo de ficheiro não suportado: ${file.type}. Tipos aceites: image/jpeg, image/png, image/webp.`
    );
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  });

  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "palestras");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error(`Upload falhou: HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.secure_url as string;
}
