import type { Objectif, Poste, SessionStatus } from "@/generated/prisma/enums";

export type DashboardSession = {
  id: string;
  name: string;
  status: SessionStatus;
};

export type DashboardWeek = {
  weekNumber: number;
  sessionCount: number;
  sessions: DashboardSession[];
};

export type DashboardData = {
  firstName: string;
  position: Poste;
  goal: Objectif;
  week: DashboardWeek | null;
};
