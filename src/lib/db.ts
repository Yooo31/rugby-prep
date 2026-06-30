import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

// Client Prisma en singleton : évite l'épuisement de connexions en dev
// (hot-reload Next.js recrée les modules). Voir CLAUDE.md §Prisma + Supabase.
//
// Prisma 7 : connexion via driver adapter. L'app utilise le pooler Supabase
// (DATABASE_URL) ; les migrations utilisent la connexion directe (DIRECT_URL,
// configurée dans prisma.config.ts).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
