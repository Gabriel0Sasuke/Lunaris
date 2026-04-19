import { z } from 'zod';

export const addTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(15, 'Nome deve ter no máximo 15 caracteres')
    .transform((v) => v.trim()),
  slug: z
    .string()
    .max(15, 'Slug deve ter no máximo 15 caracteres')
    .transform((v) => v.trim())
    .optional(),
  icon: z
    .string()
    .min(1, 'Ícone é obrigatório')
    .refine((v) => v.includes('<svg') && v.includes('</svg>'), {
      message: 'O ícone deve ser um SVG válido',
    }),
});

export type AddTagInput = z.infer<typeof addTagSchema>;
