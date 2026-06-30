import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 : la connexion runtime passe par un driver adapter (voir src/lib/db.ts,
// qui utilise le pooler DATABASE_URL). Ici, `datasource.url` ne sert qu'à la CLI
// Prisma (migrations) et doit pointer vers la connexion DIRECTE (DIRECT_URL).
// Voir CLAUDE.md §Prisma + Supabase et `.env.example`.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
