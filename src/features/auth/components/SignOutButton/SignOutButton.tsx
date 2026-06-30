"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/server/actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => signOut())}
    >
      {isPending ? "Déconnexion…" : "Se déconnecter"}
    </Button>
  );
}
