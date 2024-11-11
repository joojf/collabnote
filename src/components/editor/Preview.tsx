import { marked } from "marked";
import { cn } from "@/lib/utils";

interface PreviewProps {
  content: string;
  className?: string;
}

export function Preview({ content, className }: PreviewProps) {
  const html = marked(content, {
    gfm: true,
    breaks: true
  });

  return (
    <div 
      className={cn(
        "prose dark:prose-invert max-w-none p-4",
        "prose-pre:bg-muted prose-pre:text-muted-foreground",
        "prose-code:text-primary",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
} 