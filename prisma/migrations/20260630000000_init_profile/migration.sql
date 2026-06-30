-- CreateEnum
CREATE TYPE "Poste" AS ENUM ('PILIER', 'TALONNEUR', 'DEUXIEME_LIGNE', 'TROISIEME_LIGNE', 'DEMI_MELEE', 'DEMI_OUVERTURE', 'CENTRE', 'AILIER', 'ARRIERE');

-- CreateEnum
CREATE TYPE "Objectif" AS ENUM ('MUSCULATION', 'EXPLOSIVITE', 'VITESSE', 'ENDURANCE', 'RETOUR_BLESSURE');

-- CreateEnum
CREATE TYPE "Environnement" AS ENUM ('MAISON', 'SALLE_COMPLETE');

-- CreateEnum
CREATE TYPE "Saison" AS ENUM ('INTER_SAISON', 'DEBUT_SAISON', 'MILIEU_SAISON', 'FIN_SAISON');

-- CreateEnum
CREATE TYPE "Jour" AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "position" "Poste" NOT NULL,
    "goal" "Objectif" NOT NULL,
    "sessionsPerWeek" INTEGER NOT NULL,
    "sessionDuration" INTEGER NOT NULL,
    "environment" "Environnement" NOT NULL,
    "season" "Saison" NOT NULL,
    "trainingDays" "Jour"[] DEFAULT ARRAY[]::"Jour"[],
    "matchDay" "Jour",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
