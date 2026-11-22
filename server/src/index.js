import 'dotenv/config';
import app, { ensureReady } from './app.js';
import { disconnectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;

// Vercel's Node runtime imports this module and uses the default export as the
// request handler, so the app must be exported without starting a listener.
export default app;

async function start() {
  const connection = await ensureReady();

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

// On Vercel the platform owns the listener. Everywhere else (local dev,
// `npm start`) we start our own server as before.
if (!process.env.VERCEL) {
  start().catch(async (error) => {
    console.error('[api] failed to start:', error);
    await disconnectDB().catch(() => {});
    process.exit(1);
  });
}
