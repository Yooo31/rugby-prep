"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuthUser } from "@/features/auth";
import { profileSchema } from "@/features/profiles/schemas/profile.schema";
import { prisma } from "@/lib/db";

export type FieldErrors = Record<string, string[] | undefined>;

export type ProfileActionState = {
  error?: string;
  fieldErrors?: FieldErrors;
};

// Crée le profil de l'utilisateur authentifié. L'`id` provient TOUJOURS de
// getAuthUser(), jamais de l'input (un id fourni par le client est ignoré).
export async function createProfile(
  input: unknown,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const user = await getAuthUser();
  const data = parsed.data;

  try {
    await prisma.profile.create({
      data: {
        id: user.id,
        firstName: data.firstName,
        position: data.position,
        goal: data.goal,
        sessionsPerWeek: Number(data.sessionsPerWeek),
        sessionDuration: Number(data.sessionDuration),
        environment: data.environment,
        season: data.season,
        trainingDays: data.trainingDays,
        matchDay: data.matchDay ?? null,
      },
    });
  } catch {
    return { error: "Impossible d'enregistrer le profil. Réessaie." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
