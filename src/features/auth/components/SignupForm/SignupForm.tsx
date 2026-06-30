"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthFormShell } from "@/features/auth/components/AuthFormShell";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { useAuthSubmit } from "@/features/auth/hooks/useAuthSubmit";
import {
  signupSchema,
  type SignupInput,
} from "@/features/auth/schemas/auth.schema";
import { signup } from "@/features/auth/server/actions";

export function SignupForm() {
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const { isPending, serverError, run } = useAuthSubmit(signup);

  return (
    <AuthFormShell
      form={form}
      onSubmit={run}
      serverError={serverError}
      isPending={isPending}
      submitLabel="Créer mon compte"
      pendingLabel="Création…"
      footer={
        <p className="text-muted-foreground text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </p>
      }
    >
      <AuthTextField
        control={form.control}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <AuthTextField
        control={form.control}
        name="password"
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
      />
      <AuthTextField
        control={form.control}
        name="confirmPassword"
        label="Confirmer le mot de passe"
        type="password"
        autoComplete="new-password"
      />
    </AuthFormShell>
  );
}
