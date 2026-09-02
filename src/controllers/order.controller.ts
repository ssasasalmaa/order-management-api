import type { FastifyRequest, FastifyReply } from 'fastify';
import { OrderService } from '../services/order.service.js';

const orderService = new OrderService();

export class OrderController {
  create = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const body = req.body as { items: { productId: string; quantity: number }[] };
      const order = await orderService.createOrder(userId, body.items);

      return reply.code(201).send({
        message: 'Order created successfully',
        data: order,
      });
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Failed to create order',
      });
    }
  };

  getAllByUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const orders = await orderService.getUserOrders(userId);

      return reply.code(200).send({
        message: 'Orders fetched successfully',
        data: orders,
      });
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Failed to fetch orders',
      });
    }
  };
}