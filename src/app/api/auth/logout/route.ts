import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/logout
export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      message: "Logout successful",
    });

    // Clear the authentication cookie by setting it to expire immediately
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}