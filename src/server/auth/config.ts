import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/db/users";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isGuest: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isGuest?: boolean;
  }
}

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        const user = await findUserByEmail(email);
        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isGuest = user.isGuest;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isGuest = token.isGuest as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig;
