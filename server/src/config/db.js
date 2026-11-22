import mongoose from 'mongoose';

let memoryServer = null;
let connectionPromise = null;

async function connect() {
  const uri = process.env.MONGODB_URI?.trim();

  if (uri) {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[db] connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
    return { mode: 'external', uri };
  }

  if (process.env.VERCEL) {
    throw new Error(
      'MONGODB_URI is not configured. Add a MongoDB Atlas connection string in the Vercel project settings.',
    );
  }

  console.log('[db] MONGODB_URI not set — starting an in-memory MongoDB...');
  // Imported lazily so the serverless bundle never loads the binary downloader.
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log('[db] in-memory MongoDB ready (data resets on restart)');
  return { mode: 'memory', uri: memoryUri };
}

/**
 * Connects to MongoDB.
 *
 * Set MONGODB_URI to use a real database. When it is missing (the default for
 * local development) an in-memory MongoDB instance is started so the API runs
 * with zero setup. Data in memory is lost when the process stops.
 *
 * The connection promise is cached because Vercel reuses warm function
 * instances across requests; reconnecting each time would exhaust connections.
 */
export function connectDB() {
  if (!connectionPromise) {
    connectionPromise = connect().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  return connectionPromise;
}

export async function disconnectDB() {
  connectionPromise = null;
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
