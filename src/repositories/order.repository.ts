import prisma from '../config/database.js';

export class OrderRepository {
  async create(userId: string, items: { productId: string; quantity: number; price: number }[], totalPrice: number) {
    return await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}