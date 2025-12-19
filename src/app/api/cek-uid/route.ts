import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json(
      { status: "error", message: "UID tidak ditemukan" },
      { status: 400 },
    );
  }

  const rfid = await prisma.rfidTag.findFirst({
    where: {
      rfidTag: uid,
    },
    select: {
      status: true,
      rfidTag: true,
      visitor: {
        select: {
          name: true,
          nik: true,
        },
      },
    },
  });

  const statusRfid = !rfid?.status ? "unavailable" : "available";

  if (rfid?.rfidTag) {
    return NextResponse.json(
      { status: statusRfid, name: rfid.visitor?.name, nik: rfid.visitor?.nik },
      { status: 200 },
    );
  } else {
    return NextResponse.json({ status: "denied" }, { status: 403 });
  }
}
