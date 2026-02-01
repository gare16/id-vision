import { hash } from "bcrypt";

import { prisma } from "@/lib/prisma";
const hashing = async (password: string) => {
  return await hash(password, 10);
}; // Using a default password

async function main() {
  // Create dummy users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "admin",
        password: await hashing("admin123"),
      },
    }),
    prisma.user.create({
      data: {
        username: "security",
        password: await hashing("security123"),
      },
    }),
  ]);

  // Create dummy locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: "Main Gate",
      },
    }),
    prisma.location.create({
      data: {
        name: "Main Office",
      },
    }),
    prisma.location.create({
      data: {
        name: "Conference Room",
      },
    }),
    prisma.location.create({
      data: {
        name: "IT Department",
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
        nationality: "Indonesian",
        phoneNumber: "081234567890",
        organization: "ABC Company",
        visitingPurpose: "Business Meeting",
        placeDestination: "Main Office",
        vehicleNumber: "B 1234 ABC",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "9876543210987654",
        name: "Jane Smith",
        address: "Jl. Sudirman No. 10, Bandung",
        birthInfo: "Bandung, 1985-05-15",
        nationality: "American",
        phoneNumber: "082345678901",
        organization: "XYZ Corporation",
        visitingPurpose: "Client Visit",
        placeDestination: "Conference Room",
        vehicleNumber: "D 5678 XYZ",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "5678901234567890",
        name: "Michael Johnson",
        address: "Jl. Thamrin No. 5, Surabaya",
        birthInfo: "Surabaya, 1992-11-22",
        nationality: "British",
        phoneNumber: "083456789012",
        organization: "Tech Solutions Inc.",
        visitingPurpose: "Technical Support",
        placeDestination: "IT Department",
        vehicleNumber: "L 9012 TSI",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "1122334455667788",
        name: "Sarah Williams",
        address: "Jl. Gatot Subroto No. 25, Medan",
        birthInfo: "Medan, 1988-03-10",
        nationality: "Australian",
        phoneNumber: "084567890123",
        organization: "Global Services Ltd.",
        visitingPurpose: "Audit",
        placeDestination: "Finance Department",
        vehicleNumber: "BK 3456 GSL",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "9988776655443322",
        name: "David Chen",
        address: "Jl. Asia Afrika No. 8, Makassar",
        birthInfo: "Makassar, 1995-07-25",
        nationality: "Chinese",
        phoneNumber: "085678901234",
        organization: "Innovation Hub",
        visitingPurpose: "Partnership Discussion",
        placeDestination: "Executive Floor",
        vehicleNumber: "DD 7890 IH",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "4455667788990011",
        name: "Emma Rodriguez",
        address: "Jl. Diponegoro No. 15, Yogyakarta",
        birthInfo: "Yogyakarta, 1993-12-02",
        nationality: "Spanish",
        phoneNumber: "086789012345",
        organization: "Creative Studio",
        visitingPurpose: "Project Presentation",
        placeDestination: "Design Studio",
        vehicleNumber: "AB 2345 CS",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "3322110099887766",
        name: "Ahmad Fauzi",
        address: "Jl. Veteran No. 3, Semarang",
        birthInfo: "Semarang, 1987-09-18",
        nationality: "Indonesian",
        phoneNumber: "087890123456",
        organization: "Local Government",
        visitingPurpose: "Official Visit",
        placeDestination: "Government Office",
        vehicleNumber: "H 6789 LG",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "7766554433221100",
        name: "Lisa Anderson",
        address: "Jl. Pattimura No. 12, Denpasar",
        birthInfo: "Denpasar, 1991-04-30",
        nationality: "Canadian",
        phoneNumber: "088901234567",
        organization: "Tourism Board",
        visitingPurpose: "Inspection",
        placeDestination: "Tourist Information Center",
        vehicleNumber: "DK 1234 TB",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "2233445566778899",
        name: "Rizki Pratama",
        address: "Jl. Jendral Soedirman No. 7, Palembang",
        birthInfo: "Palembang, 1989-11-07",
        nationality: "Indonesian",
        phoneNumber: "089012345678",
        organization: "University",
        visitingPurpose: "Academic Conference",
        placeDestination: "Auditorium",
        vehicleNumber: "BG 5678 UNV",
      },
    }),
    prisma.visitor.create({
      data: {
        nik: "8899001122334455",
        name: "Olivia Parker",
        address: "Jl. Ahmad Yani No. 18, Manado",
        birthInfo: "Manado, 1994-06-14",
        nationality: "New Zealander",
        phoneNumber: "081122334455",
        organization: "Environmental Group",
        visitingPurpose: "Research",
        placeDestination: "Research Lab",
        vehicleNumber: "S 9012 EG",
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

  // Create RFID tag locations
  await Promise.all([
    prisma.rfidTagLocation.create({
      data: {
        rfidTagId: "RFID001",
        locationId: locations[0].id, // Main Gate
      },
    }),
    prisma.rfidTagLocation.create({
      data: {
        rfidTagId: "RFID002",
        locationId: locations[0].id, // Main Gate
      },
    }),
  ]);

  // Create dummy log visitors
  const logVisitors = await Promise.all([
    prisma.logVisitor.create({
      data: {
        rfidTagId: "RFID001",
        nik: "1234567890123456",
        date: new Date("2025-12-01T08:30:00"),
        visitType: "IN",
        locationId: locations[0].id, // Main Gate
      },
    }),
    prisma.logVisitor.create({
      data: {
        rfidTagId: "RFID002",
        nik: "9876543210987654",
        date: new Date("2025-12-01T09:15:00"),
        visitType: "IN",
        locationId: locations[0].id, // Main Gate
      },
    }),
    prisma.logVisitor.create({
      data: {
        rfidTagId: "RFID001",
        nik: "1234567890123456",
        date: new Date("2025-12-01T17:45:00"),
        visitType: "OUT",
        locationId: locations[0].id, // Main Gate
      },
    }),
    prisma.logVisitor.create({
      data: {
        rfidTagId: "RFID003",
        nik: "5678901234567890",
        date: new Date("2025-12-02T10:20:00"),
        visitType: "IN",
        locationId: locations[0].id, // Main Gate
      },
    }),
  ]);

  console.log(
    `total users created: ${users.length}\ntotal locations created: ${locations.length}\ntotal visitors created: ${visitors.length}\ntotal rfidTag created: ${rfidTags.length}\ntotal log visitor created: ${logVisitors.length}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
