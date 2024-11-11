import { connectDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import type { User } from "@/db/schema";

export async function findUserByEmail(email: string) {
    const db = await connectDB();
    return db.collection<User>("users").findOne({ email });
}

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'settings'>) {
    const db = await connectDB();
    const now = new Date();

    const user = {
        ...userData,
        _id: new ObjectId(),
        createdAt: now,
        updatedAt: now,
        settings: {
            theme: "light",
            notifications: true
        }
    };

    await db.collection<User>("users").insertOne(user);
    return user;
}

export async function updateUser(userId: ObjectId, update: Partial<User>) {
    const db = await connectDB();
    return db.collection<User>("users").updateOne(
        { _id: userId },
        {
            $set: {
                ...update,
                updatedAt: new Date()
            }
        }
    );
} 