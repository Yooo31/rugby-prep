// API publique client-safe : `createProfile` est une Server Action ("use server"),
// le schéma et les enums sont isomorphes. Les fonctions d'accès données
// serveur-only (getProfileForUser) sont exposées via `@/features/profiles/server`
// pour éviter de faire fuiter `next/headers` dans le bundle client.
export { createProfile } from "./server/createProfile";
export {
  profileSchema,
  type ProfileInput,
  SESSIONS_PER_WEEK,
  SESSION_DURATIONS,
} from "./schemas/profile.schema";
export {
  POSTE_LABELS,
  OBJECTIF_LABELS,
  ENVIRONNEMENT_LABELS,
  SAISON_LABELS,
  JOUR_LABELS,
} from "./labels";
