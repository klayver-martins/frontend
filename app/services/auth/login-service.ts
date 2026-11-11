import type { LoginFormData } from '@/app/schemas/login-schema';
import { api } from '@/app/services/api';

interface ApiErrorResponse {
  message?: string;
}

export async function loginUser(data: LoginFormData): Promise<void> {
  const response = await api.post('/auth/login', data);

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      result?.message ?? 'Não foi possível realizar o login. Verifique suas credenciais.',
    );
  }
}
