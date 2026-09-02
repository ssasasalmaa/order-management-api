import prisma from '../config/database.js';

export class CartRepository {
  // Cari keranjang berdasarkan userId, sekaligus include item dan produknya
  async findByUserId(userId: string) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Buat keranjang baru jika user belum punya
async create(userId: string) {
    const cart = await prisma.cart.create({
      data: { userId },
    });
    
    return {
      ...cart,
      items: [],
    };
  }
  // Tambah item ke keranjang (atau update quantity kalau produknya sudah ada di keranjang)
  async upsertCartItem(cartId: string, productId: string, quantity: number) {
    // Cek apakah item tersebut sudah ada di keranjang
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (existingItem) {
      // Kalau sudah ada, update quantity-nya (ditambah)
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Kalau belum ada, buat item baru di keranjang
      return await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
        },
      });
    }
  }

  // Hapus item spesifik dari keranjang
  async removeCartItem(cartItemId: string) {
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  // Kosongkan seluruh keranjang (biasanya dipakai setelah checkout jadi order)
  async clearCart(cartId: string) {
    return await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}