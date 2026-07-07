import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Edge-safe auth config — NO Prisma, NO Node.js-only modules.
// Used by proxy.ts (Edge runtime) for optimistic session checks.
// Full auth with PrismaAdapter lives in auth.ts (Node.js runtime only).
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.mode = (user as { mode?: string }).mode ?? "INDIVIDUAL";
        token.onboardingDone =
          (user as { onboardingDone?: boolean }).onboardingDone ?? false;
      }
      // Called when useSession().update({ ... }) is triggered from the client
      if (trigger === "update" && session) {
        if (session.onboardingDone !== undefined) token.onboardingDone = session.onboardingDone;
        if (session.mode !== undefined) token.mode = session.mode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { mode?: string }).mode = token.mode as string;
        (session.user as { onboardingDone?: boolean }).onboardingDone =
          token.onboardingDone as boolean;
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  providers: [
    // Credentials provider is listed here so NextAuth knows the strategy,
    // but the actual authorize() (which needs bcrypt + db) lives in auth.ts.
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // This is never called from the proxy — only from the API route
        // which uses the full auth.ts config with PrismaAdapter.
        return null;
      },
    }),
  ],
};
