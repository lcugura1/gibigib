-- CreateTable
CREATE TABLE "MembershipPause" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembershipPause_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MembershipPause_membershipId_startedAt_idx" ON "MembershipPause"("membershipId", "startedAt");

-- AddForeignKey
ALTER TABLE "MembershipPause" ADD CONSTRAINT "MembershipPause_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
