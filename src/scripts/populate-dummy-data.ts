import { prisma } from "@/lib/prisma";

async function main() {
  // Create dummy users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "admin",
        password: "admin123",
      },
    }),
    prisma.user.create({
      data: {
        username: "security",
        password: "security123",
      },
    }),
  ]);

  // Create dummy visitors
  const visitors = await Promise.all([
    prisma.visitor.create({
      data: {
        nik: "1234567890123456",
        name: "John Doe",
        address: "Jl. Merdeka No. 1, Jakarta",
        birthInfo: "Jakarta, 1990-01-01",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "9876543210987654",
        name: "Jane Smith",
        address: "Jl. Sudirman No. 10, Bandung",
        birthInfo: "Bandung, 1985-05-15",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "5678901234567890",
        name: "Michael Johnson",
        address: "Jl. Thamrin No. 5, Surabaya",
        birthInfo: "Surabaya, 1992-11-22",
      },
    }),
  ]);

  // Create dummy RFID tags
  const rfidTags = await Promise.all([
    prisma.rfidTag.create({
      data: {
        rfidTag: "RFID001",
        status: true,
        visitor: {
          connect: { nik: visitors[0].nik },
        },
      },
    }),
    prisma.rfidTag.create({
      data: {
        rfidTag: "RFID002",
        status: true,
        visitor: {
          connect: { nik: visitors[1].nik },
        },
      },
    }),
    prisma.rfidTag.create({
      data: {
        rfidTag: "RFID003",
        status: false,
      },
    }),
  ]);

  // Create dummy log visitors
  const logVisitors = await Promise.all([
    prisma.logVisitor.create({
      data: {
        rfidTag: "RFID001",
        nik: "1234567890123456",
        date: new Date("2025-12-01T08:30:00"),
        access: true,
        location: "Main Gate",
        rfidTagId: "RFID001",
        nikVisitor: "1234567890123456",
      },
    }),
    prisma.logVisitor.create({
      data: {
        rfidTag: "RFID002",
        nik: "9876543210987654",
        date: new Date("2025-12-01T09:15:00"),
        access: true,
        location: "Main Gate",
        rfidTagId: "RFID002",
        nikVisitor: "9876543210987654",
      },
    }),
    prisma.logVisitor.create({
      data: {
        rfidTag: "RFID001",
        nik: "1234567890123456",
        date: new Date("2025-12-01T17:45:00"),
        access: true,
        location: "Main Gate",
        rfidTagId: "RFID001",
        nikVisitor: "1234567890123456",
      },
    }),
    prisma.logVisitor.create({
      data: {
        rfidTag: "RFID003",
        nik: "5678901234567890",
        date: new Date("2025-12-02T10:20:00"),
        access: false, // Access denied because RFID tag is inactive
        location: "Main Gate",
        rfidTagId: "RFID003",
        nikVisitor: "5678901234567890",
      },
    }),
  ]);

  console.log({ users, visitors, rfidTags, logVisitors });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
