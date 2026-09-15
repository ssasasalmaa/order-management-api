import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user.service.js';
import { UserRepository } from '../repositories/user.repository.js';

// Mock UserRepository sebagai class agar bisa di-instansiasi dengan 'new'
vi.mock('../repositories/user.repository.js', () => {
  return {
    UserRepository: class {
      findByEmail = vi.fn();
      create = vi.fn();
    },
  };
});

describe('UserService Unit/Service Test', () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService();
  });

  it('harus melempar error jika email sudah terdaftar saat register', async () => {
    // Mock fungsi findByEmail agar mengembalikan user seolah-olah email sudah ada
    const mockRepo = (userService as any).userRepository;
    mockRepo.findByEmail.mockResolvedValueOnce({
      id: '1',
      email: 'existing@example.com',
      password: 'hashedpassword',
    });

    // Panggil fungsi register dan pastikan menghasilkan error
    await expect(
      userService.register({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      })
    ).rejects.toThrow('Email is already registered');
  });
});