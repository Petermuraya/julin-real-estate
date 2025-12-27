import { MongoClient } from 'mongodb';

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
