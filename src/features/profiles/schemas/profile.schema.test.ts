import { describe, expect, it } from "vitest";

import { profileSchema } from "./profile.schema";

const valid = {
  firstName: "Yoan",
  position: "PILIER",
  goal: "MUSCULATION",
  sessionsPerWeek: "3",
  sessionDuration: "60",
  environment: "MAISON",
  season: "INTER_SAISON",
  trainingDays: ["LUNDI", "MERCREDI"],
  matchDay: "DIMANCHE",
};

describe("profileSchema", () => {
  it("accepte un profil complet valide", () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it("accepte un matchDay absent et des trainingDays vides", () => {
    const { matchDay: _m, ...rest } = valid;
    void _m;
    expect(profileSchema.safeParse({ ...rest, trainingDays: [] }).success).toBe(
      true,
    );
  });

  it("rejette un prénom vide", () => {
    expect(profileSchema.safeParse({ ...valid, firstName: "" }).success).toBe(
      false,
    );
  });

  it("rejette un poste invalide", () => {
    expect(
      profileSchema.safeParse({ ...valid, position: "GARDIEN" }).success,
    ).toBe(false);
  });

  it("rejette sessionsPerWeek hors bornes", () => {
    expect(
      profileSchema.safeParse({ ...valid, sessionsPerWeek: "0" }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({ ...valid, sessionsPerWeek: "6" }).success,
    ).toBe(false);
  });

  it("rejette une durée non autorisée", () => {
    expect(
      profileSchema.safeParse({ ...valid, sessionDuration: "40" }).success,
    ).toBe(false);
  });

  it("rejette un jour d'entraînement invalide", () => {
    expect(
      profileSchema.safeParse({ ...valid, trainingDays: ["FUNDAY"] }).success,
    ).toBe(false);
  });
});
