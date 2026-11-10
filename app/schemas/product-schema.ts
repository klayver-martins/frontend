import { z } from 'zod';

export const productSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string(),
  status: z.boolean(),
  photo: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const productFormSchema = z.object({
  code: z.string().trim().min(1, 'Informe o código do produto.'),
  description: z.string().trim().min(1, 'Informe a descrição do produto.'),
});

export type Product = z.infer<typeof productSchema>;
export type ProductFormData = z.infer<typeof productFormSchema>;
