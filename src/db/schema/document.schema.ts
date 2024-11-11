import { ObjectId } from 'mongodb';

export interface Document {
  _id: ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: ObjectId;
  collaborators: Array<{
    userId: ObjectId;
    role: "viewer" | "editor" | "admin";
    addedAt: Date;
  }>;
  isPublic: boolean;
  tags: string[];
  metadata: {
    lastEditedBy: ObjectId;
    version: number;
    wordCount: number;
  };
}