"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  resetRequestSchema,
  signupSchema,
  updatePasswordSchema,
  type LoginInput,
  type ResetRequestInput,
  type SignupInput,
  type UpdatePasswordInput,
} from "@/features/auth/schemas/auth.schema";

export type FieldErrors = Record<string, string[] | undefined>;

export type ActionState = {
  error?: string;
  fieldErrors?: FieldErrors;
  success?: string;
};

function siteUrl(): string {
  return process.env["NEXT_PUBLIC_SITE_URL"] ?? "http://localhost:3000";
}

export async function login(input: LoginInput): Promise<ActionState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(input: SignupInput): Promise<ActionState> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${siteUrl()}/auth/confirm` },
  });
  if (error) {
    return { error: "Impossible de créer le compte. Réessaie plus tard." };
  }

  redirect("/signup/check-email");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function requestPasswordReset(
  input: ResetRequestInput,
): Promise<ActionState> {
  const parsed = resetRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${siteUrl()}/auth/confirm?next=/update-password` },
  );
  if (error) {
    return { error: "Impossible d'envoyer l'email. Réessaie plus tard." };
  }

  return {
    success:
      "Si un compte existe pour cette adresse, un email de réinitialisation a été envoyé.",
  };
}

export async function updatePassword(
  input: UpdatePasswordInput,
): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: "Impossible de mettre à jour le mot de passe." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
