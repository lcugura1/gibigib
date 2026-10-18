-- CreateEnum
CREATE TYPE "EntryOutcome" AS ENUM ('GRANTED', 'INVALID_TOKEN', 'TOKEN_USED', 'TOKEN_EXPIRED', 'NO_MEMBERSHIP', 'MEMBERSHIP_PAUSED', 'ANTI_PASSBACK');

-- CreateTable
CREATE TABLE "EntryEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "entryTokenId" TEXT,
    "outcome" "EntryOutcome" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntryEvent_userId_outcome_createdAt_idx" ON "EntryEvent"("userId", "outcome", "createdAt");

-- CreateIndex
CREATE INDEX "EntryEvent_createdAt_idx" ON "EntryEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "EntryEvent" ADD CONSTRAINT "EntryEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryEvent" ADD CONSTRAINT "EntryEvent_entryTokenId_fkey" FOREIGN KEY ("entryTokenId") REFERENCES "EntryToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;
