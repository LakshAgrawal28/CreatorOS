import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed "middleware" to "proxy"
export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "creatoros_nextauth_dev_secret_123456789",
  });

  const path = req.nextUrl.pathname;
  const demoRole = req.cookies.get("demo_role")?.value;
  const hasAccess = token || demoRole;

  // Redirect unauthenticated users away from protected routes
  if (
    (path.startsWith("/dashboard") || path.startsWith("/api/creator") || path.startsWith("/api/sponsors")) &&
    !hasAccess
  ) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Role-based protection: only SPONSOR role can create campaigns
  const role = token?.role || demoRole;
  if (path.startsWith("/dashboard/sponsor/campaigns/new") && role !== "SPONSOR") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Match all routes that need session verification
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/creator/:path*",
    "/api/sponsors/:path*",
  ],
};
