import type { FastifyReply } from 'fastify';

export const sendSuccess = (
  reply: FastifyReply,
  statusCode: number,
  message: string,
  data: any = null
) => {
  return reply.code(statusCode).send({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  reply: FastifyReply,
  statusCode: number,
  message: string,
  errors: any = null
) => {
  return reply.code(statusCode).send({
    success: false,
    message,
    errors,
  });
};