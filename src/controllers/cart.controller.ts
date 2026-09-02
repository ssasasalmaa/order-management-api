import type { FastifyRequest, FastifyReply } from 'fastify';
import { CartService } from '../services/cart.service.js';

export class CartController {
  private cartService = new CartService();

  // Ambil isi keranjang user yang sedang login
  public getCart = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (req.user as { userId: string }).userId;
      const cart = await this.cartService.getCart(userId);
      return reply.code(200).send({
        message: 'Cart fetched successfully',
        data: cart,
      });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  };

  // Tambah produk ke keranjang
  public addToCart = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (req.user as { userId: string }).userId;
      const { productId, quantity } = req.body as { productId: string; quantity: number };

      if (!productId || !quantity || quantity <= 0) {
        return reply.code(400).send({ message: 'Invalid product ID or quantity' });
      }

      const cartItem = await this.cartService.addToCart(userId, productId, quantity);
      return reply.code(201).send({
        message: 'Product added to cart successfully',
        data: cartItem,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Product not found' ? 404 : error.message === 'Insufficient product stock' ? 400 : 500;
      return reply.code(statusCode).send({ message: error.message });
    }
  };

  // Hapus item dari keranjang
  public removeItem = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (req.user as { userId: string }).userId;
      const { itemId } = req.params as { itemId: string };

      await this.cartService.removeFromCart(userId, itemId);
      return reply.code(200).send({
        message: 'Cart item removed successfully',
      });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  };
}