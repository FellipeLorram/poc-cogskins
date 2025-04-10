import { PrismaClient } from "@prisma/client";

const NODE_ENV = process.env.NODE_ENV;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (NODE_ENV !== "production") globalForPrisma.prisma = prisma;
