import InvalidLoginError from "@/lib/auth/errors/invalidLoginError";
import { comparePasswords } from "@/lib/auth/utils/password-helpers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { DefaultSession, NextAuthConfig } from "next-auth";
import "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { db } from "./db";
import { accounts, sessions, users, verificationTokens } from "./db/schema";
import { applyRateLimit } from "./redis/ratelimiter";

// extend the types to include role and status
declare module "next-auth" {
  interface User {
    role?: "user" | "admin";
    status?: "active" | "suspended" | "inactive";
  }

  interface Session {
    user: {
      id: string;
      role?: "user" | "admin";
      status?: "active" | "suspended" | "inactive";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "user" | "admin";
    status?: "active" | "suspended" | "inactive" | undefined;
  }
}

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    verifyRequest: "/verify-request",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        return isLoggedIn && auth?.user?.role === "admin";
      } else if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Block login for OAuth users with inactive status
      if (
        account?.type !== "credentials" &&
        user.status &&
        user.status === "inactive"
      ) {
        return "/inactive-user";
      }
      return true;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          throw new InvalidLoginError("INVALID_INPUT");
        }

        //  Rate limit check
        const limiterResult = await applyRateLimit({
          limiterKey: "authRateLimit",
        });

        if (!limiterResult?.success)
          throw new InvalidLoginError("TOO_MANY_REQUESTS");

        const { email, password } = parsed.data;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase()));

        if (!user) throw new InvalidLoginError("INVALID_CREDENTIALS");

        // if (user.status !== "active")
        //   throw new InvalidLoginError(
        //     user.status === "suspended"
        //       ? "ACCOUNT_SUSPENDED"
        //       : "ACCOUNT_INACTIVE"
        //   );

        if (user.status === "inactive")
          throw new InvalidLoginError("ACCOUNT_INACTIVE");

        const passwordsMatch = await comparePasswords(
          password,
          user.password || ""
        );

        if (!passwordsMatch) throw new InvalidLoginError("INVALID_CREDENTIALS");

        return user;
      },
    }),
  ],
};
