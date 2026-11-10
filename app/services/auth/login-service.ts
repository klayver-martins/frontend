import type { LoginFormData } from '@/app/schemas/login-schema';

interface ApiErrorResponse {
  message?: string;
}

export async function loginUser(data: LoginFormData): Promise<void> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error('A URL da API não foi configurada.');
  }

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      result?.message ?? 'Não foi possível realizar o login. Verifique suas credenciais.',
    );
  }
}
