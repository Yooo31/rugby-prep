import { z } from "zod";

import {
  Environnement,
  Jour,
  Objectif,
  Poste,
  Saison,
} from "@/generated/prisma/enums";

// Bornes spec §4. Les champs numériques sont des enums de chaînes (selects),
// convertis en Int dans createProfile.
export const SESSIONS_PER_WEEK = ["1", "2", "3", "4", "5"] as const;
export const SESSION_DURATIONS = ["30", "45", "60", "90"] as const;

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(50),
  position: z.enum(Poste, { error: "Poste requis" }),
  goal: z.enum(Objectif, { error: "Objectif requis" }),
  sessionsPerWeek: z.enum(SESSIONS_PER_WEEK, { error: "Choix requis" }),
  sessionDuration: z.enum(SESSION_DURATIONS, { error: "Choix requis" }),
  environment: z.enum(Environnement, { error: "Environnement requis" }),
  season: z.enum(Saison, { error: "Saison requise" }),
  trainingDays: z.array(z.enum(Jour)),
  matchDay: z.enum(Jour).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
