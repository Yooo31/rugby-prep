import { describe, expect, it } from "vitest";

import { programPlanSchema } from "../schemas/programPlan.schema";
import {
  generateProgramPlan,
  type GenerationInput,
} from "./generateProgramPlan";

const baseInput: GenerationInput = {
  objective: "MUSCULATION",
  sessionsPerWeek: 3,
  sessionDuration: 60,
  position: "PILIER",
  environment: "MAISON",
  season: "INTER_SAISON",
};

describe("generateProgramPlan (mock)", () => {
  it("respecte le nombre de séances, la durée et l'objectif", async () => {
    const plan = await generateProgramPlan(baseInput);

    expect(plan.sessions).toHaveLength(3);
    expect(plan.sessions.every((s) => s.durationMin === 60)).toBe(true);
    expect(plan.sessions.every((s) => s.objective === "Musculation")).toBe(
      true,
    );
    expect(plan.sessions.every((s) => s.exercises.length > 0)).toBe(true);
  });

  it("produit une sortie conforme au contrat Zod", async () => {
    const plan = await generateProgramPlan(baseInput);
    expect(programPlanSchema.safeParse(plan).success).toBe(true);
  });

  it("adapte les exercices à l'environnement salle", async () => {
    const plan = await generateProgramPlan({
      ...baseInput,
      environment: "SALLE_COMPLETE",
    });
    const names = plan.sessions[0]!.exercises.map((e) => e.name);
    expect(names).toContain("Développé couché");
  });

  it("est déterministe", async () => {
    const a = await generateProgramPlan(baseInput);
    const b = await generateProgramPlan(baseInput);
    expect(a).toEqual(b);
  });
});
