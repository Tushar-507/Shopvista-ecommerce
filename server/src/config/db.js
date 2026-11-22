import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

/**
 * Connects to MongoDB.
 *
 * Set MONGODB_URI to use a real database. When it is missing (the default for
 * this demo) an in-memory MongoDB instance is started so the API runs with
 * zero setup. Data in memory is lost when the process stops.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim();

  if (uri) {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[db] connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
    return { mode: 'external', uri };
  }

  console.log('[db] MONGODB_URI not set — starting an in-memory MongoDB...');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log('[db] in-memory MongoDB ready (data resets on restart)');
  return { mode: 'memory', uri: memoryUri };
}

export async function disconnectDB() {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
