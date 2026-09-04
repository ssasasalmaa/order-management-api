import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.util.js';

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
      return sendError(reply, 401, 'Access token missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(reply, 401, 'Access token missing');
    }

    const secret = process.env.JWT_SECRET ?? 'supersecretkey_fallback';

    const decoded = jwt.verify(token, secret) as unknown as JwtPayload;

    req.user = decoded;
  } catch (error) {
    return sendError(reply, 401, 'Invalid or expired token');
  }
}