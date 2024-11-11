"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { Toolbar } from "./Toolbar";
import { Preview } from "./Preview";
import { useMarkdownShortcuts } from "@/hooks/useMarkdownShortcuts";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { Input } from "../ui/input";

interface MarkdownEditorProps {
    initialValue?: string;
    documentId?: string;
    onChange?: (value: string) => void;
}

export function MarkdownEditor({ initialValue = "", documentId, onChange }: MarkdownEditorProps) {
    const [content, setContent] = useState(initialValue);
    const [title, setTitle] = useState("Untitled Document");
    const [isPreviewMode, setIsPreviewMode] = useState<'edit' | 'preview' | 'split'>('edit');
    const { theme, setTheme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);

    const createDocument = api.document.create.useMutation({
        onSuccess: () => {
            utils.document.getFolderContents.invalidate();
        }
    });
    const updateDocument = api.document.update.useMutation({
        onSuccess: () => {
            utils.document.getFolderContents.invalidate();
        }
    });

    // Get the utils for invalidating queries
    const utils = api.useUtils();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (documentId) {
                await updateDocument.mutateAsync({
                    id: documentId,
                    title,
                    content,
                });
            } else {
                const doc = await createDocument.mutateAsync({
                    title,
                    content,
                    isPublic: false,
                });
                // You might want to redirect to the document page here
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = useCallback((value: string) => {
        setContent(value);
        onChange?.(value);
    }, [onChange]);

    const insertFormat = useCallback((format: string) => {
        const textarea = document.querySelector("textarea");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        // Handle multi-line selection
        const selectedText = text.substring(start, end);
        const lines = selectedText.split('\n');

        // Special handling for lists
        if (format === "- $1") {
            const formattedLines = lines.map(line => format.replace("$1", line.trim()));
            const formattedText = formattedLines.join('\n');

            const before = text.substring(0, start);
            const after = text.substring(end);
            const newText = before + formattedText + after;

            handleChange(newText);

            // Set cursor position after formatting
            requestAnimationFrame(() => {
                textarea.focus();
                const newCursorPos = start + formattedText.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            });
        } else {
            // Handle other formats normally
            const formattedText = format.replace("$1", selectedText || "");
            const before = text.substring(0, start);
            const after = text.substring(end);
            const newText = before + formattedText + after;

            handleChange(newText);

            requestAnimationFrame(() => {
                textarea.focus();
                const newCursorPos = start + formattedText.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            });
        }
    }, [handleChange]);

    const togglePreview = useCallback(() => {
        setIsPreviewMode(prev => {
            if (prev === 'edit') return 'preview';
            if (prev === 'preview') return 'split';
            return 'edit';
        });
    }, []);

    useMarkdownShortcuts(insertFormat);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            const textarea = e.currentTarget;
            const cursorPosition = textarea.selectionStart;
            const text = textarea.value;
            const lines = text.substring(0, cursorPosition).split('\n');
            const currentLine = lines[lines.length - 1] || '';

            // Check if the current line is a list item
            const listMatch = currentLine.match(/^(\s*)-\s(.*)/);
            if (listMatch) {
                e.preventDefault();

                const [, indent = '', content = ''] = listMatch;
                // If the line is empty (except for the list marker), remove the list marker
                if (!content.trim()) {
                    const beforeText = text.substring(0, cursorPosition - (indent.length + 2));
                    const afterText = text.substring(cursorPosition);
                    handleChange(beforeText + afterText);

                    requestAnimationFrame(() => {
                        textarea.focus();
                        textarea.setSelectionRange(cursorPosition - (indent.length + 2), cursorPosition - (indent.length + 2));
                    });
                } else {
                    // Continue the list
                    const beforeText = text.substring(0, cursorPosition);
                    const afterText = text.substring(cursorPosition);
                    const newText = beforeText + '\n' + indent + '- ' + afterText;
                    handleChange(newText);

                    const newCursorPos = cursorPosition + indent.length + 3;
                    requestAnimationFrame(() => {
                        textarea.focus();
                        textarea.setSelectionRange(newCursorPos, newCursorPos);
                    });
                }
            }
        }
    }, [handleChange]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 p-2 border-b">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-semibold bg-transparent border-none"
                    placeholder="Untitled Document"
                />
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSave}
                    disabled={isSaving}
                    aria-label="save"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
            
            <Toolbar
                onFormat={insertFormat}
                onTogglePreview={togglePreview}
                onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
                previewMode={isPreviewMode}
            />

            <div className="flex-1 flex">
                {(isPreviewMode === 'edit' || isPreviewMode === 'split') && (
                    <textarea
                        value={content}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "flex-1 resize-none p-4 bg-background text-foreground",
                            "border-r focus:outline-none",
                            isPreviewMode === 'split' && "w-1/2"
                        )}
                    />
                )}

                {(isPreviewMode === 'preview' || isPreviewMode === 'split') && (
                    <Preview
                        content={content}
                        className={isPreviewMode === 'split' ? "w-1/2" : "w-full"}
                    />
                )}
            </div>
        </div>
    );
} 