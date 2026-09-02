import type { FastifyRequest, FastifyReply } from 'fastify';
import { OrderService } from '../services/order.service.js';

export class OrderController {
  private orderService = new OrderService();

  // Proses Checkout keranjang menjadi Order
  public checkout = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (req.user as { userId: string }).userId;
      const order = await this.orderService.checkout(userId);

      return reply.code(201).send({
        message: 'Checkout successful, order created',
        data: order,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Cart is empty' ? 400 : error.message.includes('Insufficient stock') ? 400 : 500;
      return reply.code(statusCode).send({ message: error.message });
    }
  };

  // Ambil daftar riwayat order user yang sedang login
  public getUserOrders = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (req.user as { userId: string }).userId;
      const orders = await this.orderService.getUserOrders(userId);

      return reply.code(200).send({
        message: 'User orders fetched successfully',
        data: orders,
      });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  };

  // Ambil detail order berdasarkan ID
  public getOrderById = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (req.user as { userId: string }).userId;
      const { id } = req.params as { id: string };

      const order = await this.orderService.getOrderById(id, userId);

      return reply.code(200).send({
        message: 'Order details fetched successfully',
        data: order,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Order not found' ? 404 : error.message === 'Unauthorized access to order' ? 403 : 500;
      return reply.code(statusCode).send({ message: error.message });
    }
  };
}