import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OBJECTIF_LABELS, POSTE_LABELS } from "@/features/profiles";
import type { Objectif, Poste } from "@/generated/prisma/enums";

type PlayerSummaryProps = {
  firstName: string;
  position: Poste;
  goal: Objectif;
};

export function PlayerSummary({
  firstName,
  position,
  goal,
}: PlayerSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{firstName}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1 text-sm">
        <p>
          <span className="text-muted-foreground">Poste : </span>
          {POSTE_LABELS[position]}
        </p>
        <p>
          <span className="text-muted-foreground">Objectif : </span>
          {OBJECTIF_LABELS[goal]}
        </p>
      </CardContent>
    </Card>
  );
}
