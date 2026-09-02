import type { FastifyInstance } from 'fastify';
import { CartController } from '../controllers/cart.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export async function cartRoutes(fastify: FastifyInstance) {
  const cartController = new CartController();

  // Semua rute cart wajib login (menggunakan verifyJWT)
  fastify.get('/', { preHandler: [verifyJWT] }, cartController.getCart);
  fastify.post('/items', { preHandler: [verifyJWT] }, cartController.addToCart);
  fastify.delete('/items/:itemId', { preHandler: [verifyJWT] }, cartController.removeItem);
}