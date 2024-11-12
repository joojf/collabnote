"use client";

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { File, Folder, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';

export function DocumentList() {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const { toast } = useToast();
    const utils = api.useUtils();

    const deleteDocument = api.document.delete.useMutation({
        onSuccess: () => {
            utils.document.getFolderContents.invalidate();
            toast({
                title: "Success",
                description: "Document deleted successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete document",
                variant: "destructive",
            });
        },
    });

    const handleDelete = async (documentId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.confirm("Are you sure you want to delete this document?")) {
            await deleteDocument.mutate({ id: documentId });
        }
    };

    const { data: documents, isLoading } = api.document.getFolderContents.useQuery({
        folderId: undefined,
    });

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    const renderFolder = (folder: any) => {
        const isExpanded = expandedFolders.has(folder._id.toString());

        return (
            <div key={folder._id.toString()} className="space-y-1">
                <div
                    className="flex items-center p-2 hover:bg-secondary rounded-lg cursor-pointer"
                    onClick={() => toggleFolder(folder._id.toString())}
                >
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                    </Button>
                    <Folder className="h-4 w-4 mr-2" />
                    <span>{folder.name}</span>
                </div>

                {isExpanded && (
                    <div className="ml-6">
                        {documents?.folders
                            .filter(f => f.parentId?.toString() === folder._id.toString())
                            .map(renderFolder)}
                        {documents?.documents
                            .filter(d => d.folderId?.toString() === folder._id.toString())
                            .map(renderDocument)}
                    </div>
                )}
            </div>
        );
    };

    const renderDocument = (doc: any) => (
        <Link
            href={`/documents/${doc._id.toString()}`}
            key={doc._id.toString()}
            className="flex items-center p-2 hover:bg-secondary rounded-lg group"
        >
            <File className="h-4 w-4 mr-2" />
            <span className="flex-1">{doc.title}</span>
            <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDelete(doc._id.toString(), e)}
            >
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
        </Link>
    );

    return (
        <div className="p-4 space-y-2">
            <h2 className="text-lg font-semibold mb-4">My Documents</h2>

            {/* Root level folders */}
            {documents?.folders
                .filter(f => !f.parentId)
                .map(renderFolder)}

            {/* Root level documents */}
            {documents?.documents
                .filter(d => !d.folderId)
                .map(renderDocument)}
        </div>
    );
}
