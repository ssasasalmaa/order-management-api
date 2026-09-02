import type { FastifyInstance } from 'fastify';
import { OrderController } from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export async function orderRoutes(fastify: FastifyInstance) {
  const orderController = new OrderController();

  fastify.addHook('preHandler', verifyJWT);

  fastify.post('/', orderController.create);
  fastify.get('/', orderController.getAllByUser);
}