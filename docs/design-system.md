# Design system — direction « Pitch »

Référence canonique de la charte graphique. Toute évolution visuelle se réconcilie avec ce fichier. Stack : Next.js 16, Tailwind v4 (CSS-first), ShadCN.

## Direction

Athlétique, terrain, identitaire. Vert profond de pelouse comme couleur dominante, vert lime comme énergie. Sérieux mais vivant.

## Typographie

- **Affichage / titres** : Archivo (graisses 600, 700, 800). Donne le côté sportif, marqué.
- **Corps / UI** : Inter (400, 500, 600). Neutre, ultra lisible.

Chargement via `next/font/google` dans le layout racine, exposées en variables CSS `--font-archivo` (display) et `--font-inter` (sans). Les titres (`h1`–`h4` et composants de titre) utilisent `var(--font-display)` ; tout le reste utilise `var(--font-sans)`.

## Rayon

`--radius: 0.625rem` (10px). Cartes à 12px.

## Tokens couleur

Valeurs à injecter dans les blocs `:root` (clair) et `.dark` (sombre) de `globals.css`, mappées sur les noms de variables ShadCN. Ne pas casser la structure `@theme inline` ni le `@custom-variant dark` existants.

| Token ShadCN               | Clair     | Sombre    |
| -------------------------- | --------- | --------- |
| `--background`             | `#F7F9F3` | `#12150F` |
| `--foreground`             | `#1A1F16` | `#ECF0E6` |
| `--card`                   | `#FFFFFF` | `#181C13` |
| `--card-foreground`        | `#1A1F16` | `#ECF0E6` |
| `--popover`                | `#FFFFFF` | `#181C13` |
| `--popover-foreground`     | `#1A1F16` | `#ECF0E6` |
| `--primary`                | `#14532D` | `#5DBB63` |
| `--primary-foreground`     | `#F4F6F0` | `#0C2A14` |
| `--secondary`              | `#E7EDE0` | `#232A1B` |
| `--secondary-foreground`   | `#2C3A22` | `#D6DECB` |
| `--muted`                  | `#EDF1E7` | `#20271A` |
| `--muted-foreground`       | `#5B6A50` | `#9AA88C` |
| `--accent`                 | `#A3E635` | `#A3E635` |
| `--accent-foreground`      | `#1F3D0A` | `#1A2E07` |
| `--destructive`            | `#DC2626` | `#EF4444` |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--border`                 | `#E0E6D6` | `#2A3320` |
| `--input`                  | `#E0E6D6` | `#2A3320` |
| `--ring`                   | `#14532D` | `#A3E635` |

Optionnel (graphiques futurs) : `--chart-1 #14532D`, `--chart-2 #3F8F4E`, `--chart-3 #A3E635`, `--chart-4 #84CC16`, `--chart-5 #5B6A50`.

## Règles d'usage

- **Vert = primary partout** (boutons, actions clés). Le lime n'est pas une couleur de remplissage générale.
- **Lime = accent / énergie, avec parcimonie** : séance active, barre de progression, badge « en cours », emphase ponctuelle. Trop de lime tue le lime.
- **CTA héro** (« Générer mon programme ») : autorisé en aplat lime (fond `--accent`, texte `--accent-foreground`) pour le faire ressortir. Ailleurs, bouton primary vert classique.
- **Statuts de séance** : À faire = neutre (`--muted`) ; En cours = accent lime ; Terminée = primary vert. (À mapper sur le `SessionStatusBadge` existant.)
- **Titres en Archivo, généreux** ; corps en Inter. Pas de graisse 800 sur du petit texte.

## Accessibilité

Toutes les paires texte/fond visées AA. Vérifier sur les vrais composants en clair **et** en sombre — en particulier `primary-foreground` sur `primary`, et le texte vert foncé sur fond lime. Ajuster d'un cran si un composant passe sous 4.5:1.
