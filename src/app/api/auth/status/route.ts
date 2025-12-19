import { NextRequest } from "next/server";
import { validateToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ isAuthenticated: false }, { status: 200 });
    }

    const user = await validateToken(token);

    if (user) {
      return Response.json({ 
        isAuthenticated: true, 
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
        }
      }, { status: 200 });
    } else {
      return Response.json({ isAuthenticated: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Auth status check error:", error);
    return Response.json({ isAuthenticated: false }, { status: 200 });
  }
}