import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "@/features/auth";

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>Commence ta préparation physique.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
