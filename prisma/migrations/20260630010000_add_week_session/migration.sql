-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINEE');

-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'A_FAIRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Week_profileId_idx" ON "Week"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Week_profileId_weekNumber_key" ON "Week"("profileId", "weekNumber");

-- CreateIndex
CREATE INDEX "Session_weekId_idx" ON "Session"("weekId");

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;
