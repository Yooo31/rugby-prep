import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  login,
  requestPasswordReset,
  signOut,
  signup,
  updatePassword,
} from "./actions";

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: mocks })),
}));

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.signInWithPassword.mockResolvedValue({ error: null });
  mocks.signUp.mockResolvedValue({ error: null });
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
  mocks.updateUser.mockResolvedValue({ error: null });
});

describe("login", () => {
  it("renvoie des erreurs de champ si invalide", async () => {
    const state = await login({ email: "x", password: "" });
    expect(state.fieldErrors).toBeDefined();
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
  });

  it("renvoie une erreur si Supabase échoue", async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: { message: "bad" } });
    const state = await login({ email: "a@b.com", password: "x" });
    expect(state.error).toBeTruthy();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("revalide et redirige vers / au succès", async () => {
    await login({ email: "a@b.com", password: "secret" });
    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "secret",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/");
  });
});

describe("signup", () => {
  it("renvoie des erreurs de champ si invalide", async () => {
    const state = await signup({
      email: "a@b.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(state.fieldErrors).toBeDefined();
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it("renvoie une erreur si Supabase échoue", async () => {
    mocks.signUp.mockResolvedValue({ error: { message: "exists" } });
    const state = await signup({
      email: "a@b.com",
      password: "password1",
      confirmPassword: "password1",
    });
    expect(state.error).toBeTruthy();
  });

  it("redirige vers /signup/check-email au succès", async () => {
    await signup({
      email: "a@b.com",
      password: "password1",
      confirmPassword: "password1",
    });
    expect(mocks.signUp).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/signup/check-email");
  });
});

describe("signOut", () => {
  it("déconnecte et redirige vers /login", async () => {
    await signOut();
    expect(mocks.signOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});

describe("requestPasswordReset", () => {
  it("renvoie des erreurs de champ si invalide", async () => {
    const state = await requestPasswordReset({ email: "x" });
    expect(state.fieldErrors).toBeDefined();
  });

  it("renvoie une erreur si Supabase échoue", async () => {
    mocks.resetPasswordForEmail.mockResolvedValue({ error: { message: "x" } });
    const state = await requestPasswordReset({ email: "a@b.com" });
    expect(state.error).toBeTruthy();
  });

  it("renvoie un message de succès", async () => {
    const state = await requestPasswordReset({ email: "a@b.com" });
    expect(state.success).toBeTruthy();
    expect(mocks.resetPasswordForEmail).toHaveBeenCalled();
  });
});

describe("updatePassword", () => {
  it("renvoie des erreurs de champ si invalide", async () => {
    const state = await updatePassword({
      password: "short",
      confirmPassword: "short",
    });
    expect(state.fieldErrors).toBeDefined();
  });

  it("renvoie une erreur si Supabase échoue", async () => {
    mocks.updateUser.mockResolvedValue({ error: { message: "x" } });
    const state = await updatePassword({
      password: "password1",
      confirmPassword: "password1",
    });
    expect(state.error).toBeTruthy();
  });

  it("met à jour et redirige vers / au succès", async () => {
    await updatePassword({
      password: "password1",
      confirmPassword: "password1",
    });
    expect(mocks.updateUser).toHaveBeenCalledWith({ password: "password1" });
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
