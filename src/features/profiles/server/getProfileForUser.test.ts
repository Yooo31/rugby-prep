import { beforeEach, describe, expect, it, vi } from "vitest";

import { getProfileForUser } from "./getProfileForUser";

const mocks = vi.hoisted(() => ({
  getAuthUser: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("@/features/auth", () => ({ getAuthUser: mocks.getAuthUser }));
vi.mock("@/lib/db", () => ({
  prisma: { profile: { findUnique: mocks.findUnique } },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getAuthUser.mockResolvedValue({ id: "user-1" });
});

describe("getProfileForUser", () => {
  it("interroge le profil scopé par l'id de l'utilisateur", async () => {
    mocks.findUnique.mockResolvedValue({ id: "user-1", firstName: "Yoan" });
    const profile = await getProfileForUser();

    expect(mocks.findUnique).toHaveBeenCalledWith({ where: { id: "user-1" } });
    expect(profile?.firstName).toBe("Yoan");
  });

  it("renvoie null si aucun profil", async () => {
    mocks.findUnique.mockResolvedValue(null);
    expect(await getProfileForUser()).toBeNull();
  });
});
