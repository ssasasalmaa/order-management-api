import { ProductRepository } from '../repositories/product.repository.js';

export class ProductService {
  private productRepository = new ProductRepository();

  async getAllProducts(query: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const search = query.search;
    const category = query.category;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';

    return await this.productRepository.findAll({
      page,
      limit,
      search,
      category,
      sortBy,
      order,
    });
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
    await this.getProductById(id);
    return await this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    return await this.productRepository.delete(id);
  }
}