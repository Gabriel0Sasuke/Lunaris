import { z } from 'zod';

export const listMangasSchema = z.object({
  tag: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive('Tag inválida.'))
    .optional(),
  limit: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive('Limite inválido.'))
    .optional(),
  max: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive('Limite inválido.'))
    .optional(),
  MAX: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive('Limite inválido.'))
    .optional(),
  type: z.string().optional(),
  orderBy: z.string().optional(),
  orderby: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

export const mangaByIdSchema = z.object({
  id: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive('ID inválido. Deve ser um número inteiro maior que 0.')),
});

export const mangaIdBodySchema = z.object({
  mangaId: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .pipe(z.number().int().positive('ID do mangá inválido. Deve ser um número inteiro maior que 0.')),
});

export const createMangaSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  synopsis: z.string().min(1, 'Sinopse é obrigatória'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  demographic: z.string().min(1, 'Demografia é obrigatória'),
  releaseDate: z.string().min(1, 'Data de lançamento é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
  author: z.string().min(1, 'Autor é obrigatório'),
  artist: z.string().min(1, 'Artista é obrigatório'),
});

export type ListMangasQuery = z.infer<typeof listMangasSchema>;
export type CreateMangaInput = z.infer<typeof createMangaSchema>;
