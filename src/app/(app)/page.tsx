import { SignOutButton } from "@/features/auth";
import { getProfileForUser } from "@/features/profiles/server";

export default async function HomePage() {
  const profile = await getProfileForUser();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">
        Bonjour {profile?.firstName} 👋
      </h1>
      <p className="text-muted-foreground">
        Ton tableau de bord arrive bientôt.
      </p>
      <SignOutButton />
    </main>
  );
}
