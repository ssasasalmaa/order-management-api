import 'dotenv/config';
import Fastify from 'fastify';
import { userRoutes } from './routes/user.routes.js';
import { orderRoutes } from './routes/order.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { cartRoutes } from './routes/cart.routes.js';
import { sendError } from './utils/response.util.js';

const app = Fastify({ logger: true });

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

const bootstrap = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

bootstrap();