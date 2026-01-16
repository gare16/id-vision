// app/api/visitors/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const visitors = await prisma.visitor.findMany();
  return NextResponse.json(visitors);
}
