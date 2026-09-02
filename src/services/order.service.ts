import { OrderRepository } from '../repositories/order.repository.js';
import { CartRepository } from '../repositories/cart.repository.js';

export class OrderService {
  private orderRepository = new OrderRepository();
  private cartRepository = new CartRepository();

  // Proses Checkout: Ubah keranjang belanja jadi Order
  async checkout(userId: string) {
    // 1. Ambil keranjang user beserta item dan produknya
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    let totalAmount = 0;
    const orderItemsData = [];

    // 2. Validasi stok dan hitung total harga
    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (product.stock < cartItem.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemTotal = Number(product.price) * cartItem.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    // 3. Buat order dan kurangi stok lewat repository (prisma transaction)
    const order = await this.orderRepository.createOrderFromCart(
      userId,
      orderItemsData,
      totalAmount
    );

    return order;
  }

  // Ambil riwayat order milik user
  async getUserOrders(userId: string) {
    return await this.orderRepository.findByUserId(userId);
  }

  // Ambil detail order berdasarkan ID
  async getOrderById(orderId: string, userId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Pastikan order ini milik user yang bersangkutan
    if (order.userId !== userId) {
      throw new Error('Unauthorized access to order');
    }

    return order;
  }
}