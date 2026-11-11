import type { RegisterFormData } from '@/app/schemas/register-schema';
import { apiFetch } from '@/app/services/api-client';

interface ApiErrorResponse {
  message?: string;
}

export async function registerUser(data: RegisterFormData): Promise<void> {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiErrorResponse | null;

    throw new Error(result?.message ?? 'Não foi possível criar sua conta. Tente novamente.');
  }
}
