import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class UserController {
  private userService = new UserService();

  register = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = req.body as { email: string; password: string; name: string };
      const user = await this.userService.register(body);

      return sendSuccess(reply, 201, 'User registered successfully', user);
    } catch (error: any) {
      return sendError(reply, 400, error.message || 'Registration failed');
    }
  };

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = req.body as { email: string; password: string };
      const result = await this.userService.login(body);

      return sendSuccess(reply, 200, 'Login successful', result);
    } catch (error: any) {
      return sendError(reply, 401, error.message || 'Authentication failed');
    }
  };
}