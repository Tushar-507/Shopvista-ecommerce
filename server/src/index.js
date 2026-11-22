import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDemoUser, seedProducts } from './seed.js';
import { errorHandler, notFound } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5000;

const app = express();
app.disable('x-powered-by');

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS.'));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  const started = Date.now();
  res.on('finish', () => {
    console.log(
      `[api] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - started}ms)`,
    );
  });
  return next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Serve the built client when it exists, so `npm run build && npm start` works.
// The existence check happens per request so a build produced after startup is
// picked up without restarting the API.
const clientDist = path.resolve(__dirname, '../../client/dist');
const clientIndex = path.join(clientDist, 'index.html');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (!fs.existsSync(clientIndex)) return next();
  return res.sendFile(clientIndex);
});

app.use('/api', notFound);
app.use(notFound);
app.use(errorHandler);

async function start() {
  const connection = await connectDB();
  const seeded = await seedProducts();
  const demo = await seedDemoUser();

  console.log(
    seeded.skipped
      ? `[seed] catalog already present (${seeded.existing} products)`
      : `[seed] ${seeded.seeded} products loaded`,
  );
  if (demo.created) console.log('[seed] demo account ready: demo@shopvista.com / shopvista123');

  const server = app.listen(PORT, () => {
    console.log(`[api] ShopVista API listening on http://localhost:${PORT}`);
    console.log(`[api] database mode: ${connection.mode}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch(async (error) => {
  console.error('[api] failed to start:', error);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
