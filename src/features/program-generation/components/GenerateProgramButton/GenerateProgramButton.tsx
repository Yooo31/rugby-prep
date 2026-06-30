"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { generateProgram } from "@/features/program-generation/server/generateProgram";

export function GenerateProgramButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await generateProgram();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="grid gap-2">
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      <Button onClick={onClick} disabled={isPending}>
        {isPending ? "Génération…" : "Générer mon programme"}
      </Button>
    </div>
  );
}
