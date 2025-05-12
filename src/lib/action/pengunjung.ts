import { prisma } from "@/lib/prisma";

export async function getPengunjung() {
  const res = await prisma.pengunjung.findMany();
  return res;
}
