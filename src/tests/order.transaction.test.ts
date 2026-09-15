import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildApp } from '../server.js';
import prisma from '../config/database.js';
import type { FastifyInstance } from 'fastify';

describe('Order Transaction & Rollback Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Bersihkan data pesanan/produk test sebelumnya
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany({
      where: { name: { contains: 'Test Product' } },
    });
  });

  it('harus melakukan rollback transaksi jika ada data yang gagal saat proses order', async () => {
    // 1. Buat produk dummy dengan stok awal 10
    const product = await prisma.product.create({
      data: {
        name: 'Test Product Transaction',
        price: 10000,
        stock: 10,
      },
    });

    // 2. Simulasi transaksi gagal (misal kita sengaja lempar error atau kirim data invalid)
    // Pastikan service/repository order kamu menggunakan prisma.$transaction
    try {
      await prisma.$transaction(async (tx) => {
        // Kurangi stok
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: 2 } },
        });

        // Sengaja gagalkan transaksi dengan melempar error manual
        throw new Error('Simulasi kegagalan di tengah transaksi order');
      });
    } catch (error) {
      // Tangkap error yang memang kita sengaja buat
    }

    // 3. Verifikasi apakah stok produk KEMBALI UTUH (rollback berhasil)
    const checkedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    // Stok harus tetap 10, bukan jadi 8, karena transaksi dibatalkan (rollback)
    expect(checkedProduct?.stock).toBe(10);
  });
});