import { describe, it, expect } from 'vitest';
import { registerSchema } from './auth.validation.js';

describe('Auth Validation Unit Test', () => {
  it('harus sukses jika email valid dan password minimal 6 karakter', () => {
    const validData = {
      email: 'salsabila@example.com',
      password: 'securepassword123',
      name: 'Test User',
    };

    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('harus gagal jika format email salah', () => {
    const invalidData = {
      email: 'bukan-email-beneran',
      password: '123',
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});