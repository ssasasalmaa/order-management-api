import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service.js';

export class UserController {
  private userService = new UserService();

  register = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = req.body as { email: string; password: string; name: string };
      const user = await this.userService.register(body);
      
      return reply.code(201).send({
        message: 'User registered successfully',
        data: user,
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