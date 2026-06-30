import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Accède à ton programme.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
