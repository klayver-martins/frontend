export function getProductPhotoUrl(photo?: string | null): string | null {
  if (!photo) return null;

  // Se já for uma URL absoluta, retorna sem modificar.
  if (/^https?:\/\//i.test(photo)) {
    return photo;
  }

  // Compatibilidade com imagens antigas armazenadas no backend.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;

  return `${apiUrl.replace(/\/+$/, '')}/${photo.replace(/^\/+/, '')}`;
}
