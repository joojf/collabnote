import { ObjectId } from "mongodb";

export interface Comment {
    _id: ObjectId;
    documentId: ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: ObjectId;
    position: {
        startOffset: number;
        endOffset: number;
    };
    resolved: boolean;
    replies: Array<{
        authorId: ObjectId;
        content: string;
        createdAt: Date;
    }>;
}
