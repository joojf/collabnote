import { ObjectId } from "mongodb";

export interface Version {
    _id: ObjectId;
    documentId: ObjectId;
    content: string;
    createdAt: Date;
    createdBy: ObjectId;
    version: number;
    changes: {
        additions: number;
        deletions: number;
    };
}
