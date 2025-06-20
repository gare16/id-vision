// app/api/visitors/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const visitors = await prisma.visitor.findMany();
  return NextResponse.json(visitors);
}
