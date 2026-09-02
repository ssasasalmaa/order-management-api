import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';

export class UserService {
  private userRepository = new UserRepository();

  async register(data: { email: string; password: string; name: string }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    // Sembunyikan password sebelum dikembalikan ke controller
    const { password, ...result } = user;
    return result;
  }
}