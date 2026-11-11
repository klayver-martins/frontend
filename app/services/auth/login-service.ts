import type { LoginFormData } from '@/app/schemas/login-schema';
import { apiFetch } from '@/app/services/api-client';

interface ApiErrorResponse {
  message?: string;
}

export async function loginUser(data: LoginFormData): Promise<void> {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      result?.message ?? 'Não foi possível realizar o login. Verifique suas credenciais.',
    );
  }
}
