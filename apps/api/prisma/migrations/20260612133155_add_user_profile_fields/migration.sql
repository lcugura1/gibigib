/*
  Warnings:

  - A unique constraint covering the columns `[oib]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oib` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "oib" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_oib_key" ON "User"("oib");
