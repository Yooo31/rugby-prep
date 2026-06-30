import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EmptyProgram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aucun programme pour le moment</CardTitle>
        <CardDescription>
          Ton premier programme personnalisé arrivera bientôt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* La génération du programme est un jalon ultérieur. */}
        <Button disabled>Générer mon programme</Button>
      </CardContent>
    </Card>
  );
}
