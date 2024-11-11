import { connectDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import type { Document, Folder } from "@/db/schema";

// Document operations
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

export async function deleteDocument(documentId: ObjectId) {
  const db = await connectDB();
  return db.collection<Document>("documents").deleteOne({ _id: documentId });
}

export async function findDocumentsByFolderId(folderId: ObjectId | undefined, userId: ObjectId) {
  const db = await connectDB();
  return db.collection<Document>("documents")
    .find({
      folderId,
      $or: [
        { ownerId: userId },
        { "collaborators.userId": userId },
        { isPublic: true }
      ]
    })
    .toArray();
}

// Folder operations
export async function createFolder(folder: Omit<Folder, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await connectDB();
  const now = new Date();
  
  const newFolder = {
    ...folder,
    _id: new ObjectId(),
    createdAt: now,
    updatedAt: now,
  };
  
  await db.collection<Folder>("folders").insertOne(newFolder);
  return newFolder;
}

export async function getFolderStructure(userId: ObjectId) {
  const db = await connectDB();
  return db.collection<Folder>("folders")
    .find({
      $or: [
        { ownerId: userId },
        { "collaborators.userId": userId }
      ]
    })
    .toArray();
} 