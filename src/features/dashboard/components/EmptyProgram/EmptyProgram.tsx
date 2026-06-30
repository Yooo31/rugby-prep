import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GenerateProgramButton } from "@/features/program-generation";

export function EmptyProgram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aucun programme pour le moment</CardTitle>
        <CardDescription>
          Génère ton premier programme personnalisé.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenerateProgramButton />
      </CardContent>
    </Card>
  );
}
