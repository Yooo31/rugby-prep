import { OBJECTIF_LABELS } from "@/features/profiles";
import type {
  Environnement,
  Objectif,
  Poste,
  Saison,
} from "@/generated/prisma/enums";

import type {
  ProgramExercise,
  ProgramPlan,
} from "../schemas/programPlan.schema";

// Entrées de génération dérivées du profil (alimenteront le prompt ChatGPT).
export type GenerationInput = {
  objective: Objectif;
  sessionsPerWeek: number;
  sessionDuration: number;
  position: Poste;
  environment: Environnement;
  season: Saison;
};

function buildExercises(input: GenerationInput): ProgramExercise[] {
  const atHome = input.environment === "MAISON";
  return [
    {
      name: atHome ? "Pompes" : "Développé couché",
      description: "Travail du haut du corps, amplitude complète et contrôlée.",
      sets: 4,
      reps: "8-12",
      restSeconds: 90,
    },
    {
      name: atHome ? "Squats au poids du corps" : "Squat barre",
      description: "Travail des membres inférieurs, dos gainé.",
      sets: 4,
      reps: atHome ? "15-20" : "8-10",
      restSeconds: 90,
    },
    {
      name: "Gainage",
      description: "Maintien de la position, abdominaux et lombaires engagés.",
      sets: 3,
      reps: "45s",
      restSeconds: 60,
    },
  ];
}

// Mock du générateur. Remplacé plus tard par l'appel ChatGPT (même signature) :
// construction d'un prompt depuis `input` → fetch → JSON. Le reste du flux
// (validation Zod + persistance) ne change pas.
export async function generateProgramPlan(
  input: GenerationInput,
): Promise<ProgramPlan> {
  const objectiveLabel = OBJECTIF_LABELS[input.objective];

  const sessions = Array.from(
    { length: input.sessionsPerWeek },
    (_, index) => ({
      name: `Séance ${index + 1}`,
      objective: objectiveLabel,
      durationMin: input.sessionDuration,
      exercises: buildExercises(input),
    }),
  );

  return { sessions };
}
