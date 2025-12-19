import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export interface JwtPayload {
  userId: number;
  username: string;
  iat: number;
  exp: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function isAuthenticated(_request: NextRequest) {
  // Get the cookie store from the request
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    return true;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
}

// This middleware function checks authentication for protected routes
export async function proxy(request: NextRequest) {
  // Define protected routes that require authentication
  const protectedPaths = [
    "/check-rfid",
    "/logs-visitors",
    "/rfid-tag",
    "/uploads",
    "/visitors",
  ];

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtectedRoute) {
    const authenticated = await isAuthenticated(request);

    if (!authenticated) {
      // Redirect to login page if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.search = `returnUrl=${encodeURIComponent(request.nextUrl.pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/check-rfid/:path*",
    "/logs-visitors/:path*",
    "/rfid-tag/:path*",
    "/uploads/:path*",
    "/visitors/:path*",
  ],
};
