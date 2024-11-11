import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createDocument, updateDocument, findDocumentsByUserId } from "@/lib/db/documents";
import { ObjectId } from "mongodb";

export const documentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      isPublic: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
    }))
    .mutation(async ({ input, ctx }) => {
      const document = await createDocument({
        ...input,
        ownerId: new ObjectId(ctx.session.user.id),
        collaborators: [],
        metadata: {
          lastEditedBy: new ObjectId(ctx.session.user.id),
          version: 1,
          wordCount: input.content.split(/\s+/).length,
        },
      });
      return document;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      isPublic: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...update } = input;
      const document = await updateDocument(new ObjectId(id), {
        ...update,
        metadata: {
          lastEditedBy: new ObjectId(ctx.session.user.id),
          version: 1,
          wordCount: update.content?.split(/\s+/).length ?? 0,
        },
      });
      return document;
    }),

  getUserDocuments: protectedProcedure
    .query(async ({ ctx }) => {
      const documents = await findDocumentsByUserId(new ObjectId(ctx.session.user.id));
      return documents;
    }),
}); 