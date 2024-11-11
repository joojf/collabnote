import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export async function connectDB() {
    if (!client.connect()) {
        await client.connect();
    }
    return client.db();
} 