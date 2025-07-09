/* eslint-disable */
import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGODB_URI } from 'src/config-global';

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    family: 4,
    connectTimeoutMS: 60000,
    serverSelectionTimeoutMS: 60000,
  },
};

// --- Retry wrapper
const connectWithRetry = async (retries = 2, delay = 1000): Promise<MongoClient> => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const client = new MongoClient(uri, options);
      await client.connect();
      console.log(
        `Successfully connected after ${attempt + 1} ${attempt > 0 ? 'attempts' : 'attempt'}`
      );
      return client;
    } catch (error) {
      console.warn(`MongoDB connection failed (attempt ${attempt + 1}):`, error);
      attempt++;
      if (attempt >= retries) throw error;
      console.log(`Trying again in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error('Failed to connect to MongoDB after retries');
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectWithRetry();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = connectWithRetry();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
