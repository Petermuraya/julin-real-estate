
import { MongoClient, Db } from "mongodb";
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
const uri = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const client = new MongoClient(uri);

export async function connectToMongo() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  return client.db('julin-realestate'); // DB name
}


// infrastructure/database/mongodb.client.ts

import { MongoClient, Db } from "mongodb";
import { serverEnv, isServer } from "@/config/env";

if (!isServer) {
  throw new Error("❌ MongoDB client must never be used on the client");
}

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Returns a singleton MongoDB database instance
 * - Prevents connection exhaustion
 * - Safe for Next.js (dev + prod)
 */
export async function getMongoDb(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(serverEnv.MONGODB_URI);
    await client.connect();
  }

  db = client.db(); // default DB from URI
  return db;
}

export async function getMongoDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL not defined in environment variables");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URL, {
      serverApi: { version: "1" },
    });
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(); // Uses default database from connection string
  return cachedDb;
}