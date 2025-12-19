import { hash } from "bcrypt";

import { prisma } from "@/lib/prisma";

async function seedDatabase() {
  try {
    // Create a test user
    const hashedPassword = await hash("password123", 10); // Using a default password

    const existingUser = await prisma.user.findFirst({
      where: { username: "admin" },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          username: "admin",
          password: hashedPassword,
        },
      });
      console.log(`Created test user with ID: ${user.userId}`);
    } else {
      console.log("Test user already exists");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().catch(console.error);
