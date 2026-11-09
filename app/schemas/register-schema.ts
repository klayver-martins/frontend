import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório.'),

  email: z.string().min(1, 'O e-mail é obrigatório.').email('Informe um e-mail válido.'),

  password: z
    .string()
    .min(1, 'A senha é obrigatória.')
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
