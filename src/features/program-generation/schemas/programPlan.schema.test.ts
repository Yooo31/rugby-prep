import { describe, expect, it } from "vitest";

import { programPlanSchema } from "./programPlan.schema";

const validExercise = {
  name: "Pompes",
  description: "Travail du haut du corps.",
  sets: 4,
  reps: "8-12",
  restSeconds: 90,
};

const validPlan = {
  sessions: [
    {
      name: "Séance 1",
      objective: "Musculation",
      durationMin: 60,
      exercises: [validExercise],
    },
  ],
};

describe("programPlanSchema", () => {
  it("accepte un plan valide", () => {
    expect(programPlanSchema.safeParse(validPlan).success).toBe(true);
  });

  it("rejette un plan sans séance", () => {
    expect(programPlanSchema.safeParse({ sessions: [] }).success).toBe(false);
  });

  it("rejette une séance sans exercice", () => {
    expect(
      programPlanSchema.safeParse({
        sessions: [{ ...validPlan.sessions[0], exercises: [] }],
      }).success,
    ).toBe(false);
  });

  it("rejette des séries non positives", () => {
    expect(
      programPlanSchema.safeParse({
        sessions: [
          {
            ...validPlan.sessions[0],
            exercises: [{ ...validExercise, sets: 0 }],
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejette un champ manquant", () => {
    expect(
      programPlanSchema.safeParse({
        sessions: [{ name: "S1", durationMin: 60, exercises: [validExercise] }],
      }).success,
    ).toBe(false);
  });

  it("rejette une durée du mauvais type", () => {
    expect(
      programPlanSchema.safeParse({
        sessions: [{ ...validPlan.sessions[0], durationMin: "60" }],
      }).success,
    ).toBe(false);
  });
});
