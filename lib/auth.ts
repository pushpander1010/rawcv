import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "./user-store";

const INITIAL_CREDITS = 10;
// Dev-only admin credentials — only active when NODE_ENV !== "production"
const DEV_ADMIN_EMAIL = process.env.DEV_ADMIN_EMAIL ?? "admin@localhost";
const DEV_ADMIN_PASSWORD = process.env.DEV_ADMIN_PASSWORD ?? "admin";
const ALLOW_DEV_ADMIN_LOGIN = process.env.NODE_ENV !== "production";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Dev admin — fully in-memory, no DB required
        if (
          ALLOW_DEV_ADMIN_LOGIN &&
          credentials.email === DEV_ADMIN_EMAIL &&
          credentials.password === DEV_ADMIN_PASSWORD
        ) {
          return { id: "dev-admin", email: DEV_ADMIN_EMAIL, name: "Admin" };
        }

        const user = await getUserByEmail(credentials.email);
        if (!user) return null;
        if (!user.emailVerified) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword!
        );
        if (!passwordMatch) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.email) {
        const email = user.email.toLowerCase();
        if (account?.provider === "credentials" && user.id) {
          token.id = user.id;
        } else {
          const dbUser = await prisma.user.upsert({
            where: { email },
            create: {
              email,
              name: user.name ?? "User",
              emailVerified: true,
              creditBalance: INITIAL_CREDITS,
            },
            update: {
              name: user.name ?? undefined,
              emailVerified: true,
            },
          });
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
