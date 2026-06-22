import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getUserByEmail, INITIAL_CREDITS } from "./user-store";
import { logAuthFailure, clearFailures } from "./security-log";
import { getIp } from "./rate-limit";

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
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Extract client IP from the raw request headers
        const ip =
          (req?.headers as Record<string, string | undefined>)?.[
            "x-forwarded-for"
          ]?.split(",")[0]?.trim() ??
          (req?.headers as Record<string, string | undefined>)?.["x-real-ip"] ??
          "unknown";

        const email = credentials.email.toLowerCase();

        const user = await getUserByEmail(email);
        if (!user) {
          logAuthFailure(ip, email, "user_not_found");
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword!
        );
        if (!passwordMatch) {
          logAuthFailure(ip, email, "wrong_password");
          return null;
        }

        if (!user.emailVerified) {
          logAuthFailure(ip, email, "email_not_verified");
          throw new Error("email_not_verified");
        }

        // Successful login — clear failure counter
        clearFailures(ip);

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
