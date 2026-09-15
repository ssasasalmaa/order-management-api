import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildApp } from '../server.js';
import prisma from '../config/database.js';
import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';

describe('Authentication & Login Integration Tests', () => {
  let app: FastifyInstance;
  const testEmail = 'login-test@example.com';
  const testPassword = 'password123';

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Bersihkan data dan buat user dummy dengan password yang sudah di-hash
    await prisma.user.deleteMany({
      where: { email: { contains: 'login-test@example.com' } },
    });

    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Login Test User',
        role: 'USER',
      },
    });
  });

  it('POST /api/users/login harus sukses memberikan token/akses jika kredensial benar', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users/login', // Sesuaikan endpoint login di project lu
      payload: {
        email: testEmail,
        password: testPassword,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    
    // Pastikan response mengembalikan token atau indikator sukses login
    expect(body).toHaveProperty('success', true);
    // Kalau API lu nyimpen token di body/cookie, bisa dicek juga di sini (contoh: expect(body).toHaveProperty('token'))
  });

  it('POST /api/users/login harus gagal (400/401) jika password salah', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        email: testEmail,
        password: 'salahpassword',
      },
    });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});