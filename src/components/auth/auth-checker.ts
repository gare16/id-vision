// This component should be used in server components to check authentication
// and redirect to login if not authenticated
"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { JwtPayload } from "@/lib/auth";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key",
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("Authentication error:", error);
    redirect("/auth/login");
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
