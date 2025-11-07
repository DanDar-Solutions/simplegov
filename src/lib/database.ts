// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

declare global {
  // prevent multiple connections in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get the DB
export async function getDatabase(dbName: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
