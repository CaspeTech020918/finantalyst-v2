import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/api/auth", "/product", "/tax", "/compliance", "/deal-room"];

export default auth((req: NextRequest & { auth?: { user?: unknown } | null }) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isHome = nextUrl.pathname === "/";
  const isPublic = isHome || PUBLIC_PATHS.some((p) => nextUrl.pathname.startsWith(p));

  // Not logged in and not a public path → login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Logged-in at home → dashboard
  if (session && isHome) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Logged-in at login/register → dashboard
  if (session && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
