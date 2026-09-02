import 'dotenv/config';
import Fastify from 'fastify';
import { userRoutes } from './routes/user.routes.js';

const app = Fastify({ logger: true });

// Daftarkan rute user dengan prefix /api
app.register(userRoutes, { prefix: '/api/users' });

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