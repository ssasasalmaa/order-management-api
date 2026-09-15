import { Worker } from 'bullmq';
import { redis } from '../config/redis.js';
import prisma from '../config/database.js'; // Sesuaikan path relative ini ke file konfigurasi prisma kamu (tempat code di atas berada)

export const orderWorker = new Worker(
  'order-queue',
  async (job) => {
    console.log(`[Background Worker] Mulai memproses job ID: ${job.id}`);
    const { orderId, userId } = job.data;

    console.log(`Memproses pesanan ${orderId} untuk user ${userId}...`);
    
    // Simulasi jeda proses 3 detik
    await new Promise((resolve) => setTimeout(resolve, 3000)); 

    // Cek idempotency: Pastikan order masih PENDING sebelum diproses
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'PENDING') {
      console.log(`Job ${job.id} di-skip karena order ${orderId} sudah diproses sebelumnya.`);
      return;
    }

    // Update status order di database PostgreSQL jadi PROCESSING
await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
    });

    console.log(`[Background Worker] Pesanan ${orderId} statusnya berubah jadi PROCESSING!`);

    // Step 51: Simulasi Kirim Email Notifikasi
    console.log(`[Email Service] Mengirim email konfirmasi ke user untuk pesanan ${orderId}...`);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulasi jeda kirim email 2 detik
    console.log(`[Email Service] Email untuk pesanan ${orderId} berhasil terkirim!`);
  },
  {
    connection: redis,
  }
);
orderWorker.on('completed', (job) => {
  console.log(`Job ${job?.id} selesai dengan sukses!`);
});

orderWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} gagal diproses:`, err.message);
});