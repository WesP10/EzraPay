import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@ezrapay.flwga3p.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsInsecure=false&appName=ezrapay`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: Db | null = null;

export async function connectDB(): Promise<Db | null> {
  try {
    await client.connect();
    db = client.db("ezrapay");
    console.log("Connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return null;
  }
}

export function getDB(): Db | null {
  return db;
}

export { client };
