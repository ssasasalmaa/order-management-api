import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function verifyJWT(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Access token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    // Pastikan token benar-benar ada dan tidak undefined
    if (!token) {
      return reply.code(401).send({ error: 'Access token missing' });
    }

    const secret = process.env.JWT_SECRET ?? 'supersecretkey_fallback';

    const decoded = jwt.verify(token, secret) as unknown as JwtPayload;

    req.user = decoded;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
}