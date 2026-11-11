import { profileSchema, type Profile } from '@/app/schemas/profile-schema';
import { api } from '@/app/services/api';

export async function getProfileService(): Promise<Profile> {
  const response = await api.get('/users/me');
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
