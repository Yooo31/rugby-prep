import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Lien invalide</CardTitle>
            <CardDescription>Ce lien est invalide ou a expiré.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              <Link href="/login" className="underline">
                Retour à la connexion
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
