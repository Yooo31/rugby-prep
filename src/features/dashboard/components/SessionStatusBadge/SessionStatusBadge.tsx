import { Badge } from "@/components/ui/badge";
import type { SessionStatus } from "@/generated/prisma/enums";

const STATUS_LABELS: Record<SessionStatus, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};

// Variantes = tokens du design system (aucune couleur en dur).
// docs/design-system.md : À faire = neutre, En cours = accent lime, Terminée = primary vert.
const STATUS_VARIANTS: Record<
  SessionStatus,
  "secondary" | "accent" | "default"
> = {
  A_FAIRE: "secondary",
  EN_COURS: "accent",
  TERMINEE: "default",
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
  );
}
