import { connectDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import type { Document } from "@/db/schema";

export async function createDocument(document: Omit<Document, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await connectDB();
  const now = new Date();

  const newDocument = {
    ...document,
    _id: new ObjectId(),
    createdAt: now,
    updatedAt: now,
  };

  await db.collection<Document>("documents").insertOne(newDocument);
  return newDocument;
}

export async function updateDocument(documentId: ObjectId, update: Partial<Document>) {
  const db = await connectDB();
  return db.collection<Document>("documents").updateOne(
    { _id: documentId },
    {
      $set: {
        ...update,
        updatedAt: new Date()
      }
    }
  );
}

export async function findDocumentById(documentId: ObjectId) {
  const db = await connectDB();
  return db.collection<Document>("documents").findOne({ _id: documentId });
}

export async function findDocumentsByUserId(userId: ObjectId) {
  const db = await connectDB();
  return db.collection<Document>("documents")
    .find({ 
      $or: [
        { ownerId: userId },
        { "collaborators.userId": userId }
      ]
    })
    .toArray();
} 