import prisma from '../config/database.js';

export class OrderRepository {
  async createOrderFromCart(
    userId: string, 
    items: Array<{ productId: string; quantity: number; price: any }>, 
    totalAmount: number
  ) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice: totalAmount,
          status: 'PENDING' as any, 
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return order;
    });
  }

  // Ambil daftar riwayat order milik user tertentu
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

  // Cari order berdasarkan ID (untuk cek detail atau update status)
  async findById(orderId: string) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Update status order (misal dari PENDING -> PAID -> PROCESSING -> COMPLETED)
  async updateStatus(orderId: string, status: string) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  }}