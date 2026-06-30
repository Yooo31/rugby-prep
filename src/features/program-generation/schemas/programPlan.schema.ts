import { z } from "zod";

// Contrat du JSON attendu du générateur (mock aujourd'hui, ChatGPT demain).
// La sortie est revalidée systématiquement : un LLM n'est pas une source fiable.
// Seul `programPlanSchema` est public ; les sous-schémas restent internes.

const programExerciseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  sets: z.number().int().positive(),
  reps: z.string().min(1),
  restSeconds: z.number().int().nonnegative(),
});

const programSessionSchema = z.object({
  name: z.string().min(1),
  objective: z.string().min(1),
  durationMin: z.number().int().positive(),
  exercises: z.array(programExerciseSchema).min(1),
});

export const programPlanSchema = z.object({
  sessions: z.array(programSessionSchema).min(1),
});

export type ProgramExercise = z.infer<typeof programExerciseSchema>;
export type ProgramPlan = z.infer<typeof programPlanSchema>;
