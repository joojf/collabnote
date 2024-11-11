"use client";

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function DocumentList() {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

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
            className="flex items-center p-2 hover:bg-secondary rounded-lg"
        >
            <File className="h-4 w-4 mr-2" />
            <span>{doc.title}</span>
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
