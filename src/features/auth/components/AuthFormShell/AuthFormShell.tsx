"use client";

import type { ReactNode } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type AuthFormShellProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  serverError: string | null;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  children: ReactNode;
  footer?: ReactNode;
};

// Coquille commune aux formulaires d'auth : erreur serveur, champs, bouton, pied.
export function AuthFormShell<T extends FieldValues>({
  form,
  onSubmit,
  serverError,
  isPending,
  submitLabel,
  pendingLabel,
  children,
  footer,
}: AuthFormShellProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        noValidate
      >
        {serverError ? (
          <p role="alert" className="text-destructive text-sm">
            {serverError}
          </p>
        ) : null}

        {children}

        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>

        {footer}
      </form>
    </Form>
  );
}
