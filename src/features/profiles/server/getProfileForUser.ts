import { getAuthUser } from "@/features/auth";
import type { Profile } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

// Récupère le profil de l'utilisateur authentifié, scopé par son id
// (cf. CLAUDE.md TIER 1). Renvoie null si l'onboarding n'est pas fait.
export async function getProfileForUser(): Promise<Profile | null> {
  const user = await getAuthUser();
  return prisma.profile.findUnique({ where: { id: user.id } });
}
