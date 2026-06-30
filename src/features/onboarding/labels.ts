import {
  Environnement,
  Jour,
  Objectif,
  Poste,
  Saison,
  SESSION_DURATIONS,
  SESSIONS_PER_WEEK,
} from "@/features/profiles";

export type Option = { value: string; label: string };

export const POSTE_OPTIONS: Option[] = [
  { value: Poste.PILIER, label: "Pilier" },
  { value: Poste.TALONNEUR, label: "Talonneur" },
  { value: Poste.DEUXIEME_LIGNE, label: "Deuxième ligne" },
  { value: Poste.TROISIEME_LIGNE, label: "Troisième ligne" },
  { value: Poste.DEMI_MELEE, label: "Demi de mêlée" },
  { value: Poste.DEMI_OUVERTURE, label: "Demi d'ouverture" },
  { value: Poste.CENTRE, label: "Centre" },
  { value: Poste.AILIER, label: "Ailier" },
  { value: Poste.ARRIERE, label: "Arrière" },
];

export const OBJECTIF_OPTIONS: Option[] = [
  { value: Objectif.MUSCULATION, label: "Musculation" },
  { value: Objectif.EXPLOSIVITE, label: "Explosivité" },
  { value: Objectif.VITESSE, label: "Vitesse" },
  { value: Objectif.ENDURANCE, label: "Endurance" },
  { value: Objectif.RETOUR_BLESSURE, label: "Retour de blessure" },
];

export const ENVIRONNEMENT_OPTIONS: Option[] = [
  { value: Environnement.MAISON, label: "Maison" },
  {
    value: Environnement.SALLE_COMPLETE,
    label: "Salle de musculation complète",
  },
];

export const SAISON_OPTIONS: Option[] = [
  { value: Saison.INTER_SAISON, label: "Inter-saison" },
  { value: Saison.DEBUT_SAISON, label: "Début de saison" },
  { value: Saison.MILIEU_SAISON, label: "Milieu de saison" },
  { value: Saison.FIN_SAISON, label: "Fin de saison" },
];

export const JOUR_OPTIONS: Option[] = [
  { value: Jour.LUNDI, label: "Lundi" },
  { value: Jour.MARDI, label: "Mardi" },
  { value: Jour.MERCREDI, label: "Mercredi" },
  { value: Jour.JEUDI, label: "Jeudi" },
  { value: Jour.VENDREDI, label: "Vendredi" },
  { value: Jour.SAMEDI, label: "Samedi" },
  { value: Jour.DIMANCHE, label: "Dimanche" },
];

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
