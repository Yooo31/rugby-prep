"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthFormShell } from "@/features/auth/components/AuthFormShell";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { useAuthSubmit } from "@/features/auth/hooks/useAuthSubmit";
import {
  resetRequestSchema,
  type ResetRequestInput,
} from "@/features/auth/schemas/auth.schema";
import { requestPasswordReset } from "@/features/auth/server/actions";

export function ForgotPasswordForm() {
  const form = useForm<ResetRequestInput>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: { email: "" },
  });
  const { isPending, serverError, success, run } =
    useAuthSubmit(requestPasswordReset);

  if (success) {
    return (
      <p role="status" className="text-sm">
        {success}
      </p>
    );
  }

  return (
    <AuthFormShell
      form={form}
      onSubmit={run}
      serverError={serverError}
      isPending={isPending}
      submitLabel="Envoyer le lien"
      pendingLabel="Envoi…"
      footer={
        <p className="text-muted-foreground text-sm">
          <Link href="/login" className="underline">
            Retour à la connexion
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
    </AuthFormShell>
  );
}
