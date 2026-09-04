import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service.js';
import { userResponseSchema } from '../validations/auth.validation.js';

export class UserController {
  private userService = new UserService();

  register = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // Pastikan tipe body sesuai dengan yang diterima service (misal name wajib atau pakai tipe dari Zod inference)
      const body = req.body as { email: string; password: string; name: string };
      const user = await this.userService.register(body);
      
      // Validasi response agar data aman (password tidak bocor)
      const safeUser = userResponseSchema.parse(user);

      return reply.code(201).send({
        message: 'User registered successfully',
        data: safeUser,
      });
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Something went wrong',
      });
    }
  };

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = req.body as { email: string; password: string };
      const result = await this.userService.login(body);

      return reply.code(200).send({
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      return reply.code(401).send({
        error: error.message || 'Authentication failed',
      });
    }
  };
}