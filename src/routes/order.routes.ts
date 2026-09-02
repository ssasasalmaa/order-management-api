import type { FastifyInstance } from 'fastify';
import { OrderController } from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export async function orderRoutes(fastify: FastifyInstance) {
  const orderController = new OrderController();

  // Semua rute order wajib login
  fastify.post('/checkout', { preHandler: [verifyJWT] }, orderController.checkout);
  fastify.get('/', { preHandler: [verifyJWT] }, orderController.getUserOrders);
  fastify.get('/:id', { preHandler: [verifyJWT] }, orderController.getOrderById);
}