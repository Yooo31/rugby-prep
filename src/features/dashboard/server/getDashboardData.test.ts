import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDashboardData } from "./getDashboardData";

const mocks = vi.hoisted(() => ({
  getAuthUser: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("@/features/auth", () => ({ getAuthUser: mocks.getAuthUser }));
vi.mock("@/lib/db", () => ({
  prisma: { profile: { findUnique: mocks.findUnique } },
}));

const baseProfile = {
  firstName: "Yoan",
  position: "PILIER",
  goal: "MUSCULATION",
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getAuthUser.mockResolvedValue({ id: "user-1" });
});

describe("getDashboardData", () => {
  it("scope la requête sur user.id et renvoie la semaine courante", async () => {
    mocks.findUnique.mockResolvedValue({
      ...baseProfile,
      weeks: [
        {
          weekNumber: 3,
          sessions: [
            { id: "s1", name: "Séance 1", status: "TERMINEE" },
            { id: "s2", name: "Séance 2", status: "A_FAIRE" },
          ],
        },
      ],
    });

    const data = await getDashboardData();

    // Scoping strict : where.id === id de getAuthUser (jamais d'id client).
    expect(mocks.findUnique).toHaveBeenCalledTimes(1);
    expect(mocks.findUnique.mock.calls[0]![0].where).toEqual({ id: "user-1" });

    expect(data).toMatchObject({
      firstName: "Yoan",
      position: "PILIER",
      goal: "MUSCULATION",
      week: { weekNumber: 3, sessionCount: 2 },
    });
    expect(data?.week?.sessions).toHaveLength(2);
  });

  it("renvoie week: null quand aucune Week", async () => {
    mocks.findUnique.mockResolvedValue({ ...baseProfile, weeks: [] });
    const data = await getDashboardData();
    expect(data?.week).toBeNull();
  });

  it("renvoie null si le profil n'existe pas", async () => {
    mocks.findUnique.mockResolvedValue(null);
    expect(await getDashboardData()).toBeNull();
  });
});
