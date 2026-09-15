# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# --- Stage 2: Production Run ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Salin file konfigurasi dan hasil build dari builder
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Ekspos port aplikasi Fastify
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "dist/server.js"]