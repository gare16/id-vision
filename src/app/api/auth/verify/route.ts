import { NextRequest } from "next/server";

import { validateToken } from "@/lib/auth";

// GET /api/auth/verify
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json(
        { authenticated: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const decoded = await validateToken(token);

    if (decoded) {
      return Response.json({
        authenticated: true,
        user: {
          id: decoded.userId,
          username: decoded.username,
        },
      });
    } else {
      return Response.json(
        { authenticated: false, message: "Invalid token" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return Response.json(
      { authenticated: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
