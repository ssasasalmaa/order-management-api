import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { userResponseSchema } from '../validations/auth.validation.js';

export class UserService {
  private userRepository = new UserRepository();
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_fallback';

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

    const { password, ...result } = user;
    
    // Validasi response menggunakan Zod
    return userResponseSchema.parse(result);
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password, ...result } = user;
    
    // Validasi response user menggunakan Zod
    const safeUser = userResponseSchema.parse(result);

    return { user: safeUser, token };
  }
}