# CLAUDE.md — Préparateur physique virtuel rugby

> Source de vérité du projet. Les règles du haut priment. Cahier des charges : `docs/spec.md`.

## TIER 1 — Règles non négociables

- **Ne jamais coder avant un plan validé** pour toute tâche non triviale (3+ étapes ou décision d'archi). Entrer en mode plan, exposer les hypothèses, attendre l'accord.
- **Typage fort, zéro `any`.** TypeScript en mode `strict`. Pas de `@ts-ignore` sans commentaire justifiant.
- **Coverage ≥ 90 %** (global, bloquant en CI). Toute feature livrée avec ses tests.
- **Ne jamais committer de secret.** `.env` jamais versionné. Variables sensibles via Supabase / GitHub Secrets.
- **Commits conventionnels** (`feat:`, `fix:`, `chore:`, `test:`…). Petits commits, fréquents.
- **Ne pas inventer le contenu d'un fichier non lu.** Toujours lire avant de modifier.

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

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

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

**Features prévues** : `auth`, `onboarding`, `dashboard`, `program`, `session-feedback`, `weekly-review`, `program-generation`, `history`.

### Conventions

- **Tests co-localisés** : `Foo.tsx` → `Foo.test.tsx` à côté.
- Composants en PascalCase, hooks en `useXxx`, schémas Zod en `xxxSchema`.
- Types dérivés des schémas Zod (`z.infer`) plutôt que redéclarés.
- Pas de logique métier dans `app/` : elle vit dans `features/*/server` ou `features/*/hooks`.

## Moteur de génération (`program-generation`)

Cœur du produit (cahier des charges §9). **Décision d'archi MVP : moteur déterministe à base de règles**, pas d'appel LLM — pour la testabilité et le typage. Entrées : profil, programme précédent, retours de séances, bilan hebdo. Sortie : programme de la semaine suivante avec charge ajustée. Doit être couvert à ~100 % par des tests unitaires (cas par poste, objectif, fatigue, etc.).

## Qualité & CI

Pipeline GitHub Actions (bloquant) : `typecheck` → `lint` → `test --coverage` (seuil 90 %) → `fallow` → `build`.

- **fallow** : `npx fallow audit --format json` en CI ; `npx fallow dead-code` en local. Skill agent : `fallow-rs/fallow-skills`.
- **Pre-commit** (lint-staged) : ESLint --fix + Prettier sur les fichiers stagés.
- **Pre-push** : `typecheck` + `test` rapides.
- **commitlint** : valide le format des messages de commit.

## Design system

Charte graphique = design tokens en variables CSS (`styles/globals.css`) + `tailwind.config`. Thèmes clair/sombre. ShadCN consomme ces tokens. Toute couleur/espacement/typo passe par un token, jamais de valeur en dur.

## UX (rappels produit)

- Remplir un retour de séance doit prendre **< 30 s** (§11).
- L'app doit transmettre : suivi personnalisé, progression continue, accompagnement pro, simplicité.

## Hors périmètre MVP (ne pas implémenter)

App mobile native, nutrition, suivi du poids, vidéos d'exercices, communauté, messagerie, classements, gamification, multi-sports, gestion avancée des blessures, montres connectées.

## Workflow attendu de l'agent

1. Lire `docs/spec.md` + ce fichier avant tout.
2. Travailler **un jalon à la fois** (voir roadmap). Faire une étape, s'arrêter, montrer, attendre validation.
3. Mettre à jour ce CLAUDE.md quand une convention ou un choix d'archi évolue.
