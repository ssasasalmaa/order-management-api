import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';

export class CartService {
  private cartRepository = new CartRepository();
  private productRepository = new ProductRepository();

  // Ambil isi keranjang user (kalau belum punya, otomatis dibuatkan)
  async getCart(userId: string) {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }
    return cart;
  }

  // Tambah produk ke keranjang
  async addToCart(userId: string, productId: string, quantity: number) {
    // 1. Pastikan produknya beneran ada
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // 2. Pastikan stok produk mencukupi
    if (product.stock < quantity) {
      throw new Error('Insufficient product stock');
    }

    // 3. Ambil atau buat keranjang user
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    // 4. Masukkan atau update item di keranjang
    return await this.cartRepository.upsertCartItem(cart.id, productId, quantity);
  }

  // Hapus item tertentu dari keranjang
  async removeFromCart(userId: string, cartItemId: string) {
    // Opsional: Bisa ditambahkan validasi kepemilikan item keranjang jika diperlukan
    return await this.cartRepository.removeCartItem(cartItemId);
  }
}