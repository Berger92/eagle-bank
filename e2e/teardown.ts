import { PrismaClient } from "@prisma/client";

export default async () => {
  const prisma = new PrismaClient();

  await prisma.$disconnect(); // Close connection pool

  console.log("🔻 Prisma disconnected, teardown complete.");
};
