import { SignOutButton } from "@/features/auth";
import {
  EmptyProgram,
  PlayerSummary,
  ProgramOverview,
} from "@/features/dashboard";
import { getDashboardData } from "@/features/dashboard/server";

export default async function DashboardPage() {
  const data = await getDashboardData();
  // Le layout du groupe (app) garantit déjà un Profile ; garde de sûreté.
  if (!data) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <SignOutButton />
      </header>

      <PlayerSummary
        firstName={data.firstName}
        position={data.position}
        goal={data.goal}
      />

      {data.week ? <ProgramOverview week={data.week} /> : <EmptyProgram />}
    </main>
  );
}
