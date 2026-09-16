import type { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { sendSuccess } from '../utils/response.util.js';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.post(
    '/register', 
    {
      schema: {
        tags: ['Authentication'],
        description: 'Register a new user account',
        body: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string' },
          },
        },
      },
      preHandler: [validateRequest(registerSchema)],
    }, 
    userController.register
  );

  fastify.post(
    '/login', 
    {
      schema: {
        tags: ['Authentication'],
        description: 'Login to user account and get JWT token',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
      preHandler: [validateRequest(loginSchema)],
    }, 
    userController.login
  );

  fastify.get(
    '/profile',
    {
      schema: {
        tags: ['User'],
        description: 'Get current logged in user profile',
        security: [{ bearerAuth: [] }], 
      },
      preHandler: [verifyJWT],
    },
    async (req, reply) => {
      return sendSuccess(reply, 200, 'Profile fetched successfully', req.user);
    }
  );
}