import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildApp } from '../server.js';
import prisma from '../config/database.js';
import type { FastifyInstance } from 'fastify';

describe('Auth API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'integration-test@example.com' } },
    });
  });

  it('POST /api/users/register harus sukses mendaftarkan user baru', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: {
        email: 'integration-test@example.com',
        password: 'password123',
        name: 'Hoshi',
      },
    });

    // Cetak payload error ke terminal buat debug kalau statusnya 400+
    if (response.statusCode >= 400) {
      console.log('ERROR RESPONSE:', response.payload);
    }

    expect(response.statusCode).toBeLessThan(300);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty('success', true);
  });
});