import type { RegisterFormData } from '@/app/schemas/register-schema';
import { api } from '@/app/services/api';

interface ApiErrorResponse {
  message?: string;
}

export async function registerUser(data: RegisterFormData): Promise<void> {
  const response = await api.post('/auth/register', data);

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiErrorResponse | null;

    throw new Error(result?.message ?? 'Não foi possível criar sua conta. Tente novamente.');
  }
}
