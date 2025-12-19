import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { prisma } from "./prisma";

export interface JwtPayload {
  userId: number;
  username: string;
  iat: number;
  exp: number;
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key",
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
    });

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function validateToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key",
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
    });

    return user ? decoded : null;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}
