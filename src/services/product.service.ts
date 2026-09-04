import { ProductRepository } from '../repositories/product.repository.js';
import { redis } from '../config/redis.js';

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
    // Buat unique cache key berdasarkan parameter query
    const cacheKey = `products:all:${JSON.stringify(query)}`;

    // 1. Cek Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('⚡ Cache HIT: Mengambil data produk dari Redis');
      return JSON.parse(cachedData);
    }

    // 2. Kalau MISS, ambil dari Database PostgreSQL lewat Repository
    console.log('🐢 Cache MISS: Mengambil data produk dari PostgreSQL');
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const search = query.search;
    const category = query.category;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';

    const products = await this.productRepository.findAll({
      page,
      limit,
      search,
      category,
      sortBy,
      order,
    });

    // 3. Simpan ke Redis dengan TTL 60 detik
    await redis.setex(cacheKey, 60, JSON.stringify(products));

    return products;
  }

  async getProductById(id: string) {
    const cacheKey = `product:${id}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`⚡ Cache HIT: Product ${id}`);
      return JSON.parse(cachedData);
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await redis.setex(cacheKey, 60, JSON.stringify(product));
    return product;
  }

  async createProduct(data: { name: string; description?: string; price: number; stock: number }) {
    const newProduct = await this.productRepository.create(data);
    // Cache Invalidation: Hapus cache list produk lama agar data baru ikut ke-load
    await this.clearProductCaches();
    return newProduct;
  }

  async updateProduct(id: string, data: { name?: string; description?: string; price?: number; stock?: number }) {
    await this.getProductById(id);
    const updatedProduct = await this.productRepository.update(id, data);
    
    // Cache Invalidation: Hapus cache spesifik produk ini & list produk
    await redis.del(`product:${id}`);
    await this.clearProductCaches();
    
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    const deletedProduct = await this.productRepository.delete(id);
    
    // Cache Invalidation
    await redis.del(`product:${id}`);
    await this.clearProductCaches();
    
    return deletedProduct;
  }

  // Helper private untuk membersihkan semua cache list produk yang bertebaran
  private async clearProductCaches() {
    const keys = await redis.keys('products:all:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}