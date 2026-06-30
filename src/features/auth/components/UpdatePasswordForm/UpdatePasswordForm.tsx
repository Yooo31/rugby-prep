"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthFormShell } from "@/features/auth/components/AuthFormShell";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { useAuthSubmit } from "@/features/auth/hooks/useAuthSubmit";
import {
  updatePasswordSchema,
  type UpdatePasswordInput,
} from "@/features/auth/schemas/auth.schema";
import { updatePassword } from "@/features/auth/server/actions";

export function UpdatePasswordForm() {
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const { isPending, serverError, run } = useAuthSubmit(updatePassword);

  return (
    <AuthFormShell
      form={form}
      onSubmit={run}
      serverError={serverError}
      isPending={isPending}
      submitLabel="Mettre à jour"
      pendingLabel="Mise à jour…"
    >
      <AuthTextField
        control={form.control}
        name="password"
        label="Nouveau mot de passe"
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
