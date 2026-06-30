import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAuthUser } from "./getAuthUser";

const mocks = vi.hoisted(() => ({ getUser: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { getUser: mocks.getUser } })),
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAuthUser", () => {
  it("renvoie l'utilisateur authentifié", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const user = await getAuthUser();
    expect(user.id).toBe("user-1");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirige vers /login si non authentifié", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    await getAuthUser();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
