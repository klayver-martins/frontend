import type { RegisterFormData } from '@/app/schemas/register-schema';

interface ApiErrorResponse {
  message?: string;
}

export async function registerUser(data: RegisterFormData): Promise<void> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error('A URL da API não foi configurada.');
  }

  const response = await fetch(`${apiUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiErrorResponse | null;

    throw new Error(result?.message ?? 'Não foi possível criar sua conta. Tente novamente.');
  }
}
