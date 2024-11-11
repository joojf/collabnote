import { useEffect } from 'react';

export function useMarkdownShortcuts(onFormat: (format: string) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          onFormat('**$1**');
          break;
        case 'i':
          e.preventDefault();
          onFormat('*$1*');
          break;
        case 'k':
          e.preventDefault();
          onFormat('[$1](url)');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onFormat]);
} 