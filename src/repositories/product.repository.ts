import prisma from '../config/database.js';

export class ProductRepository {
  async findAll() {
    return await prisma.product.findMany();
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