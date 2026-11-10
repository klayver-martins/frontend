import { profileSchema, type Profile } from '@/app/schemas/profile-schema';

export async function getProfileService(): Promise<Profile> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('URL da API não configurada.');
  }

  const response = await fetch(`${apiUrl}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Não foi possível carregar os dados do usuário.';

    throw new Error(message);
  }

  const result = profileSchema.safeParse(data);

  if (!result.success) {
    throw new Error('A API retornou dados de perfil inválidos.');
  }

  return result.data;
}
