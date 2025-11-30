import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://localhost:27017/comp3123_assigment1';
const MONGO_URI = process.env.MONGO_URI || DEFAULT_URI;

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

mongoose.set('strictQuery', true);

/**
 * @param {string} [uri] 
 */

export async function connectDB(uri = MONGO_URI) {
  const maxAttempts = 5;
  const delayMs = 1000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri, {
      });
      console.log(`MongoDB connected (${mongoose.connection.name})`);
      wireConnectionEvents();
      wireProcessSignals();
      return mongoose.connection;
    } catch (err) {
      console.error(
        `MongoDB connection failed (attempt ${attempt}/${maxAttempts}):`,
        err?.message || err
      );
      if (attempt === maxAttempts) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, delayMs * attempt)); // backoff
    }
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  }
}

function wireConnectionEvents() {
  const conn = mongoose.connection;

  conn.on('error', (err) => {
    console.error('MongoDB connection error:', err?.message || err);
  });

  conn.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  conn.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });
}

let signalsWired = false;
function wireProcessSignals() {
  if (signalsWired) return;
  signalsWired = true;

  const graceful = async (signal) => {
    try {
      console.log(`\n${signal} received — closing MongoDB connection…`);
      await disconnectDB();
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', graceful);
  process.on('SIGTERM', graceful);
}
