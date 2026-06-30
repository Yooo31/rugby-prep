import { redirect } from "next/navigation";

import { getProfileForUser } from "@/features/profiles/server";

// Garde de routage : toute route du groupe (app) exige un Profile.
// getProfileForUser() force aussi l'authentification (via getAuthUser).
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfileForUser();
  if (!profile) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
