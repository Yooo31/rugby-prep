import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createProfile } from "./createProfile";

const mocks = vi.hoisted(() => ({
  getAuthUser: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/features/auth", () => ({ getAuthUser: mocks.getAuthUser }));
vi.mock("@/lib/db", () => ({
  prisma: { profile: { create: mocks.create } },
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const validInput = {
  firstName: "Yoan",
  position: "PILIER",
  goal: "MUSCULATION",
  sessionsPerWeek: "3",
  sessionDuration: "60",
  environment: "MAISON",
  season: "INTER_SAISON",
  trainingDays: ["LUNDI"],
  matchDay: "DIMANCHE",
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getAuthUser.mockResolvedValue({ id: "user-1" });
  mocks.create.mockResolvedValue({ id: "user-1" });
});

describe("createProfile", () => {
  it("renvoie des erreurs de champ si invalide", async () => {
    const state = await createProfile({ firstName: "" });
    expect(state.fieldErrors).toBeDefined();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("ignore un id fourni par le client et scope sur getAuthUser().id", async () => {
    await createProfile({ ...validInput, id: "attacker-id" });

    expect(mocks.create).toHaveBeenCalledTimes(1);
    const arg = mocks.create.mock.calls[0]![0];
    expect(arg.data.id).toBe("user-1");
    expect(arg.data.id).not.toBe("attacker-id");
  });

  it("convertit les champs numériques et redirige au succès", async () => {
    await createProfile(validInput);

    const arg = mocks.create.mock.calls[0]![0];
    expect(arg.data.sessionsPerWeek).toBe(3);
    expect(arg.data.sessionDuration).toBe(60);
    expect(arg.data.trainingDays).toEqual(["LUNDI"]);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("met matchDay à null si absent", async () => {
    const { matchDay: _m, ...rest } = validInput;
    void _m;
    await createProfile(rest);
    expect(mocks.create.mock.calls[0]![0].data.matchDay).toBeNull();
  });

  it("renvoie une erreur si la création échoue", async () => {
    mocks.create.mockRejectedValue(new Error("db down"));
    const state = await createProfile(validInput);
    expect(state.error).toBeTruthy();
    expect(redirect).not.toHaveBeenCalled();
  });
});
