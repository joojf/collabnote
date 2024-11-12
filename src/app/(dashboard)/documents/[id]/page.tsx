import { DocumentViewer } from "@/components/documents/document-viewer";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DocumentPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin");
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto h-screen p-4">
                <div className="h-[calc(100vh-32px)] border rounded-lg overflow-hidden">
                    <DocumentViewer documentId={params.id} />
                </div>
            </div>
        </main>
    );
} 