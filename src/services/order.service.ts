import { OrderRepository } from '../repositories/order.repository.js';
import prisma from '../config/database.js'; 

const orderRepository = new OrderRepository();

export class OrderService {
  async createOrder(userId: string, items: { productId: string; quantity: number }[]) {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemPrice = Number(product.price);
      totalPrice += itemPrice * item.quantity;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice,
      });

      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity },
      });
    }

    return await orderRepository.create(userId, validatedItems, totalPrice);
  }

  async getUserOrders(userId: string) {
    return await orderRepository.findByUserId(userId);
  }
}