import { z } from 'zod';

export const cadastroSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Senha é obrigatória'),
  username: z.string().min(1, 'Username é obrigatório'),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const googleSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
});

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres.')
  .max(50, 'A senha deve ter no máximo 50 caracteres.')
  .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
  .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula.')
  .regex(/[0-9]/, 'A senha deve conter ao menos um número.')
  .regex(/[!@#$%^&*]/, 'A senha deve conter ao menos um símbolo (!@#$%^&*).');

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'O nome de usuário deve ter entre 3 e 25 caracteres.')
    .max(25, 'O nome de usuário deve ter entre 3 e 25 caracteres.')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('E-mail inválido.')
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(2500, 'A biografia deve ter no máximo 2500 caracteres.')
    .optional()
    .nullable(),
  title: z
    .number()
    .int()
    .positive('Título inválido.')
    .optional()
    .nullable(),
  password: passwordSchema.optional().nullable(),
  removeProfileImage: z.boolean().optional(),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleInput = z.infer<typeof googleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
