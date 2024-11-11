import { http, HttpResponse } from 'msw';

export const handlers = [
    http.post('/api/auth/signup', async ({ request }) => {
        const body = await request.json() as { email: string; name: string };
        
        if (!body) {
            return HttpResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        return HttpResponse.json({
            id: '1',
            email: body.email,
            name: body.name,
        });
    }),

    http.post('/api/trpc/*', () => {
        return HttpResponse.json({
            result: { data: { greeting: 'Hello test' } }
        });
    }),
];
