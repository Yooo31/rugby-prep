import { describe, expect, it } from "vitest";

import {
  loginSchema,
  resetRequestSchema,
  signupSchema,
  updatePasswordSchema,
} from "./auth.schema";

describe("loginSchema", () => {
  it("accepte un email et un mot de passe valides", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "x" }).success,
    ).toBe(true);
  });

  it("rejette un email invalide", () => {
    const r = loginSchema.safeParse({ email: "nope", password: "x" });
    expect(r.success).toBe(false);
  });

  it("rejette un mot de passe vide", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("accepte un signup valide", () => {
    expect(
      signupSchema.safeParse({
        email: "a@b.com",
        password: "password1",
        confirmPassword: "password1",
      }).success,
    ).toBe(true);
  });

  it("rejette un mot de passe trop court", () => {
    const r = signupSchema.safeParse({
      email: "a@b.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(r.success).toBe(false);
  });

  it("rejette des mots de passe différents (refine)", () => {
    const r = signupSchema.safeParse({
      email: "a@b.com",
      password: "password1",
      confirmPassword: "password2",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.path).toContain("confirmPassword");
    }
  });
});

describe("resetRequestSchema", () => {
  it("accepte un email valide", () => {
    expect(resetRequestSchema.safeParse({ email: "a@b.com" }).success).toBe(
      true,
    );
  });

  it("rejette un email invalide", () => {
    expect(resetRequestSchema.safeParse({ email: "x" }).success).toBe(false);
  });
});

describe("updatePasswordSchema", () => {
  it("accepte des mots de passe identiques et longs", () => {
    expect(
      updatePasswordSchema.safeParse({
        password: "password1",
        confirmPassword: "password1",
      }).success,
    ).toBe(true);
  });

  it("rejette des mots de passe différents", () => {
    expect(
      updatePasswordSchema.safeParse({
        password: "password1",
        confirmPassword: "nope12345",
      }).success,
    ).toBe(false);
  });
});
