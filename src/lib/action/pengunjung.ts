import { prisma } from "@/lib/prisma";

export async function getPengunjung() {
  const res = await prisma.visitor.findMany();
  return res;
}
