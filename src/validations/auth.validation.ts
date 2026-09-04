import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal harus 6 karakter' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
});

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
  createdAt: z.date().or(z.string()),
});