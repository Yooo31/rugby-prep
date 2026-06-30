import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateProgram } from "./generateProgram";

const mocks = vi.hoisted(() => ({
  getAuthUser: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  generate: vi.fn(),
}));

vi.mock("@/features/auth", () => ({ getAuthUser: mocks.getAuthUser }));
vi.mock("@/lib/db", () => ({
  prisma: {
    profile: { findUnique: mocks.findUnique },
    week: { findFirst: mocks.findFirst, create: mocks.create },
  },
}));
vi.mock("./generateProgramPlan", () => ({
  generateProgramPlan: mocks.generate,
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const profile = {
  id: "user-1",
  goal: "MUSCULATION",
  sessionsPerWeek: 2,
  sessionDuration: 60,
  position: "PILIER",
  environment: "MAISON",
  season: "INTER_SAISON",
};

const validPlan = {
  sessions: [
    {
      name: "Séance 1",
      objective: "Musculation",
      durationMin: 60,
      exercises: [
        {
          name: "Pompes",
          description: "x",
          sets: 4,
          reps: "8-12",
          restSeconds: 90,
        },
      ],
    },
    {
      name: "Séance 2",
      objective: "Musculation",
      durationMin: 60,
      exercises: [
        {
          name: "Squats",
          description: "y",
          sets: 3,
          reps: "15",
          restSeconds: 60,
        },
      ],
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getAuthUser.mockResolvedValue({ id: "user-1" });
  mocks.findUnique.mockResolvedValue(profile);
  mocks.findFirst.mockResolvedValue(null);
  mocks.create.mockResolvedValue({ id: "week-1" });
  mocks.generate.mockResolvedValue(validPlan);
});

describe("generateProgram", () => {
  it("scope sur user.id, crée la semaine 1 et persiste les séances", async () => {
    const result = await generateProgram();

    expect(mocks.findUnique.mock.calls[0]![0].where).toEqual({ id: "user-1" });
    expect(mocks.create).toHaveBeenCalledTimes(1);
    const data = mocks.create.mock.calls[0]![0].data;
    expect(data.profileId).toBe("user-1");
    expect(data.weekNumber).toBe(1);
    expect(data.sessions.create).toHaveLength(2);
    expect(data.sessions.create[0].exercises.create).toHaveLength(1);
    expect(data.sessions.create[0].order).toBe(0);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(result).toEqual({});
  });

  it("incrémente le weekNumber", async () => {
    mocks.findFirst.mockResolvedValue({ weekNumber: 3 });
    await generateProgram();
    expect(mocks.create.mock.calls[0]![0].data.weekNumber).toBe(4);
  });

  it("renvoie une erreur si le profil est introuvable", async () => {
    mocks.findUnique.mockResolvedValue(null);
    const result = await generateProgram();
    expect(result.error).toBeTruthy();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rejette un plan généré invalide", async () => {
    mocks.generate.mockResolvedValue({ sessions: [] });
    const result = await generateProgram();
    expect(result.error).toBeTruthy();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("renvoie une erreur si la persistance échoue", async () => {
    mocks.create.mockRejectedValue(new Error("db down"));
    const result = await generateProgram();
    expect(result.error).toBeTruthy();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
