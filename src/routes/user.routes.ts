import type { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { sendSuccess } from '../utils/response.util.js';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.post('/register', { preHandler: [validateRequest(registerSchema)] }, userController.register);
  fastify.post('/login', { preHandler: [validateRequest(loginSchema)] }, userController.login);

  fastify.get(
    '/profile',
    { preHandler: [verifyJWT] },
    async (req, reply) => {
      return sendSuccess(reply, 200, 'Profile fetched successfully', req.user);
    }
  );
}