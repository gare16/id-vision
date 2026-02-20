import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JwtPayload } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
        message: "No authentication token found",
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key",
      ) as JwtPayload;

      // Fetch user details from database if needed
      // For now, we'll just return the decoded token info
      return NextResponse.json({
        isAuthenticated: true,
        user: {
          userId: decoded.userId,
          username: decoded.username,
        },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("Auth status check error:", error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
