/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `MembershipProgram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capacity` to the `Gym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `MembershipProgram` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LockerStatus" AS ENUM ('LOCKED', 'UNLOCKED');

-- AlterEnum
ALTER TYPE "MembershipStatus" ADD VALUE 'PAUSED';

-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "capacity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MembershipProgram" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Locker" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" "LockerStatus" NOT NULL DEFAULT 'UNLOCKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Locker_number_key" ON "Locker"("number");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipProgram_slug_key" ON "MembershipProgram"("slug");
