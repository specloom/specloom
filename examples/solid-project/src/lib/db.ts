import { PrismaClient } from "~/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrisma() {
  const adapter = new PrismaLibSql({
    url: "file:prisma/dev.db",
  });
  return new PrismaClient({ adapter });
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createPrisma();
} else {
  const g = globalThis as unknown as { __prisma?: PrismaClient };
  if (!g.__prisma) {
    g.__prisma = createPrisma();
  }
  prisma = g.__prisma;
}

export { prisma };
