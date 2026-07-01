# CLAUDE.md — Préparateur physique virtuel rugby

> Source de vérité du projet. Les règles du haut priment. Cahier des charges : `docs/spec.md`.

## TIER 1 — Règles non négociables

- **Ne jamais coder avant un plan validé** pour toute tâche non triviale (3+ étapes ou décision d'archi). Entrer en mode plan, exposer les hypothèses, attendre l'accord.
- **Typage fort, zéro `any`.** TypeScript en mode `strict`. Pas de `@ts-ignore` sans commentaire justifiant.
- **Coverage ≥ 90 %** (global, bloquant en CI). Toute feature livrée avec ses tests.
- **Ne jamais committer de secret.** `.env` jamais versionné. Variables sensibles via Supabase / GitHub Secrets.
- **Commits conventionnels** (`feat:`, `fix:`, `chore:`, `test:`…). Petits commits, fréquents.
- **Ne pas inventer le contenu d'un fichier non lu.** Toujours lire avant de modifier.
- **Autorisation = couche applicative, PAS RLS** (Prisma contourne RLS). Toute fonction d'accès données récupère l'utilisateur via `getAuthUser()` et scope la requête par son id. Jamais d'id venant du client.

## Stack

- **Framework** : Next.js (App Router, Server Components par défaut). `"use client"` uniquement quand nécessaire.
- **Langage** : TypeScript strict.
- **UI** : Tailwind CSS + ShadCN/UI (primitives Radix). Icônes : lucide-react.
- **ORM** : Prisma.
- **Base / Auth** : Supabase (Postgres + Supabase Auth via `@supabase/ssr`).
- **Tests** : Vitest + React Testing Library. Coverage provider `v8`. **Pas de E2E pour le MVP.**
- **Validation** : Zod (schémas partagés front/serveur, inférés en types).
- **Qualité** : ESLint + Prettier, fallow (code mort / duplication / boundaries).
- **Hooks** : Husky + lint-staged. **CI/CD** : GitHub Actions. Déploiement : Vercel.
- **Dépendances** : Renovate (mises à jour automatiques, auto-merge des patchs).

## ⚠️ Prisma + Supabase (à respecter scrupuleusement)

Deux URLs distinctes, sinon les migrations cassent :

```env
# App (pooler, transaction mode)
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true&connection_limit=1"
# Migrations Prisma (connexion directe)
DIRECT_URL="postgresql://...:5432/postgres"
```

> **⚠️ Prisma 7** : les URLs ne vivent plus dans le bloc `datasource` du schéma
> (qui ne porte que `provider`) mais dans `prisma.config.ts`, et la connexion
> runtime passe par un **driver adapter**. Concrètement :
>
> - `prisma/schema.prisma` : `datasource db { provider = "postgresql" }` +
>   `generator client { provider = "prisma-client" output = "../src/generated/prisma" }`.
> - `prisma.config.ts` : `datasource.url = process.env.DIRECT_URL` (connexion
>   **directe**, utilisée par la CLI / migrations).
> - `src/lib/db.ts` (singleton) : `new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })`
>   → l'app passe par le **pooler**.
> - Le client généré (`src/generated/`) n'est **pas versionné** ; `prisma generate`
>   tourne via le script `postinstall`.

- Instancier le client Prisma en **singleton** (éviter l'épuisement de connexions en dev/hot-reload).
- Migrations via `prisma migrate dev` ; jamais de modif manuelle de la base.

## Architecture — feature-based

Le code est découpé par feature. Une feature n'importe une autre **que via son `index.ts`** (API publique). fallow vérifie ces frontières.

```
src/
  app/                      # routes Next.js (App Router) — fines, délèguent aux features
  components/ui/            # primitives ShadCN partagées (générées par CLI)
  features/
    <feature>/
      components/
        <Component>/
          <Component>.tsx
          <Component>.test.tsx
          index.ts
      hooks/                # use<Thing>.ts (+ .test.ts)
      server/               # server actions / accès données (+ .test.ts)
      schemas/              # schémas Zod
      types.ts
      index.ts              # barrel : seuls exports publics de la feature
  lib/                      # utilitaires transverses (db, supabase, utils)
  styles/                   # globals.css (design tokens)
```

**Features prévues** : `auth`, `onboarding`, `profiles`, `dashboard`, `program`, `session-feedback`, `weekly-review`, `program-generation`, `history`.

### Conventions

- **Tests co-localisés** : `Foo.tsx` → `Foo.test.tsx` à côté.
- Composants en PascalCase, hooks en `useXxx`, schémas Zod en `xxxSchema`.
- Types dérivés des schémas Zod (`z.infer`) plutôt que redéclarés.
- Pas de logique métier dans `app/` : elle vit dans `features/*/server` ou `features/*/hooks`.
- **Frontière client/serveur (RSC)** : l'`index.ts` d'une feature ne doit exposer que du **client-safe** (composants `"use client"`, Server Actions `"use server"`, schémas/enums isomorphes). Les fonctions d'accès données **serveur-only** (ex. lecture Prisma utilisant `next/headers`) sont exposées via `features/<feature>/server` et importées uniquement par des Server Components, pour ne pas fuiter dans le bundle client.
- **Routage par état** : garde en Server Component (layout du groupe `(app)` → exige un `Profile`, sinon `/onboarding` ; `/onboarding` renvoie au dashboard si le profil existe). Pas de Prisma dans le middleware (Edge).

## Auth (Supabase)

- Auth via **Supabase Auth** + `@supabase/ssr` (pas de NextAuth). Clients : `src/lib/supabase/{server,client}.ts`.
- Session rafraîchie et **routes protégées** par `src/middleware.ts` (helper `updateSession` dans `src/lib/supabase/middleware.ts`). Routes publiques : `/login`, `/signup`, `/forgot-password`, `/update-password`, `/auth/*`, `/error`.
- Côté serveur, toujours `supabase.auth.getUser()` (jamais `getSession()`).
- **Formulaires** : `react-hook-form` + `zodResolver` (validation client) adossés à des **Server Actions** (`features/auth/server/actions.ts`) qui revalident le schéma Zod (défense en profondeur). Pattern mutualisé : `AuthFormShell` + `AuthTextField` + hook `useAuthSubmit`.
- Confirmation d'email et reset de mot de passe via `app/auth/confirm/route.ts` (`verifyOtp`). `NEXT_PUBLIC_SITE_URL` requis pour les redirections d'emails.

## Moteur de génération (`program-generation`)

Cœur du produit (cahier des charges §9). **Décision d'archi : génération par LLM (ChatGPT)** — un prompt construit depuis le profil (objectif, durée, nb séances, poste, environnement, saison) ; le LLM renvoie un **JSON** structuré (semaine → séances → exercices). _(Cette décision remplace le « moteur déterministe » initialement envisagé.)_

- **Contrat de sortie** : `programPlanSchema` (Zod, `program-generation/schemas`). La sortie du LLM est **systématiquement revalidée** (source non fiable) avant persistance — c'est la garantie de typage/robustesse à la place du déterminisme.
- **Interface unique** : `generateProgramPlan(input): Promise<ProgramPlan>` — **mockée** pour l'instant (déterministe, ~100 % testée) ; l'appel ChatGPT réel (prompt + fetch + clé API) sera branché en dernier au même point, sans toucher au reste.
- **Persistance** : action `generateProgram` (`program-generation/server`) — `getAuthUser()`, scope `user.id`, `weekNumber = max+1`, transaction `Week` (+ `generatedPayload` = JSON brut pour l'historique/provenance) → `Session` → `Exercise`.
- **Adaptation « semaine suivante »** (profil + programme précédent + retours + bilan) : viendra après les jalons retour de séance (§7) et bilan (§8).

## Qualité & CI

Pipeline GitHub Actions (bloquant) : `typecheck` → `lint` → `test --coverage` (seuil 90 %) → `fallow` → `build`.

- **fallow** : `npx fallow audit --format json` en CI ; `npx fallow dead-code` en local. Skill agent : `fallow-rs/fallow-skills`.
- **Pre-commit** (lint-staged) : ESLint --fix + Prettier sur les fichiers stagés.
- **Pre-push** : `typecheck` + `test` rapides.
- **commitlint** : valide le format des messages de commit.

## Design system

Design : docs/design-system.md fait foi.

Charte graphique = design tokens en variables CSS. Thèmes clair/sombre. ShadCN consomme ces tokens. Toute couleur/espacement/typo passe par un token, jamais de valeur en dur.

> **⚠️ Tailwind v4 (CSS-first)** : pas de `tailwind.config.js`. Les tokens et le
> thème sont déclarés en CSS dans **`src/app/globals.css`** (`@import "tailwindcss";`,
> `@theme inline { … }`, `:root` / `.dark`). Le fichier vit dans `src/app/`
> (convention Next.js + chemin pointé par `components.json`), pas dans `src/styles/`
> — ce dernier reste disponible pour d'éventuels partials de tokens.

## UX (rappels produit)

- Remplir un retour de séance doit prendre **< 30 s** (§11).
- L'app doit transmettre : suivi personnalisé, progression continue, accompagnement pro, simplicité.

## Hors périmètre MVP (ne pas implémenter)

App mobile native, nutrition, suivi du poids, vidéos d'exercices, communauté, messagerie, classements, gamification, multi-sports, gestion avancée des blessures, montres connectées.

## Workflow attendu de l'agent

1. Lire `docs/spec.md` + ce fichier avant tout.
2. Travailler **un jalon à la fois** (voir roadmap). Faire une étape, s'arrêter, montrer, attendre validation.
3. Mettre à jour ce CLAUDE.md quand une convention ou un choix d'archi évolue.
