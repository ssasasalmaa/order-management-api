import 'dotenv/config';
import Fastify from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { redis } from './config/redis.js';
import { userRoutes } from './routes/user.routes.js';
import { orderRoutes } from './routes/order.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { cartRoutes } from './routes/cart.routes.js';
import { sendError } from './utils/response.util.js';
import './workers/order.worker.js';
import { registerBullBoard } from './routes/bull-board.route.js';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      ...(process.env.NODE_ENV !== 'production' && {
        transport: {
          target: 'pino-pretty',
          options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' },
        },
      }),
    } as any, 
    genReqId: (req) => (req.headers['x-request-id'] as string) || crypto.randomUUID(),
    trustProxy: true,
  });

  // Hook untuk menyisipkan x-request-id ke response header
  app.addHook('onRequest', (request, reply, done) => {
    reply.header('x-request-id', request.id);
    done();
  });

  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  await app.register(fastifyHelmet);

  app.register(userRoutes, { prefix: '/api/users' });
  app.register(orderRoutes, { prefix: '/api/orders' });
  app.register(productRoutes, { prefix: '/api/products' });
  app.register(cartRoutes, { prefix: '/api/cart' });

  // --- Global Error Handler ---
  app.setErrorHandler((error: any, req, reply) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    return sendError(
      reply,
      statusCode,
      message,
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
  });

  return app;
}

// 2. Jalankan server hanya jika file ini dijalankan langsung (bukan saat di-import untuk testing)
if (process.env.NODE_ENV !== 'test') {
  const bootstrap = async () => {
    try {
      const app = await buildApp();
      await app.listen({ port: 3000, host: '0.0.0.0' });
      console.log('Server is running on http://localhost:3000');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  bootstrap();
}