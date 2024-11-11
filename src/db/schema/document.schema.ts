import { ObjectId } from 'mongodb';

export interface Document {
  _id: ObjectId;
  title: string;
  content: string;
  folderId?: ObjectId;
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

export interface Folder {
  _id: ObjectId;
  name: string;
  parentId?: ObjectId;
  ownerId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  collaborators: Array<{
    userId: ObjectId;
    role: "viewer" | "editor" | "admin";
  }>;
}