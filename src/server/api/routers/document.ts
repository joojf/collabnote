import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";
import {
  createDocument,
  updateDocument,
  findDocumentsByFolderId,
  createFolder,
  getFolderStructure,
  getDocumentById,
  deleteDocument,
} from "@/lib/db/documents";

export const documentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      folderId: z.string().optional(),
      isPublic: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
    }))
    .mutation(async ({ input, ctx }) => {
      const document = await createDocument({
        ...input,
        folderId: input.folderId ? new ObjectId(input.folderId) : undefined,
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

  createFolder: protectedProcedure
    .input(z.object({
      name: z.string(),
      parentId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const folder = await createFolder({
        ...input,
        parentId: input.parentId ? new ObjectId(input.parentId) : undefined,
        ownerId: new ObjectId(ctx.session.user.id),
        collaborators: [],
      });
      return folder;
    }),

  getFolderContents: protectedProcedure
    .input(z.object({
      folderId: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const documents = await findDocumentsByFolderId(
        input.folderId ? new ObjectId(input.folderId) : undefined,
        new ObjectId(ctx.session.user.id)
      );
      const folders = await getFolderStructure(new ObjectId(ctx.session.user.id));
      return { documents, folders };
    }),

  updatePermissions: protectedProcedure
    .input(z.object({
      documentId: z.string(),
      collaborators: z.array(z.object({
        userId: z.string(),
        role: z.enum(["viewer", "editor", "admin"]),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      const document = await updateDocument(new ObjectId(input.documentId), {
        collaborators: input.collaborators.map(c => ({
          userId: new ObjectId(c.userId),
          role: c.role,
          addedAt: new Date(),
        })),
      });
      return document;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const document = await updateDocument(new ObjectId(input.id), {
        title: input.title,
        content: input.content,
        tags: input.tags,
        metadata: {
          lastEditedBy: new ObjectId(ctx.session.user.id),
          version: 1,
          wordCount: input.content.split(/\s+/).length,
        },
      });
      return document;
    }),

  getById: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const document = await getDocumentById(new ObjectId(input.id));
      return document;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const document = await getDocumentById(new ObjectId(input.id));

      if (!document) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (document.ownerId.toString() !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await deleteDocument(new ObjectId(input.id));
      return { success: true };
    }),
}); 