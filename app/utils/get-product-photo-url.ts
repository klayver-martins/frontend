export function getProductPhotoUrl(photo: string | null | undefined): string | null {
  if (!photo) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return null;
  }

  return `${apiUrl.replace(/\/$/, '')}/${photo.replace(/^\//, '')}`;
}
