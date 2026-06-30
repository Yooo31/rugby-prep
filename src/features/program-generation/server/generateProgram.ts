"use server";

import { revalidatePath } from "next/cache";

import { getAuthUser } from "@/features/auth";
import { prisma } from "@/lib/db";

import { programPlanSchema } from "../schemas/programPlan.schema";
import {
  generateProgramPlan,
  type GenerationInput,
} from "./generateProgramPlan";

export type GenerateProgramState = {
  error?: string;
};

// Génère et persiste la semaine de l'utilisateur authentifié.
// Scopé par user.id (cf. CLAUDE.md TIER 1). La sortie du générateur est revalidée
// (Zod) avant persistance.
export async function generateProgram(): Promise<GenerateProgramState> {
  const user = await getAuthUser();

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });
  if (!profile) {
    return { error: "Profil introuvable." };
  }

  const input: GenerationInput = {
    objective: profile.goal,
    sessionsPerWeek: profile.sessionsPerWeek,
    sessionDuration: profile.sessionDuration,
    position: profile.position,
    environment: profile.environment,
    season: profile.season,
  };

  const plan = await generateProgramPlan(input);
  const parsed = programPlanSchema.safeParse(plan);
  if (!parsed.success) {
    return { error: "Programme généré invalide, réessaie." };
  }

  const last = await prisma.week.findFirst({
    where: { profileId: user.id },
    orderBy: { weekNumber: "desc" },
    select: { weekNumber: true },
  });
  const weekNumber = (last?.weekNumber ?? 0) + 1;

  try {
    await prisma.week.create({
      data: {
        profileId: user.id,
        weekNumber,
        generatedPayload: parsed.data,
        sessions: {
          create: parsed.data.sessions.map((session, sessionIndex) => ({
            name: session.name,
            objective: session.objective,
            durationMin: session.durationMin,
            order: sessionIndex,
            exercises: {
              create: session.exercises.map((exercise, exerciseIndex) => ({
                name: exercise.name,
                description: exercise.description,
                sets: exercise.sets,
                reps: exercise.reps,
                restSeconds: exercise.restSeconds,
                order: exerciseIndex,
              })),
            },
          })),
        },
      },
    });
  } catch {
    return { error: "Impossible d'enregistrer le programme." };
  }

  revalidatePath("/", "layout");
  return {};
}
