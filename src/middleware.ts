import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that don't require authentication (checked via prefix)
const PUBLIC_PREFIXES = ["/api/auth/", "/api/", "/_next/", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from landing/login to dashboard
  if (pathname === "/" || pathname === "/login") {
    const token = request.cookies.get("auth_token")?.value;
    if (token && (await verifyToken(token))) {
      return NextResponse.redirect(new URL("/nastenka", request.url));
    }
    return NextResponse.next();
  }

  // Allow public paths
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Check auth cookie
  const token = request.cookies.get("auth_token")?.value;

  if (!token || !(await verifyToken(token))) {
    // Redirect to login, preserving the original destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
