import {
  ENVIRONNEMENT_LABELS,
  JOUR_LABELS,
  OBJECTIF_LABELS,
  POSTE_LABELS,
  SAISON_LABELS,
  SESSION_DURATIONS,
  SESSIONS_PER_WEEK,
} from "@/features/profiles";

export type Option = { value: string; label: string };

const toOptions = (labels: Record<string, string>): Option[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export const POSTE_OPTIONS = toOptions(POSTE_LABELS);
export const OBJECTIF_OPTIONS = toOptions(OBJECTIF_LABELS);
export const ENVIRONNEMENT_OPTIONS = toOptions(ENVIRONNEMENT_LABELS);
export const SAISON_OPTIONS = toOptions(SAISON_LABELS);
export const JOUR_OPTIONS = toOptions(JOUR_LABELS);

export const SESSIONS_PER_WEEK_OPTIONS: Option[] = SESSIONS_PER_WEEK.map(
  (n) => ({
    value: n,
    label: `${n} séance${n === "1" ? "" : "s"}`,
  }),
);

export const SESSION_DURATION_OPTIONS: Option[] = SESSION_DURATIONS.map(
  (d) => ({
    value: d,
    label: `${d} minutes`,
  }),
);
