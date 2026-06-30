import { z } from "zod";

const emailField = z.email("Adresse email invalide");
const strongPassword = z.string().min(8, "8 caractères minimum");

// Refine partagé : vérifie l'égalité mot de passe / confirmation.
const matchPasswords = (data: {
  password: string;
  confirmPassword: string;
}): boolean => data.password === data.confirmPassword;

const passwordMismatch = {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
};

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Mot de passe requis"),
});

export const signupSchema = z
  .object({
    email: emailField,
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine(matchPasswords, passwordMismatch);

export const resetRequestSchema = z.object({
  email: emailField,
});

export const updatePasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine(matchPasswords, passwordMismatch);

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ResetRequestInput = z.infer<typeof resetRequestSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
