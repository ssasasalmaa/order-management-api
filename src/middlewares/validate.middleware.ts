import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      req.body = await schema.parseAsync(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      return reply.code(500).send({ success: false, message: 'Internal Server Error' });
    }
  };
};