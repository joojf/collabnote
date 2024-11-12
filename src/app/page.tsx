import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DocumentList } from "@/components/documents/document-list";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">CollabNote</h1>
          <SignOutButton />
        </div>
        <div className="grid grid-cols-[300px_1fr] gap-4 h-[calc(100vh-100px)]">
          <div className="border rounded-lg overflow-y-auto">
            <DocumentList />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <MarkdownEditor />
          </div>
        </div>
      </div>
    </main>
  );
}
