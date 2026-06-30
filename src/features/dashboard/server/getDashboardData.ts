import { getAuthUser } from "@/features/auth";
import type { DashboardData } from "@/features/dashboard/types";
import { prisma } from "@/lib/db";

// Données du tableau de bord (spec §5) de l'utilisateur authentifié.
// Scopé par user.id (cf. CLAUDE.md TIER 1). Une seule requête (include imbriqué)
// = pas de N+1 sur les séances.
export async function getDashboardData(): Promise<DashboardData | null> {
  const user = await getAuthUser();

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      weeks: {
        orderBy: { weekNumber: "desc" },
        take: 1,
        include: { sessions: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!profile) {
    return null;
  }

  const week = profile.weeks[0] ?? null;

  return {
    firstName: profile.firstName,
    position: profile.position,
    goal: profile.goal,
    week: week
      ? {
          weekNumber: week.weekNumber,
          sessionCount: week.sessions.length,
          sessions: week.sessions.map((session) => ({
            id: session.id,
            name: session.name,
            status: session.status,
          })),
        }
      : null,
  };
}
