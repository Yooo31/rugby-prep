import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérifie tes mails</CardTitle>
        <CardDescription>
          Un lien de confirmation vient de t&apos;être envoyé. Clique dessus
          pour activer ton compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Une fois confirmé,{" "}
          <Link href="/login" className="underline">
            connecte-toi
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
