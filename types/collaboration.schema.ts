import { ObjectId } from "mongodb";

export interface CollaborationSession {
    _id: ObjectId;
    documentId: ObjectId;
    activeUsers: Array<{
        userId: ObjectId;
        lastActive: Date;
        cursor: {
            position: number;
            selection: { start: number; end: number; };
        };
    }>;
    operations: Array<{
        userId: ObjectId;
        timestamp: Date;
        type: "insert" | "delete" | "update";
        position: number;
        content?: string;
    }>;
}
