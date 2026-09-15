import { describe, it, expect, beforeEach } from 'vitest';
import { UserRepository } from './user.repository.js';
import prisma from '../config/database.js'; 
import 'dotenv/config';

describe('UserRepository Integration Test', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = new UserRepository();
    // Bersihkan data user test di database sebelum setiap test berjalan
    await prisma.user.deleteMany({
      where: { email: { contains: 'test-repo@example.com' } },
    });
  });

  it('harus bisa membuat user baru dan menemukannya via findByEmail', async () => {
    const testEmail = 'user-test-repo@example.com';
    const testData = {
      email: testEmail,
      password: 'hashedpassword123',
      name: 'Repo Test User',
      role: 'USER' as const,
    };

    // 1. Tes fungsi create
    const createdUser = await userRepository.create(testData);
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.email).toBe(testEmail);

    // 2. Tes fungsi findByEmail
    const foundUser = await userRepository.findByEmail(testEmail);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBe(createdUser.id);
  });
});