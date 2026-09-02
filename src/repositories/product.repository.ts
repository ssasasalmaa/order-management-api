import prisma from '../config/database.js';

export class ProductRepository {
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string | undefined;
    category?: string | undefined;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 10, search, category, sortBy = 'createdAt', order = 'desc' } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: { name: string; description?: string; price: number; stock: number }) {
    return await prisma.product.create({
      data,
    });
  }

  async update(id: string, data: { name?: string; description?: string; price?: number; stock?: number }) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}