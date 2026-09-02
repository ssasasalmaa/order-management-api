import 'dotenv/config';
import Fastify from 'fastify';
import { userRoutes } from './routes/user.routes.js';
import { orderRoutes } from './routes/order.routes.js';
import { productRoutes } from './routes/product.routes.js';

const app = Fastify({ logger: true });

app.register(userRoutes, { prefix: '/api/users' });
app.register(orderRoutes, { prefix: '/api/orders' });
app.register(productRoutes, { prefix: '/api/products' });

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