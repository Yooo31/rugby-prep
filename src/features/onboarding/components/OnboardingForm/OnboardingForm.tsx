"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckboxGroupField } from "@/features/onboarding/components/CheckboxGroupField";
import { SelectField } from "@/features/onboarding/components/SelectField";
import {
  ENVIRONNEMENT_OPTIONS,
  JOUR_OPTIONS,
  OBJECTIF_OPTIONS,
  POSTE_OPTIONS,
  SAISON_OPTIONS,
  SESSION_DURATION_OPTIONS,
  SESSIONS_PER_WEEK_OPTIONS,
} from "@/features/onboarding/labels";
import {
  createProfile,
  profileSchema,
  type ProfileInput,
} from "@/features/profiles";

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      position: undefined,
      goal: undefined,
      sessionsPerWeek: undefined,
      sessionDuration: undefined,
      environment: undefined,
      season: undefined,
      trainingDays: [],
      matchDay: undefined,
    },
  });

  function onSubmit(values: ProfileInput) {
    setError(null);
    startTransition(async () => {
      const result = await createProfile(values);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5"
        noValidate
      >
        {error ? (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input autoComplete="given-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectField
          control={form.control}
          name="position"
          label="Poste"
          placeholder="Choisis ton poste"
          options={POSTE_OPTIONS}
        />
        <SelectField
          control={form.control}
          name="goal"
          label="Objectif principal"
          placeholder="Choisis ton objectif"
          options={OBJECTIF_OPTIONS}
        />
        <SelectField
          control={form.control}
          name="sessionsPerWeek"
          label="Séances par semaine"
          placeholder="Nombre de séances"
          options={SESSIONS_PER_WEEK_OPTIONS}
        />
        <SelectField
          control={form.control}
          name="sessionDuration"
          label="Durée d'une séance"
          placeholder="Durée souhaitée"
          options={SESSION_DURATION_OPTIONS}
        />
        <SelectField
          control={form.control}
          name="environment"
          label="Environnement"
          placeholder="Où t'entraînes-tu ?"
          options={ENVIRONNEMENT_OPTIONS}
        />
        <SelectField
          control={form.control}
          name="season"
          label="Période de saison"
          placeholder="Choisis la période"
          options={SAISON_OPTIONS}
        />

        <CheckboxGroupField
          control={form.control}
          name="trainingDays"
          label="Jours d'entraînement collectif"
          options={JOUR_OPTIONS}
        />

        <SelectField
          control={form.control}
          name="matchDay"
          label="Jour de match (optionnel)"
          placeholder="Aucun / non défini"
          options={JOUR_OPTIONS}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Création…" : "Valider mon profil"}
        </Button>
      </form>
    </Form>
  );
}
