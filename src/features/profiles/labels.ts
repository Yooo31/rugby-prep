import {
  Environnement,
  Jour,
  Objectif,
  Poste,
  Saison,
} from "@/generated/prisma/enums";

// Libellés lisibles des enums Profile (source unique, partagée onboarding/dashboard).

export const POSTE_LABELS: Record<Poste, string> = {
  PILIER: "Pilier",
  TALONNEUR: "Talonneur",
  DEUXIEME_LIGNE: "Deuxième ligne",
  TROISIEME_LIGNE: "Troisième ligne",
  DEMI_MELEE: "Demi de mêlée",
  DEMI_OUVERTURE: "Demi d'ouverture",
  CENTRE: "Centre",
  AILIER: "Ailier",
  ARRIERE: "Arrière",
};

export const OBJECTIF_LABELS: Record<Objectif, string> = {
  MUSCULATION: "Musculation",
  EXPLOSIVITE: "Explosivité",
  VITESSE: "Vitesse",
  ENDURANCE: "Endurance",
  RETOUR_BLESSURE: "Retour de blessure",
};

export const ENVIRONNEMENT_LABELS: Record<Environnement, string> = {
  MAISON: "Maison",
  SALLE_COMPLETE: "Salle de musculation complète",
};

export const SAISON_LABELS: Record<Saison, string> = {
  INTER_SAISON: "Inter-saison",
  DEBUT_SAISON: "Début de saison",
  MILIEU_SAISON: "Milieu de saison",
  FIN_SAISON: "Fin de saison",
};

export const JOUR_LABELS: Record<Jour, string> = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
  SAMEDI: "Samedi",
  DIMANCHE: "Dimanche",
};
