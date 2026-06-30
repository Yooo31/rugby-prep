import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionStatusBadge } from "@/features/dashboard/components/SessionStatusBadge";
import type { DashboardWeek } from "@/features/dashboard/types";

export function ProgramOverview({ week }: { week: DashboardWeek }) {
  const plural = week.sessionCount > 1 ? "s" : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semaine {week.weekNumber}</CardTitle>
        <CardDescription>
          {week.sessionCount} séance{plural} prévue{plural}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2">
          {week.sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-2"
            >
              <span>{session.name}</span>
              <SessionStatusBadge status={session.status} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
