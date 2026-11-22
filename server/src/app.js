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
import { connectDB } from './config/db.js';
import { seedDemoUser, seedProducts } from './seed.js';
import { errorHandler, notFound } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.disable('x-powered-by');

const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

// Vercel exposes these hostnames to every deployment. Allowing them keeps the
// same-origin client working on preview and production URLs automatically.
for (const host of [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
  if (host) allowedOrigins.add(`https://${host}`);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
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

let readyPromise = null;

/**
 * Connects to MongoDB and seeds the catalog once per process. Vercel reuses a
 * warm function for several requests, so the promise is cached to avoid
 * reconnecting and reseeding on every invocation.
 */
export function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const connection = await connectDB();
      const seeded = await seedProducts();
      const demo = await seedDemoUser();

      if (!process.env.VERCEL) {
        console.log(
          seeded.skipped
            ? `[seed] catalog already present (${seeded.existing} products)`
            : `[seed] ${seeded.seeded} products loaded`,
        );
        if (demo.created) {
          console.log('[seed] demo account ready: demo@shopvista.com / shopvista123');
        }
      }

      return connection;
    })().catch((error) => {
      // Allow the next request to retry after a cold-start connection failure.
      readyPromise = null;
      throw error;
    });
  }

  return readyPromise;
}

app.get('/api/health', async (_req, res) => {
  // Trigger a connection on a cold serverless instance so the first health
  // check reports the real state instead of "disconnected".
  await ensureReady().catch(() => {});

  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use(async (_req, _res, next) => {
  try {
    await ensureReady();
    next();
  } catch (error) {
    next(error);
  }
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

export default app;
