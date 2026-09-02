import type { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export async function productRoutes(fastify: FastifyInstance) {
  const productController = new ProductController();

  // Public routes (siapa aja bisa lihat produk)
  fastify.get('/', productController.getAll);
  fastify.get('/:id', productController.getById);

  // Protected routes (harus login dulu buat nambah, update, atau hapus produk)
  fastify.post('/', { preHandler: [verifyJWT] }, productController.create);
  fastify.put('/:id', { preHandler: [verifyJWT] }, productController.update);
  fastify.delete('/:id', { preHandler: [verifyJWT] }, productController.delete);
}