import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { SignOutButton } from "@/components/auth/SignOutButton";

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
        <MarkdownEditor />
      </div>
    </main>
  );
}
