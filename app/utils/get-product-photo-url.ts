export function getProductPhotoUrl(photo: string | null | undefined): string | null {
  if (!photo) {
    return null;
  }

  const apiUrl = process.env.API_URL_BACKEND;

  if (!apiUrl) {
    return null;
  }

  return `${apiUrl.replace(/\/$/, '')}/${photo.replace(/^\//, '')}`;
}
