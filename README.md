# CollabNote

CollabNote is a collaborative Markdown editor built with the T3 Stack, featuring real-time collaboration, dark mode support, and a modern user interface.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [MongoDB](https://www.mongodb.com) - Database
- [tRPC](https://trpc.io) - End-to-end typesafe API
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root of the project and add the following:

```
# Auth
AUTH_SECRET="your-secret-here"
MONGODB_URI="your-mongodb-uri"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

4. Start the development server: `npm run dev`
5. Open the browser and navigate to `http://localhost:3000`
