import { Bold, Heading, Code, Link, List, Italic, Moon, SplitSquareVertical, Sun, Eye } from "lucide-react";
import { Button } from "../ui/button";

interface ToolbarProps {
  onFormat: (format: string) => void;
  onTogglePreview: () => void;
  onToggleTheme: () => void;
  previewMode: 'edit' | 'preview' | 'split';
}

export function Toolbar({ onFormat, onTogglePreview, onToggleTheme, previewMode }: ToolbarProps) {
  const tools = [
    { icon: Bold, format: "**$1**", tooltip: "Bold (Ctrl+B)" },
    { icon: Italic, format: "*$1*", tooltip: "Italic (Ctrl+I)" },
    { icon: List, format: "- $1", tooltip: "List" },
    { icon: Heading, format: "# $1", tooltip: "Heading" },
    { icon: Link, format: "[$1](url)", tooltip: "Link (Ctrl+K)" },
    { icon: Code, format: "`$1`", tooltip: "Code" },
  ];

  return (
    <div className="border-b p-2 flex items-center gap-2">
      {tools.map((tool) => (
        <Button
          key={tool.tooltip}
          variant="ghost"
          size="sm"
          onClick={() => onFormat(tool.format)}
          title={tool.tooltip}
        >
          <tool.icon className="h-4 w-4" />
        </Button>
      ))}
      
      <div className="h-4 w-px bg-border mx-2" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePreview}
        title={`Preview Mode: ${previewMode}`}
      >
        {previewMode === 'edit' ? (
          <Eye className="h-4 w-4" />
        ) : previewMode === 'preview' ? (
          <SplitSquareVertical className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleTheme}
        title="Toggle Theme"
      >
        <Sun className="h-4 w-4 dark:hidden" />
        <Moon className="h-4 w-4 hidden dark:block" />
      </Button>
    </div>
  );
} 