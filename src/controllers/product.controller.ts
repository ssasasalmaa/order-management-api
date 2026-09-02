import type { FastifyRequest, FastifyReply } from 'fastify';
import { ProductService } from '../services/product.service.js';

export class ProductController {
  private productService = new ProductService();

  public getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = req.query as {
        page?: string;
        limit?: string;
        search?: string;
        category?: string;
        sortBy?: string;
        order?: 'asc' | 'desc';
      };

      const result = await this.productService.getAllProducts(query);
      return reply.code(200).send({
        message: 'Products fetched successfully',
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  };

  public getById = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };
      const product = await this.productService.getProductById(id);
      return reply.code(200).send({
        message: 'Product fetched successfully',
        data: product,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      return reply.code(statusCode).send({ message: error.message });
    }
  };

  public create = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = req.body as { name: string; description?: string; price: number; stock: number };
      const product = await this.productService.createProduct(body);
      return reply.code(201).send({
        message: 'Product created successfully',
        data: product,
      });
    } catch (error: any) {
      return reply.code(400).send({ message: error.message });
    }
  };

  public update = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };
      const body = req.body as { name?: string; description?: string; price?: number; stock?: number };
      const product = await this.productService.updateProduct(id, body);
      return reply.code(200).send({
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Product not found' ? 404 : 400;
      return reply.code(statusCode).send({ message: error.message });
    }
  };

  public delete = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };
      await this.productService.deleteProduct(id);
      return reply.code(200).send({
        message: 'Product deleted successfully',
      });
    } catch (error: any) {
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      return reply.code(statusCode).send({ message: error.message });
    }
  };
}