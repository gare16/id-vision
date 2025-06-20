import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json(
      { status: "error", message: "UID tidak ditemukan" },
      { status: 400 }
    );
  }

  const rfid = await prisma.rfid_Tag.findFirst({
    where: {
      rfid_tag: uid,
    },
    select: {
      status: true,
      rfid_tag: true,
      Visitor: {
        select: {
          name: true,
          nik: true,
        },
      },
    },
  });

  const statusRfid = !rfid?.status ? "unavailable" : "available";

  if (rfid?.rfid_tag) {
    return NextResponse.json(
      { status: statusRfid, name: rfid.Visitor?.name, nik: rfid.Visitor?.nik },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ status: "denied" }, { status: 403 });
  }
}
