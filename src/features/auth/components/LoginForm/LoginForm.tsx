"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthFormShell } from "@/features/auth/components/AuthFormShell";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { useAuthSubmit } from "@/features/auth/hooks/useAuthSubmit";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/auth.schema";
import { login } from "@/features/auth/server/actions";

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { isPending, serverError, run } = useAuthSubmit(login);

  return (
    <AuthFormShell
      form={form}
      onSubmit={run}
      serverError={serverError}
      isPending={isPending}
      submitLabel="Se connecter"
      pendingLabel="Connexion…"
      footer={
        <div className="text-muted-foreground grid gap-1 text-sm">
          <Link href="/forgot-password" className="underline">
            Mot de passe oublié ?
          </Link>
          <span>
            Pas de compte ?{" "}
            <Link href="/signup" className="underline">
              Créer un compte
            </Link>
          </span>
        </div>
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
        autoComplete="current-password"
      />
    </AuthFormShell>
  );
}
