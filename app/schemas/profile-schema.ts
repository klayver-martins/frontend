import { z } from 'zod';

export const profileSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Profile = z.infer<typeof profileSchema>;
