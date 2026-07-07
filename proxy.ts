import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/login", "/register", "/api/auth"];

export default auth((req: NextRequest & { auth?: { user?: unknown } | null }) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isPublic = PUBLIC_PATHS.some((p) => nextUrl.pathname.startsWith(p));

  // Not logged in → send to login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Logged-in user hitting login/register → send to dashboard
  // (dashboard layout will redirect to /onboarding if not done)
  if (session && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
