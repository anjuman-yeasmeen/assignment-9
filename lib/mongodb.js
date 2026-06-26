import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ideavault';

if (!uri) {
  throw new Error('Missing MONGO_URI environment variable');
}

// Reuse a single MongoClient across hot reloads in development and across
// serverless invocations in production. Without this, every request would open
// a new connection pool and quickly exhaust the database connection limit.
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export default clientPromise;
