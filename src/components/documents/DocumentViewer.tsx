import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { MarkdownEditor } from "../editor/MarkdownEditor";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

interface DocumentViewerProps {
    documentId: string;
}

export function DocumentViewer({ documentId }: DocumentViewerProps) {
    const router = useRouter();
    const { data: document, isLoading } = api.document.getById.useQuery({ id: documentId });

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!document) {
        return <div className="p-4">Document not found</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="border-b p-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/")}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Documents
                </Button>
            </div>
            <div className="flex-1">
                <MarkdownEditor
                    documentId={documentId}
                    initialValue={document.content}
                    initialTitle={document.title}
                />
            </div>
        </div>
    );
} 