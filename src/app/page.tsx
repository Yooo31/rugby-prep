import { redirect } from "next/navigation";

import { SignOutButton } from "@/features/auth";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">Bienvenue 👋</h1>
      <p className="text-muted-foreground">Connecté en tant que {user.email}</p>
      <SignOutButton />
    </main>
  );
}
