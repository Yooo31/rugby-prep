import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OnboardingForm } from "@/features/onboarding";
import { getProfileForUser } from "@/features/profiles/server";

export default async function OnboardingPage() {
  // Exige l'auth (via getAuthUser) ; renvoie au dashboard si le profil existe.
  const profile = await getProfileForUser();
  if (profile) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue 👋</CardTitle>
            <CardDescription>
              Complète ton profil pour générer ton programme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
