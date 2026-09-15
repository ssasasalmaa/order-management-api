import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';
import { orderQueue } from '../queues/order.queue.js';

// 1. Pakai FastifyAdapter, bukan ExpressAdapter
const serverAdapter = new FastifyAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(orderQueue)],
  serverAdapter: serverAdapter,
});

// 2. Export register plugin khusus Fastify
export const registerBullBoard = async (app: any) => {
  await app.register(serverAdapter.registerPlugin(), {
    prefix: '/admin/queues',
  });
};