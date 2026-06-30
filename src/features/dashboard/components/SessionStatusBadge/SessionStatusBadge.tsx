import { Badge } from "@/components/ui/badge";
import type { SessionStatus } from "@/generated/prisma/enums";

const STATUS_LABELS: Record<SessionStatus, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};

// Variantes = tokens du design system (aucune couleur en dur).
const STATUS_VARIANTS: Record<
  SessionStatus,
  "outline" | "default" | "secondary"
> = {
  A_FAIRE: "outline",
  EN_COURS: "default",
  TERMINEE: "secondary",
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
  );
}
