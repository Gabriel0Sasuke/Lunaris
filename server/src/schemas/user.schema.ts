import { z } from 'zod';

const mangaIdField = z
  .union([z.string(), z.number()])
  .transform((v) => Number(v))
  .pipe(z.number().int().positive('Manga ID deve ser um número inteiro positivo'));

export const bookmarkBodySchema = z.object({
  mangaid: mangaIdField,
});

export const checkBookmarkQuerySchema = z.object({
  mangaid: mangaIdField,
});

export const ratingBodySchema = z.object({
  mangaId: mangaIdField,
  rating: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .pipe(z.number().min(1, 'Nota deve estar entre 1 e 5').max(5, 'Nota deve estar entre 1 e 5')),
});

export const checkRatingQuerySchema = z.object({
  mangaId: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive('ID do Mangá é necessário e deve ser um número válido')),
});

export type BookmarkBody = z.infer<typeof bookmarkBodySchema>;
export type RatingBody = z.infer<typeof ratingBodySchema>;
