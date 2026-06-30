"use client";

import { useState, useTransition } from "react";

import type { ActionState } from "@/features/auth/server/actions";

export type UseAuthSubmitResult<T> = {
  isPending: boolean;
  serverError: string | null;
  success: string | null;
  run: (values: T) => void;
};

// Mutualise la soumission des formulaires d'auth : transition (pending),
// erreur serveur et message de succès renvoyés par une Server Action.
export function useAuthSubmit<T>(
  action: (input: T) => Promise<ActionState | void>,
): UseAuthSubmitResult<T> {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function run(values: T) {
    setServerError(null);
    startTransition(async () => {
      const result = await action(values);
      if (result?.error) setServerError(result.error);
      else if (result?.success) setSuccess(result.success);
    });
  }

  return { isPending, serverError, success, run };
}
