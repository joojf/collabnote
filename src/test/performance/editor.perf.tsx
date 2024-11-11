import { performance } from 'perf_hooks';
import { renderToString } from 'react-dom/server';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { describe, expect, it } from 'vitest';

describe('MarkdownEditor Performance', () => {
    it('measures render performance', () => {
        const start = performance.now();

        renderToString(<MarkdownEditor initialValue="# Test" />);

        const end = performance.now();
        expect(end - start).toBeLessThan(100); // Should render in under 100ms
    });
});
