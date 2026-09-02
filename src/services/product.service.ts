import { ProductRepository } from '../repositories/product.repository.js';

export class ProductService {
  private productRepository = new ProductRepository();

  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(data: { name: string; description?: string; price: number; stock: number }) {
    return await this.productRepository.create(data);
  }

  async updateProduct(id: string, data: { name?: string; description?: string; price?: number; stock?: number }) {
    await this.getProductById(id); // Pastikan produknya ada dulu
    return await this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id); // Pastikan produknya ada dulu
    return await this.productRepository.delete(id);
  }
}