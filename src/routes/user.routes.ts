import type { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller.js';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.post('/register', userController.register);
}