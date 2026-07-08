-- CreateTable
CREATE TABLE "TrainingTag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT,
    "color" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingTag_userId_idx" ON "TrainingTag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingTag_userId_date_key" ON "TrainingTag"("userId", "date");

-- AddForeignKey
ALTER TABLE "TrainingTag" ADD CONSTRAINT "TrainingTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
